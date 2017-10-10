import { AsyncStorage } from 'react-native';
import axios from 'axios';
import URL_BASE from './key'; // You must create your own key.js file IMPORTANT
const DATA_KEY = '@localStore';

// Uncomment this if you want to clearstorage. dont fetch api too often. clear once.
// AsyncStorage.clear();

const utils = {
  getCurrentPosition: () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(position => resolve(position));
    });
  },

  getCurrentWeather: ({ coords: { latitude, longitude } }) => {
    // return axios.get('https://httpbin.org/get'); // TEST

    // TODO network error on SIMULATOR. need to change configurtion. URL works tested.
    const url = `${URL_BASE}&lat=${latitude}&lon=${longitude}`;
    console.log(url);
    return axios.get(url);
  },

  // unix timestamp
  getCurrentTime: () => new Date().toDateString(),

  getLocalData: () => AsyncStorage.getItem(DATA_KEY),

  /**
    * @params {Object} --> Object: { position, weather, lastUpdated }
  **/
  setLocalData: data => AsyncStorage.setItem(DATA_KEY, JSON.stringify(data)),


  getCachedItems: async () => {
    // Get the localdata
    const localStore = await utils.getLocalData();

    if (localStore === null) {
      console.log('only run once..!!');
      const position = await utils.getCurrentPosition(); // TODO catch
      const weather = await utils.getCurrentWeather(position);
      console.log(weather);
      const lastUpdated = await utils.getCurrentTime();
      await utils.setLocalData({ position, weather: `${weather}`, lastUpdated });

      console.log(weather);

      return { position, weather, lastUpdated };
    }

    // TODO do an update time check to limit calls on weather api

    let { position, weather, lastUpdated } = JSON.parse(localStore);
    // check each item, then refetch if needed
    if (!position) position = await utils.getCurrentPosition();
    if (!weather) weather = await utils.getCurrentWeather();
    if (!lastUpdated) lastUpdated = await utils.getCurrentTime();

    await utils.setLocalData({ position, weather, lastUpdated });
    return { position, weather, lastUpdated };
  }
};

export default utils;
