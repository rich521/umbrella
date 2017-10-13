import { AsyncStorage } from 'react-native';
import axios from 'axios';
import API from './key'; // You must create your own key.js file IMPORTANT
const DATA_KEY = '@localStore';
const SETTINGS_KEY = '@localStore';
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
    const localStore = await utils.getLocalData(DATA_KEY);

    if (localStore === null) {
      const position = await utils.getCurrentPosition(); // TODO catch
      const weather = await utils.getCurrentWeather(position);
      const lastUpdated = await utils.getCurrentTime();
      await utils.setLocalData(DATA_KEY, { position, weather, lastUpdated });

      return { position, weather, lastUpdated, isFetching:false };
    }

    let { position, weather, lastUpdated } = JSON.parse(localStore);
    console.log(lastUpdated);
    if(utils.getCurrentTime() - new Date(lastUpdated) > REFRESH_TIME){ //refresh time limit
      // check each item, then refetch if needed
      position = await utils.getCurrentPosition();
      weather = await utils.getCurrentWeather(position);
      lastUpdated = await utils.getCurrentTime();

      await utils.setLocalData(DATA_KEY, { position, weather, lastUpdated });
      return { position, weather, lastUpdated, isFetching:false };
  }
  return { remark: true, isFetching:false };
},

getCachedSettings: async () => {
  // Get the local settings
  const localStore = await utils.getLocalData(SETTINGS_KEY);

  if (localStore === null) {
    const isMetric = true;
    const reminderOn = false;
    const time = new Date('2017-01-01T07:00:00.000Z');
    await utils.setLocalData(SETTINGS_KEY, { isMetric, reminderOn, time });

    return { time, isMetric, reminderOn };
  }

  let { time, isMetric, reminderOn } = JSON.parse(localStore);
  return { time, isMetric, reminderOn };
},

setCachedSettings: async ( isMetric, reminderOn, time ) => {
  // Get the localdata
  await utils.setLocalData(SETTINGS_KEY, { isMetric, reminderOn, time });
}
};

export default utils;
