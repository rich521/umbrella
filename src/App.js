import React, { Component } from 'react';
import { Text, View, AppState } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PushNotification from 'react-native-push-notification';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Spinner, Button } from './components/common';
import BackgroundTask from 'react-native-background-task';
import utils from './utils/methods';
import styles, { fontPrimaryColor } from './styles/app';
// import { KEY } from './utils/constants';

const TASK_PERIOD = 24 * 60* 60;
const ICON_SIZE = 35;
const RefreshIcon = <Icon name="autorenew" size={ICON_SIZE} color={fontPrimaryColor} />;
const SettingsIcon = <Icon name="settings" size={ICON_SIZE} color={fontPrimaryColor} />;

BackgroundTask.define(async () => {
  BackgroundTask.cancel(); // ios/android

  const refreshData = await utils.refreshCachedItems();
  const notif_msg = (refreshData.isRaining) ? "We would recommend you take an umbrella" : "No umbrella needed";

  PushNotification.localNotification({
    title: notif_msg,
    message: `Temp: ${refreshData.weather.list[0].main.temp}
    ${refreshData.weather.list[0].weather[0].description}`, // (required)
    playSound: false,
    largeIcon: "icon",
    smallIcon: "icon",
  });

  BackgroundTask.schedule({
      period: TASK_PERIOD,
  });
  BackgroundTask.finish();
});

export default class App extends Component {
  // Default values
 constructor(props) {
   super(props);
   this.handleAppStateChange = this.handleAppStateChange.bind(this);
   this.state = {
      isFetching:false,
      isRaining: false,
      remark:'',
      /* localStorage */
      position: null,
      weather: null,
      lastUpdated: null,
      /* SettingStorage */
      reminderOn: false,
      date: new Date('2017-01-01T07:00:00.000Z'),
      isMetric : true,
    };
  }

  componentWillUnmount(){
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  componentWillMount() {
    //=============debug purposes----------------//
    // utils.deleteLocalData(KEY.WEATHER);
    //BackgroundJob.cancelAll();
    //-------------------------------------------//
    //utils.setLocalData(KEY.WEATHER, { description:'', isRaining:false});
    utils.fetchSettings()
      .then(settings => this.setState({ ...settings }));
    utils.getCachedItems().then(data => {
      this.setState({ ...data , remark:true});
    });

    if (PushNotification) PushNotification.cancelAllLocalNotifications();
    PushNotification.localNotification({
      title: "No umbrella needed.",
      largeIcon: "icon",
      smallIcon: "icon",
      message: "Enjoy your day ;)", // (required)
      playSound: false,
    });
  }
  componentDidMount() {
     AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillReceiveProps(nextProps){
    this.setState({ ...nextProps });
    utils.fetchSettings()
    .then(settings => this.setState({ ...settings }));
  }

  handleAppStateChange = async (appState) => {
    if (appState === 'background') {
      this.setState({ isRaining: false });
      const settings = await utils.fetchSettings();
      const remind_date = new Date(settings.date);
      const period_difference = new Date(remind_date - Date.now());
      const remindLaterTimeInSecs = (period_difference.getHours()*60*60 + period_difference.getMinutes()*60);
      BackgroundTask.schedule({
          period: remindLaterTimeInSecs, //calculate time to set (s)
      });
    }
    if (appState === 'active') {
      utils.fetchSettings()
      .then(settings => this.setState({ ...settings }));
      BackgroundTask.cancel();
      utils.getCachedItems().then(data => {
        this.setState({ ...data });
      });
    }
  }

  fetchWeather = () => {
    utils.fetchSettings()
    .then(settings => this.setState({ ...settings }));
    this.setState({ remark: false, isFetching: true });
    utils.refreshCachedItems().then(data => {
      this.setState({ ...data, isFetching: false });
      //this.setState({ isRaining: true });
      return this.state.isRaining;
    });
  }

//------------------------------RENDER CODE-----------------------------------//

  renderButton() { //If already fetching for weather, spinner will appear.
    if(this.state.isFetching) {
      return (
        <View style = {styles.tempContainer}>
          <Spinner size="small" />
        </View>
      );
    }

    return (
      <Button onPress={() => this.fetchWeather()} iconStyle>
        {RefreshIcon}
      </Button>
    );
  }

  renderUpdateText({ remark, lastUpdated }){
    if (remark) {
     return <Text style={styles.updateText}>LastUpdated: {new Date(lastUpdated).toDateString()}.</Text>;
    }
    return <Text style={styles.updateText}>Updated.</Text>;
  }

  renderTemperature() {
    const { isMetric, weather } = this.state;
    const tempInCelcius = Math.round(weather.list[0].main.temp);
    return isMetric ? tempInCelcius  : (tempInCelcius * 1.8 + 32) ;
  }

  render() {
    const { isMetric, isRaining, position, weather, lastUpdated, remark } = this.state;
    if (!weather || !position) return <View style={ styles.spinnerContainer }><Spinner/></View>;

    const tempInCelcius = Math.round(weather.list[0].main.temp);
    return (
      <View style={styles.container}>
        <View style={{ height: 100 }} />

        <View style={styles.tempContainer}>
          <Text style={styles.textStyle.temp}>
            <Text>{tempInCelcius}</Text>
            <Text style={styles.textStyle.unit}>{isMetric ? " \u2103" : " \u2109"}</Text>
            {/* {this.renderTemperature(isMetric)} */}
          </Text>
          <Text style={styles.textStyle.notes}>{weather.list[0].weather[0].description}</Text>
          <Text style={styles.textStyle.question}>Bring an umbrella?</Text>
          <Text style={styles.textStyle.answer}>{isRaining ? 'Probably...' : 'Nope'}</Text>
        </View>

        <View style={styles.settingsContainer}>
          {this.renderButton()}
          {this.renderUpdateText({ remark, lastUpdated }) }
          <Button onPress={() => Actions.settings()} iconStyle>{SettingsIcon}</Button>
        </View>
      </View>
    );
  }
}
