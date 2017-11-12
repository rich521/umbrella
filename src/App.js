import React, { Component } from 'react';
import { Text, View, AppState } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PushNotification from 'react-native-push-notification';
import { Spinner, Button } from './components/common';
import BackgroundTask from 'react-native-background-task';
import utils from './utils/methods';
import styles from './styles/app';
// import { KEY } from './utils/constants';

const TASK_PERIOD = 900;

BackgroundTask.define(async () => {

  BackgroundTask.cancel(); // ios/android

  const decision = await utils.getCachedItems();
  const notif_msg = (decision.isRaining) ? "We would recommend you take an umbrella" : "No umbrella needed";

  PushNotification.localNotification({
    title: notif_msg,
    message: `weather: ${decision.weather.list[0].main.temp}
    ${new Date()}`, // (required)
    playSound: false,
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
    //utils.deleteLocalData(KEY.WEATHER);
    //BackgroundJob.cancelAll();
    //-------------------------------------------//
    //utils.setLocalData(KEY.WEATHER, { description:'', isRaining:false});
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
      BackgroundTask.cancel();
      utils.getCachedItems().then(data => {
        this.setState({ ...data });
      });
    }
  }

  fetchWeather = () => {
    this.setState({ remark: false, isFetching: true });
    utils.refreshCachedItems().then(data => {
      this.setState({ ...data, isFetching: false });
      //this.setState({ isRaining: true });
      return this.state.isRaining;
    });
  }

//------------------------------RENDER CODE-----------------------------------//

  renderButton() { //If already fetching for weather, spinner will appear.
    if(this.state.isFetching) return (
      <View style = {styles.tempContainer}>
        <Spinner size = "small" />
      </View>
    );
    return <Button onPress = { () => this.fetchWeather() }>Refresh</Button>;
  }

  renderUnderButtonText({ remark, lastUpdated }){
    if (remark){
    return <Text style = {{ fontSize:10 }}>LastUpdated: {new Date(lastUpdated).toDateString()}.</Text>;
    }
    return <Text style = {{ fontSize:10 }}>Updated.</Text>;
  }

  render() {
    const { isRaining, position, weather, lastUpdated, remark } = this.state;
    if (!weather || !position) return <View style={ styles.spinnerContainer }><Spinner/></View>;

    return (
      <View style={ styles.container }>
        <View style={{ height: 100 }} />

        <View style={styles.tempContainer}>
          <Text style={styles.textStyle.temp}>{ Math.round(weather.list[0].main.temp)+"\u2103" }</Text>
          <Text style={styles.textStyle.notes}>{weather.list[0].weather[0].description}</Text>
          <Text style={styles.textStyle.question}>Bring an umbrella?</Text>
          <Text style={styles.textStyle.answer}>{isRaining ? 'Probably...' : 'Nope'}</Text>
        </View>

        <View style={styles.tempContainer}>
        {this.renderButton()}
        <Button onPress={() => Actions.settings()}>Settings</Button>
        {this.renderUnderButtonText({ remark, lastUpdated }) }
        </View>
      </View>
    );
  }
}
