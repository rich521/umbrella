import { AsyncStorage } from 'react-native';

const DATA_KEY = '@localStore';

const utils = {
  getCurrentPosition: () => navigator.geolocation.getCurrentPosition(position => position),

  getCurrentWeather: () => 'sunny', // TODO add api methods here

  // unix timestamp
  getCurrentTime: () => Math.round((new Date()).getTime() / 1000),

  getLocalData: () => AsyncStorage.getItem(DATA_KEY),

  setLocalData: async () => AsyncStorage.setItem(DATA_KEY, JSON.stringify({
    lastUpdated: utils.getCurrentTime(),
    position: await utils.getCurrentPosition(),
    weatherData: await utils.getCurrentWeather(),
  })),
};

export default utils;
