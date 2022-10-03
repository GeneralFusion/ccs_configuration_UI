//  const YAML = require('js-yaml');
//  const fs = require('fs');

export const loadYAML = (fileName) => {
    //let returnYAML = YAML.load(fs.readFileSync(fileName, 'utf-8'));
    let returnYAML;
    if(fileName === "test.yml"){
      returnYAML = {
        "clients": {
          "1": {
            "channel": 1,
            "temp": 6.3,
            "isShooting": true,
            "memorySize" : "7K"
          },
          "2": {
            "channel": 8,
            "temp": 2.1,
            "isShooting": true,
            "memorySize": "14K"
          }
        }
      }
    }
    else{
      returnYAML = {
        "clients": {
          "9": {
            "channel": 1,
            "temp": 6000.3,
            "isShooting": true,
            "memorySize" : "7K"
          },
          "7": {
            "channel": 3,
            "temp": -9.1,
            "isShooting": true,
            "memorySize": "14K"
          }
        }
      }
    }
    return(returnYAML);
}