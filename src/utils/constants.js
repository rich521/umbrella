import utils from './methods';

const defaultState = {
  isRaining: false,

  /* localStorage  */
  position: {
    coords: {
      longitude: '50',
      latitude: '50',
    }
  },
  weather: 'sunny',
  lastUpdated: utils.getCurrentTime(),

};

export default defaultState;
