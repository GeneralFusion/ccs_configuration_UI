import pickle
import Voltage
def getSampleData(startIndex, endIndex,amountOfPoints, channels):
 
    # with open("nums.txt", "rb") as fp:
    #     d = pickle.load(fp)
    # for i in range(0, len(d), 10000):
    #     data.append({'x': i, 'y': d[i]})
    
    return Voltage.getBinData(startIndex=startIndex, endIndex=endIndex, amountOfPoints=amountOfPoints, channels=channels)
    # return 