import { AsyncStorage } from 'react-native';
import axios from 'axios';
import API from './key'; // You must create your own key.js file IMPORTANT
const DATA_KEY = '@localStore';
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

  getLocalData: () => AsyncStorage.getItem(DATA_KEY),
  /**
    * @params {Object} --> Object: { position, weather, lastUpdated }
  **/
  setLocalData: data => AsyncStorage.setItem(DATA_KEY, JSON.stringify(data)),

  deleteLocalData: () => AsyncStorage.clear(),

  getCachedItems: async () => {
    // Get the localdata
    const localStore = await utils.getLocalData();

    if (localStore === null) {
      const position = await utils.getCurrentPosition(); // TODO catch
      const weather = await utils.getCurrentWeather(position);
      const lastUpdated = await utils.getCurrentTime();
      await utils.setLocalData({ position, weather, lastUpdated });

      return { position, weather, lastUpdated, isFetching:false };
    }

    let { position, weather, lastUpdated } = JSON.parse(localStore);

    if(utils.getCurrentTime() - new Date(lastUpdated) > REFRESH_TIME){ //refresh time limit
      // check each item, then refetch if needed
      //if (!position)
      position = await utils.getCurrentPosition();
      //if (!weather)
      weather = await utils.getCurrentWeather(position);
      lastUpdated = await utils.getCurrentTime();

      await utils.setLocalData({ position, weather, lastUpdated });
      return { position, weather, lastUpdated, isFetching:false };
  }
  return { remark: true, isFetching:false };
  }
};

export default utils;
