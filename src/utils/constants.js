const defaultState = {
  isFetching:false,
  isRaining: false,
  remark:'',
  /* localStorage  */
  position: null,
  weather: null,
  lastUpdated: null,
  /* settingStorage */
  reminderOn: false,
  time: new Date('2017-01-01T07:00:00.000Z'),
  isMetric : true,
};

export default defaultState;
