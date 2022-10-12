
import bson

import struct
import numpy as np
from math import ceil
import itertools

binaryFilePath = r"Z:/Personal/Ali/Sample Data/18625/scint_scope.bin"

data = None
unpackedData = None
iters = None
currentIterIndex = 0



# unpack binary data into a list of integers
def unpackBinaryDataFromScopeForChannel(data, channel):
    print("Unpacking Binary Data")
    binaryData = data['channels'][str(channel)]['rawData']
    # return struct.unpack("%dB" % len(binaryData), binaryData)
    if data['waveFormFormat'] == "BYTE":
        return struct.unpack("%dB" % len(binaryData), binaryData)
    elif data['waveFormFormat'] == "WORD":
        return struct.unpack(f">{len(binaryData)//2}h", binaryData)

def formatRawBinaryDataForChannel(dataDict, channel):
    # dataDict[str(channel)].voltValue =  list(np.array(dataDict[str(channel)].rawData)*dataDict[str(channel)].channelReadData.yIncrement+dataDict[str(channel)].channelReadData.voltageOffset)
    global unpackedData
    global iters
    global currentIterIndex
    if unpackedData is None:
        unpackedData = unpackBinaryDataFromScopeForChannel(dataDict, channel)
    if(iters is None or currentIterIndex + 1 == len(iters)):
        print("Creating Iterators")
        iti = iter((np.array(unpackedData)-dataDict['channels'][str(channel)]['yReference'])*\
            dataDict['channels'][str(channel)]['yIncrement']+\
                dataDict['channels'][str(channel)]['yOrigin'])
        iters = itertools.tee(iti, 10)
        currentIterIndex = -1
    currentIterIndex += 1
    return(iters[currentIterIndex])
voltValues = []

def plotGraphForChannel(channelData, channel):
    pass

# for channel in data['activeChannels']:
#        voltValues.append(formatRawBinaryDataForChannel(data, str(channel)))
#     #    plotGraphForChannel(data,channel)
#print(formatRawBinaryDataForChannel(data, str(data['activeChannels'][0])))
# with open('scint.txt', 'w') as f:
#     f.write("%s" % formatRawBinaryDataForChannel(data, str(data['activeChannels'][0])))
def decodeData():
    global data
    if data is None:
        with open(binaryFilePath, 'rb') as bsonFile:
            print("starting to decode binary file...")
            data = bson.BSON.decode(bsonFile.read())
            print("finished decoding process...")

def getBinData(startIndex=1, endIndex=1000000, amountOfPoints=1000):    
    rArr = []
    
    decodeData()
    formattedList = formatRawBinaryDataForChannel(data, str(data['activeChannels'][5]))
    print("Using Iterator to push points")
    
    #Put this in seperate function 

    totalPoints = (endIndex - startIndex)
    step = ceil(totalPoints / amountOfPoints)
    j = 0
    for l in range(startIndex):
        next(formattedList)

    for i in range(totalPoints):
        p = next(formattedList)

        if(j == step or i == 0):
            j = 0
            rArr.append({'x':startIndex + i,'y':p})
        j += 1


    print("Finished")
    print(startIndex)
    return rArr
