import multiprocessing
import bson
import struct
from numpy import array as npArray
if __name__ == '__main__':
    print("here")
    multiprocessing.freeze_support()

class DataParser:
    def __init__(self, filePath):
        self.data = None
        self.filePath = filePath
        self.dataArr = multiprocessing.Manager().list()
        self.channelsAmount = 0
    def runWorkers(self, channelNumbers):
        processes = []
        for channelNumber in channelNumbers:
            process = multiprocessing.Process(target=self.prepareChannels, args=(channelNumber,))
            process.start()
            processes.append(process)
            

        for process in processes:
            process.join()
        print("All tasks finished")
    def prepareChannels(self, channelNumber):
        print("Started unpacking")
        uData = self.unpackBinaryDataFromScopeForChannel(channelNumber)
        print("Finished Unpacking, Starting formatting")
        self.formatRawBinaryDataForChannel(channelNumber, uData)
        print("Finished Formatting")
        
    def decodeData(self):
        with open(self.filePath, 'rb') as bsonFile:
            self.data = bson.BSON.decode(bsonFile.read())

    def formatRawBinaryDataForChannel(self, channelNumber, unpackedData):

        channel = str(self.data['activeChannels'][channelNumber])
        self.dataArr.append((npArray(unpackedData)-self.data['channels'][str(channel)]['yReference'])*\
            self.data['channels'][str(channel)]['yIncrement']+\
                self.data['channels'][str(channel)]['yOrigin'])
        self.channelsAmount += 1

    def unpackBinaryDataFromScopeForChannel(self, channelNumber):

        binaryData = self.data['channels'][str(str(self.data['activeChannels'][channelNumber]))]['rawData']
        
        if self.data['waveFormFormat'] == "BYTE":
            formattedData = struct.unpack("%dB" % len(binaryData), binaryData)
        elif self.data['waveFormFormat'] == "WORD":
            formattedData = struct.unpack(f">{len(binaryData)//2}h", binaryData)
        return formattedData
    def __del__(self):
        print("DESTROYED PARSER")


'''
data_dict = {shotnum: {channel: raw_binary}}

def unpack(run_sig, notify_sig, in_q, out_q):
    run_sig.wait()
    while run_sig == True:
        notify_sig.wait()
        raw_data = in_q.pop()
        parsed_data = unpackBinaryDatafromScope(raw_data)
        out_q.push(parsed_data)

        if in_q.is_empty():
            notify_sig.clear()

mp.Process(target=unpack, (run_sig, ...)
'''