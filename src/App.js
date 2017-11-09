import React, { Component } from 'react';
import { Text, View, AppState } from 'react-native';
import { Actions } from 'react-native-router-flux';
import PushController from './components/PushController';
import PushNotification from 'react-native-push-notification';
import { Spinner, Button } from './components/common';
// import BackgroundJob from 'react-native-background-job';
import BackgroundTask from 'react-native-background-task';

// import { PermissionsAndroid } from 'react-native';
import utils from './utils/methods';

// const firstJobKey = "firstJobKey";
//onst regularJobKey = "regularJobKey";
BackgroundTask.define(async () => {
  const ID = 'ID: ' + Math.random().toFixed(4);
  console.log(`1- ${ID} - ${new Date()} Background Job fired!.`);

  BackgroundTask.cancel(); // ios/android

  console.log(`2-  ${ID} - clearing all schedules`);


  console.log(`3-  ${ID} - fetching weather`);
  const decision = await utils.getCachedItems();
  console.log(`4-  ${ID} - got weather`);

  PushNotification.localNotification({
    title: "",
    message: `weather: ${decision.weather.main.temp}
    ${decision.weather.weather[0].main}
    ${new Date()}`, // (required)
    playSound: false,
  });
  console.log(`5-  ${ID} - sent notification`);


  console.log(`6-  ${ID} - assingning 24hr schedule`);

  BackgroundTask.schedule({
      period: 900, //24 hrs
  });

  BackgroundTask.finish();
});


// BackgroundJob.register({
//   jobKey: regularJobKey,
//   job: async () => {
//     console.log(`${new Date()} Background Job fired!. Key = ${regularJobKey}`);
//     console.log("fetching weather");
//
//     const decision = await utils.getCachedItems();
//     console.log("got weather");
//     PushNotification.localNotification({
//       message: `weather: ${decision.weather.main.temp}
//       ${decision.weather.weather[0].main}`, // (required)
//       playSound: false,
//     });
//     console.log("sent notification");
//     }
// });
//
// BackgroundJob.register({
//   jobKey: firstJobKey,
//   job: () => {
//     //App.setNotification(App.fetchWeather());
//     console.log(`${new Date()} Background Job fired!. Key = ${firstJobKey}`)
//     //if (PushNotification) PushNotification.cancelAllLocalNotifications();
//     BackgroundJob.cancelAll();
//     BackgroundJob.schedule({
//       jobKey: regularJobKey,
//       period: 100000, //5mins
//       //period: 86400000, //24hrs
//       //networkType: 1,
//     });
//     }
// });

export default class App extends Component<{}> {
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
    //utils.deleteLocalData('@localStore');
    //BackgroundJob.cancelAll();
    utils.getCachedItems().then(data => {
      console.log(data);
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
      console.log("hello");
      const arabicFood = await utils.fetchSettings();
      const difference = new Date(new Date(arabicFood.date) - Date.now());
      console.log(difference);
      BackgroundTask.schedule({
          period: (difference.getHours()*60*60 + difference.getMinutes()*60), //calculate time to set
      });
      console.log(`${new Date()} - background task set`);
      /*
      BackgroundJob.schedule({
        jobKey: firstJobKey,
        period: (difference.getHours()*60*60 + difference.getMinutes()*60)*1000, //calculate time to set
      });
      */
    }
    if (appState === 'active') {
      BackgroundTask.cancel();
      console.log("background task cancelled");
      // utils.getCachedItems().then(data => {
      //   this.setState({ ...data });
      //   console.log("recieved cached items");
      // });

      //BackgroundJob.cancelAll();
    }
  }

  fetchWeather = () => {
    this.setState({ remark: false, isFetching: true });
    utils.refreshCachedItems().then(data => {
      this.setState({ ...data, isFetching: false });
      //if (data.weather.weather[0].main === "Rain") this.setState({ isRaining: true });
      this.setState({ isRaining: true });
      return this.state.isRaining;
      //this.setPushNotification(new Date()); // TODO change this setDate
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
