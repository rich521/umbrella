import React, { Component } from 'react';
import { Text, View, AppState } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PushController from './components/PushController';
import PushNotification from 'react-native-push-notification';
import { Spinner, Button } from './components/common';
import BackgroundJob from "react-native-background-job";
// import { PermissionsAndroid } from 'react-native';
import utils from './utils/methods';

const regularJobKey = "regularJobKey";

BackgroundJob.register({
  jobKey: regularJobKey,
  job: () => {
    //App.setNotification(App.fetchWeather());
    console.log(`${new Date()} Background Job fired!. Key = ${regularJobKey}`)
    BackgroundJob.cancelAll();
    }
});

export default class App extends Component<{}> {
  // Default values
 constructor(props) {
   super(props);
   this.handleAppStateChange = this.handleAppStateChange.bind(this);
   this.state = {
      isFetching:false,
      isRaining: false,
      remark:'',
      /* localStorage  */
      position: null,
      weather: null,
      lastUpdated: null,
      /* settingStorage */
      reminderOn: false,
      date: new Date('2017-01-01T07:00:00.000Z'),
      isMetric : true,
    };
  }
  componentWillUnmount(){
    AppState.removeEventListener('change', this.handleAppStateChange);
  }
  componentWillMount() {
    //utils.deleteLocalData();
    BackgroundJob.cancelAll();
    //if (PushNotification) PushNotification.cancelAllLocalNotifications();
    this.fetchWeather();
  }
  componentDidMount() {
     AppState.addEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = async (appState) => {
    if (appState === 'background') {
      console.log("hello");
      const arabicFood = await utils.fetchSettings();
      const difference = new Date(new Date(arabicFood.date) - Date.now());
      console.log(difference);
      BackgroundJob.schedule({
        jobKey: regularJobKey,
        period: (difference.getHours()*60*60 + difference.getMinutes()*60)*1000, //calculate time to set
      });
    }
  }

  setPushNotification = (date,message) => {
    PushNotification.localNotificationSchedule({
      message, // (required)
      date: new Date(date), // make sure its always the set date by user or +24hrs
      playSound: false,
    });
  }

  setNotification = (message) => {
    if (PushNotification) PushNotification.cancelAllLocalNotifications();

    utils.fetchSettings().then(data => {
      if(data.isNotifyOn){
        const newDate = new Date(Date.now() + 2*1000);
        //debugger;
        const bufferDate = newDate.setSeconds(newDate.getSeconds()+20);
        const settingsData = { date: bufferDate, isNotifyOn: true };
        utils.setSettings(settingsData)
        this.setPushNotification(bufferDate,message);
      }
    });
  }

  fetchWeather = () => {
    this.setState({ remark: false, isFetching: true });
    utils.getCachedItems().then(data => {
      this.setState({ ...data, isFetching: false });
      //if (data.weather.weather[0].main === "Rain") this.setState({ isRaining: true });
      this.setState({ isRaining: true });
      return this.state.isRaining;
      //this.setPushNotification(new Date()); // TODO change this setDate
    });
  }

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
      <View style = { styles.container }>
        <View style = {{ height: 100 }}/>

        <View style = { styles.tempContainer }>
          <Text style={ styles.textStyle }>{ Math.round(weather.main.temp)+"\u2103" }</Text>
          <Text></Text>
          <Text>Bring an umbrella? { isRaining ? 'Probably...' : 'Nope' }</Text>
          <Text>{ weather.weather[0].main }</Text>
        </View>

        <View style = { styles.tempContainer }>
        { this.renderButton() }
        <Button onPress = { () => Actions.settings() }>Settings</Button>
        { this.renderUnderButtonText({ remark, lastUpdated }) }
        </View>
        <PushController/>
      </View>
    );
  }
}

const styles = {
  container : {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textStyle : {
    fontSize: 50,
  },
  spinnerContainer : {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    position:'relative',
  },
  tempContainer : {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
};
