import { AsyncStorage, Platform } from 'react-native';
import axios from 'axios';
import API from './key'; // You must create your own key.js file IMPORTANT
import { KEY } from './constants';

const REFRESH_TIME = 60000; // time required before second refresh (ms)

// Uncomment this if you want to clearstorage. dont fetch api too often. clear once.
// AsyncStorage.clear();

//const sampleWeather = {"coord":{"lon":139.01,"lat":35.02},"weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01n"}],"base":"stations","main":{"temp":285.514,"pressure":1013.75,"humidity":100,"temp_min":285.514,"temp_max":285.514,"sea_level":1023.22,"grnd_level":1013.75},"wind":{"speed":5.52,"deg":311},"clouds":{"all":0},"dt":1485792967,"sys":{"message":0.0025,"country":"JP","sunrise":1485726240,"sunset":1485763863},"id":1907296,"name":"Tawarano","cod":200};

const utils = {
  isAndroid: () => Platform.OS === 'android',

  fetchSettings: async () => {
    const localSettings = await utils.getLocalData(KEY.SETTINGS);
    if (localSettings === null) {
      const initDate = new Date();
      initDate.setHours('07');
      initDate.setMinutes('00');
      const sevenAmDate = initDate.toDateString();
      const storedState = {
        date: sevenAmDate,
        isNotifyOn: false,
      };
      await utils.setLocalData(KEY.SETTINGS, storedState);
      return storedState;
    }

    return JSON.parse(localSettings);
  },

  setSettings: async (stateData) => {
    await utils.setLocalData(KEY.SETTINGS, stateData);
  },

  getCurrentPosition: () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(position => resolve(position));
    });
  },

  getCurrentWeather: async ({latitude,longitude}) => {
    // const URL_BASE = 'http://api.openweathermap.org/data/2.5/weather?';
    const URL_BASE = 'http://api.openweathermap.org/data/2.5/forecast?';
    //const url = 'http://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1';
    const url = `${URL_BASE}lat=${latitude}&lon=${longitude}&appid=${API}&units=metric`;
    return new Promise((resolve) => {
      axios.get(url).then(response => {
        resolve(response.data);
      });
    });
    //return(null);
  },

  retrieveDayForecast: async (data,count) => {
    const d = new Date();
    const z = n => n.toString().length === 1 ? `0${n}` : n ;// Zero pad
    const date = `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`; // returns (2017-11-10 ie YYYY-MM-DD)

    let description = "";
    for (let i=0; i< count; i++){
      if (data.list[i].dt_txt.indexOf(date) === -1) break; //find if the items in the list are todays forcast only
      description = `${description} ${data.list[i].weather[0].description}`; //append descriptions into one variable
    }
    let isRaining = false;
    if( description.indexOf("rain") >= 0 ) isRaining = true;
    return { description, isRaining };
  },

  getCurrentTime: () => new Date(),

  getLocalData: key => AsyncStorage.getItem(key),

  setLocalData: (key, data) => AsyncStorage.setItem(key, JSON.stringify(data)),

  deleteLocalData: (key) => AsyncStorage.multiRemove([key]),

  refreshCachedItems: async () => {

    let { position, weather, lastUpdated, isRaining, description } = await utils.getCachedItems(); //get local data

    if (utils.getCurrentTime() - new Date(lastUpdated) > REFRESH_TIME) { //refresh time limit
      // check each item, then refetch if needed
      position = await utils.getCurrentPosition();
      weather = await utils.getCurrentWeather(position.coords);
      let { description, isRaining } = await utils.retrieveDayForecast(weather,weather.cnt);
      lastUpdated = await utils.getCurrentTime();

      await utils.setLocalData(KEY.WEATHER, { position, weather, lastUpdated, description, isRaining });
      return { position, weather, lastUpdated, description, isRaining };
    }

    return { position, weather, lastUpdated, description ,isRaining, remark: true };
  },

  getCachedItems: async () => {
    // Get the localdata
    const localStore = await utils.getLocalData(KEY.WEATHER);

    if (localStore === null) {
      const position = await utils.getCurrentPosition(); // TODO catch
      const weatherData = {
        isRaining:false,
        description:'',
        position, // TODO catch
        weather : await utils.getCurrentWeather(position.coords),
        lastUpdated : await utils.getCurrentTime(),
      };
      await utils.setLocalData(KEY.WEATHER, weatherData);
      return weatherData;
    }
    return JSON.parse(localStore);
  },

  setCachedSettings: async (settingData) => {
    // Set the local settings
    await utils.setLocalData(KEY.SETTINGS, settingData );
  }
};

export default utils;
