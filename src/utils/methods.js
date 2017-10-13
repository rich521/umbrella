import { AsyncStorage } from 'react-native';
import axios from 'axios';
import API from './key'; // You must create your own key.js file IMPORTANT
const DATA_KEY = '@localStore';
<<<<<<< HEAD
const REFRESH_TIME = 60000; // time required before second refresh (ms)
=======
const REFRESH_TIME = 2000; // time required before second refresh (ms)
>>>>>>> d15cdae0dc83c2db51b04d7e9339a14dd6cea1ed

// Uncomment this if you want to clearstorage. dont fetch api too often. clear once.
// AsyncStorage.clear();

const utils = {
<<<<<<< HEAD

  getCurrentPosition: () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(position => {resolve(position)});
=======
  getCurrentPosition: () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(position => resolve(position));
>>>>>>> d15cdae0dc83c2db51b04d7e9339a14dd6cea1ed
      //console.log(resolve);
    });
  },

  getCurrentWeather: ({ coords: { latitude, longitude } }) => {
    //return axios.get('https://httpbin.org/get'); // TESTing api from random source
<<<<<<< HEAD
    const URL_BASE = 'http://api.openweathermap.org/data/2.5/weather?';
    //const url = 'http://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1';
    const url = `${URL_BASE}lat=${latitude}&lon=${longitude}&appid=${API}&units=metric`;

    return new Promise((resolve) => {
      axios.get(url).then(response => {
        resolve(response.data);
      });
    });
=======
    //const URL_BASE = 'api.openweathermap.org/data/2.5/weather?';
    // TODO network error on SIMULATOR. need to change configurtion. URL works tested.
     //const url = `${URL_BASE}lat=${latitude}&lon=${longitude}&appid=${API}`;
     //const weather = axios.get('http://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1');
     //console.log(weather);
     //console.log(axios.get(url))
     const weather = {"coord":{"lon":139.01,"lat":35.02},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"base":"stations","main":{"temp":285.514,"pressure":1013.75,"humidity":100,"temp_min":285.514,"temp_max":285.514,"sea_level":1023.22,"grnd_level":1013.75},"wind":{"speed":5.52,"deg":311},"clouds":{"all":0},"dt":1485792967,"sys":{"message":0.0025,"country":"JP","sunrise":1485726240,"sunset":1485763863},"id":1907296,"name":"Tawarano","cod":200};

     return weather;
>>>>>>> d15cdae0dc83c2db51b04d7e9339a14dd6cea1ed
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
<<<<<<< HEAD
      //if (!position)
      position = await utils.getCurrentPosition();
      //if (!weather)
      weather = await utils.getCurrentWeather(position);
=======
      if (!position) position = await utils.getCurrentPosition();
      if (!weather) weather = await utils.getCurrentWeather(position);
>>>>>>> d15cdae0dc83c2db51b04d7e9339a14dd6cea1ed
      lastUpdated = await utils.getCurrentTime();

      await utils.setLocalData({ position, weather, lastUpdated });
      return { position, weather, lastUpdated, isFetching:false };
  }
  return { remark: true, isFetching:false };
  }
};

export default utils;
