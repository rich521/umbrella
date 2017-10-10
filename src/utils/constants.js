import utils from './methods';

const defaultState = {
  isRaining: false,

  /* localStorage  */
  position: null,
  weather: null,
  lastUpdated: utils.getCurrentTime(),

};

export default defaultState;
