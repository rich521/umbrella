import { AsyncStorage } from 'react-native';
import axios from 'axios';
import API from './key'; // You must create your own key.js file IMPORTANT

const KEY = {
  WEATHER : '@localStore',
  SETTINGS : '@localStore'}
const REFRESH_TIME = 60000; // time required before second refresh (ms)

// Uncomment this if you want to clearstorage. dont fetch api too often. clear once.
// AsyncStorage.clear();

const utils = {
  getCurrentPosition: () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(position => resolve(position));
      //console.log(resolve);
    });
  },

  getCurrentWeather: ({ coords: { latitude, longitude } }) => {
    //return axios.get('https://httpbin.org/get'); // TESTing api from random source
    const URL_BASE = 'http://api.openweathermap.org/data/2.5/weather?';
    //const url = 'http://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1';
    const url = `${URL_BASE}lat=${latitude}&lon=${longitude}&appid=${API}&units=metric`;

    return new Promise((resolve) => {
      axios.get(url).then(response => {
        resolve(response.data);
      });
    });
     //return(null);
  },

  // unix timestamp
  getCurrentTime: () => new Date(),

  getLocalData: key => AsyncStorage.getItem(key),

  setLocalData: (key, data) => AsyncStorage.setItem(key, JSON.stringify(data)),

  deleteLocalData: () => AsyncStorage.clear(),

  getCachedItems: async () => {
    // Get the localdata
    const localStore = await utils.getLocalData(KEY.WEATHER);

    if (localStore === null) {
      const weatherData = {
        position : await utils.getCurrentPosition(), // TODO catch
        weather : await utils.getCurrentWeather(position),
        lastUpdated : await utils.getCurrentTime(),
      };
      await utils.setLocalData(KEY.WEATHER, weatherData);
      return weatherData;
    }

    let { position, weather, lastUpdated } = JSON.parse(localStore);

    if (utils.getCurrentTime() - new Date(lastUpdated) > REFRESH_TIME){ //refresh time limit
      // check each item, then refetch if needed
      position = await utils.getCurrentPosition();
      weather = await utils.getCurrentWeather(position);
      lastUpdated = await utils.getCurrentTime();

      await utils.setLocalData(KEY.WEATHER, { position, weather, lastUpdated });
      return { position, weather, lastUpdated };
    }

    return { position, weather, remark: true };
  },

  getCachedSettings: async () => {
    // Get the local settings
    const localStore = await utils.getLocalData(KEY.SETTINGS);

    if (localStore === null) {
      const settingData = {
       isMeric: true,
       remindOn: false,
       time: new Date('2017-01-01T07:00:00.000Z'),
      };
      await utils.setLocalData(KEY.SETTINGS, settingData);

      return settingData;
    }

    return JSON.parse(localStore);
  },

  setCachedSettings: async (settingData) => {
    // Set the local settings
    await utils.setLocalData(KEY.SETTINGS, settingData );
  }
};

export default utils;
