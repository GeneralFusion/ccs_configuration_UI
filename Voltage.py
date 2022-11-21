
from audioop import mul
import ctypes
from bson import BSON
import threading
from struct import unpack as structUnpack
import numpy as np
from math import ceil
import pathlib
from time import time
from DataParser import DataParser
BINARYFILEPATH = pathlib.Path.cwd() / "scint_scope.bin"

decodedData = None
channelsDict = {}



# unpack binary data into a list of integers
def getChannelOptions(rawChannel, channelNumber):
        channelNumStr = str(channelNumber)
        returnDict = {
            'waveFormat': rawChannel['waveFormFormat'],
            'yReference': rawChannel['channels'][channelNumStr]['yReference'],
            'yIncrement': rawChannel['channels'][channelNumStr]['yIncrement'],
            'yOrigin': rawChannel['channels'][channelNumStr]['yOrigin']
        }
        return returnDict
def decodeChannel(channelData, dic,channelNumber,waveFormat, yReference, yIncrement, yOrigin):
    print(f"Started decoding channel {channelNumber}")   
    t = time() 
    if waveFormat == "BYTE":
        formattedData = structUnpack("%dB" % len(channelData), channelData)
    elif waveFormat == "WORD":
        formattedData = structUnpack(f">{len(channelData)//2}h", channelData)
    print(f'Time to unpack struct {time() - t}')
    t = time()
    returnChannel = (np.array(formattedData)-yReference)*\
            yIncrement+\
                yOrigin
    print(f'Time to convert channel to np array {time() - t}')
    dic[channelNumber] = returnChannel


def decodeData(filePath):
    with open(filePath, 'rb') as bsonFile:
        print("starting to decode binary file...")
        data = BSON.decode(bsonFile.read())
        print("finished decoding process...")
    return data

def getBinData(startIndex=1, endIndex=1000000,amountOfPoints=1000, channels=[]):    
    global channelsDict
    global decodedData
    gTime = time()
    rArr = []
    threads = []
    if not decodedData:
        t = time()
        decodedData = decodeData(BINARYFILEPATH)
        print(f'Time to decodeData() {time() - t}')
    for channelNumber in channels:
        if channelNumber not in channelsDict:
            options = getChannelOptions(decodedData, channelNumber)
            channel = decodedData['channels'][str(channelNumber)]['rawData']
            print(f'{len(channel)} length before')
            #t = threading.Thread(target=decodeChannel, args=(channel,channelsDict, channelNumber, options['waveFormat'], options['yReference'], options['yIncrement'], options['yOrigin']))
            #threads.append(t)
            decodeChannel(channel,channelsDict,channelNumber,**options)
            #print(f'{len(channelsDict[channelNumber])} after')
    # for thread in threads:
    #     thread.start()
    # for thread in threads:
    #     thread.join()
    #Put this in seperate function 
    if endIndex > decodedData['timeSeriesData']['numPoints']:#Check if end index is too much
        endIndex = decodedData['timeSeriesData']['numPoints']
        print("Setting end index to maximum point value")
    if startIndex < 0:
        startIndex = 0
        print("Setting start index to minimum point value")

    totalPoints = endIndex - startIndex
    step = max(ceil(totalPoints / amountOfPoints), 1)
    print(f'Total: {totalPoints}')
    print(f'Step: {step}')
    t = time()
    for i in range(startIndex - 1, endIndex, step):#Startindex - 1 since array starts at 0 but we call it point 1
        subArr = [i]
        for channelNumber in channels:
            subArr.append(channelsDict[channelNumber][i])
    
        rArr.append(subArr)
    #     #rArr.append({'x':i, 'y':iters[i]})
    #rArr.append([endIndex, channelsDict[0][endIndex - 1]])#Add last point
    print(f'Time to loop through all points {time() - t}')
    print(f"Total time {time() - gTime}")
    return rArr
    # print()
    # for i in range(5):
    #     rArr.append([i, p.dataArr[0][i]])
    # return rArr
    print("Finished")   
    '''
        1 channel = 6s
        2 channels = 12s
        3 channel = 20s
        4 channel = 31s
        5 channels = 41s
        6 channels = 46s (STATIC CHANNEL #6)
        7 channels = 55s
        Make it so that there is a seperate array with values [[x, y], [x,y], ...] that are all important values. 
        Meaning they are long lines/extremes in the data. If the user selected range contains any of these values, append them to the end of the
        array sent back regardless if they are in the step or not. This way we just append them onto the end without doing any checks or
        looping through each and every loop which takes longer than just looping and having the step as the increment in the loop. 
        
        for i in range(startIndex, endIndex):
            if i % step == 0 or iters[i] < -0.008:
                rArr.append([i,iters[i]])
    '''