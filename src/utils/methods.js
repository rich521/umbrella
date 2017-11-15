import { AsyncStorage, Platform, Alert } from 'react-native';
import API from './key'; // You must create your own key.js file IMPORTANT
import { KEY } from './constants';

const REFRESH_TIME = 6000; // time required before second refresh (ms)
const utils = {
  isAndroid: () => Platform.OS === 'android',

  getCurrentPosition: async () => {
    try{
      const positionPromise = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, ({code, message}) =>
          reject(Object.assign(new Error(message), {name: "PositionError", code})),
          {timeout: 5000}
        );
        });
      return positionPromise;
    } catch (err) {
      Alert.alert('Error','Error retrieving location. Try refreshing again',[{text: 'OK'}]);
      return null;
    }
  },

  getCurrentWeather: async ({latitude,longitude}) => {
  // //const url = 'http://samples.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=b1b15e88fa797225412429c1c50c122a1';
  const URL_BASE = 'https://api.openweathermap.org/data/2.5/forecast?';
  const url = `${URL_BASE}lat=${latitude}&lon=${longitude}&appid=${API}&units=metric`;
    try {
      let response = await fetch(url);
      const bodyText = response._bodyText;
      if (bodyText && typeof response._bodyText === 'string') {
        return JSON.parse(response._bodyText);
      } else {
        return response.data;
      }

    } catch (err) {
      Alert.alert('Error','Error retrieving weather. Try refreshing again',[{text: 'OK'}]);
      return null;
    }
  },

  retrieveDayForecast: (data,count) => {
    const d = new Date();
    const z = n => n.toString().length === 1 ? `0${n}` : n ;// Zero pad
    const date = `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}`; // returns (2017-11-10 ie YYYY-MM-DD)
    const tempMinMax = {
      min:1000,
      max:-1000,
    }
    let weatherDescription = "";
    for (let i=0; i< count; i++){
      if (data.list[i].dt_txt.indexOf(date) === -1) break; //find if the items in the list are todays forcast only
      tempMinMax.min = data.list[i].main.temp_min<tempMinMax.min? data.list[i].main.temp_min : tempMinMax.min;
      tempMinMax.max = data.list[i].main.temp_max>tempMinMax.max? data.list[i].main.temp_max : tempMinMax.max;
      weatherDescription = `${weatherDescription} ${data.list[i].weather[0].description}`; //append descriptions into one variable
    }
    let isRaining = false;
    if( weatherDescription.indexOf("rain") >= 0 ) isRaining = true;
    return { newDescription: { weatherDescription, tempMinMax }, newIsRaining: isRaining };
  },

  getCurrentTime: () => new Date(),

  getLocalData: key => AsyncStorage.getItem(key),

  setLocalData: (key, data) => AsyncStorage.setItem(key, JSON.stringify(data)),

  deleteLocalData: (key) => AsyncStorage.multiRemove([key]),

  refreshCachedItems: async () => {
    const oldItems = await utils.getCachedItems(); //get local data
    let newItems = { isRaining : null, description: null, position: null, weather : null, lastUpdated : null };

    if (utils.getCurrentTime() - new Date(oldItems.lastUpdated) > REFRESH_TIME) { //refresh time limit
      newItems.position = await utils.getCurrentPosition();
      if(newItems.position) newItems.weather = await utils.getCurrentWeather(newItems.position.coords);
      if (newItems.weather){
        const { newDescription, newIsRaining } = await utils.retrieveDayForecast(newItems.weather,newItems.weather.cnt);
        newItems = { ...newItems, description: newDescription, isRaining: newIsRaining };
        newItems.lastUpdated = await utils.getCurrentTime();
      }

      if (newItems.weather && newItems.position && newItems.description ){
        await utils.setLocalData(KEY.WEATHER, newItems);
        return newItems;
      }else{
        await utils.setLocalData(KEY.WEATHER, { ...oldItems, remark: true });
        return oldItems;
      }
    }

    return { ...oldItems, remark: true };
  },

  getCachedItems: async () => {
    // Get the localdata
    const localStore = await utils.getLocalData(KEY.WEATHER);
    if (localStore === null) {
      const position = await utils.getCurrentPosition(); // TODO catch
      const weatherData = {
        isRaining:false,
        description:'',
        position,
        weather : await utils.getCurrentWeather(position.coords),
        lastUpdated : await utils.getCurrentTime(),
      };
      if(!(weatherData.position && weatherData.weather)) return null; // if error occurs return null data
      await utils.setLocalData(KEY.WEATHER, weatherData);
      return weatherData;
    }
    return JSON.parse(localStore);
  },

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
        isMetric: true,
      };
      await utils.setLocalData(KEY.SETTINGS, storedState);
      return storedState;
    }
    return JSON.parse(localSettings);
  },

  setCachedSettings: async (settingData) => {
    // Set the local settings
    await utils.setLocalData(KEY.SETTINGS, settingData );
  }
};

export default utils;
