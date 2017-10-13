import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Spinner, Button } from './components/common';
// import { PermissionsAndroid } from 'react-native';
import utils from './utils/methods';
import defaultState from './utils/constants';

export default class App extends Component<{}> {
  // Default values
  state = { ...defaultState }

  componentWillMount() {
    utils.deleteLocalData();
    this.fetchWeather();
  }

  fetchWeather = () => {
    this.setState({ remark: false, isFetching: true });
    utils.getCachedItems().then(data => this.setState(data));
  }

  renderButton() { //If already fetching for weather, spinner will appear.
    if(this.state.isFetching) return (
      <View style = {styles.spinnerContainer}>
        <Spinner size = "small" />
      </View>
    );
    return (<Button onPress = { () => this.fetchWeather() }>Refresh</Button>);
  }

  renderUnderButtonText({ remark, lastUpdated }){
    if (remark){
    return <Text style = {{ fontSize:10 }}>Refresh too soon.</Text>;
    }
    return <Text style = {{ fontSize:10 }}>LastUpdated: {new Date(lastUpdated).toDateString()}</Text>;
  }

  render() {
    const { isRaining, position, weather, lastUpdated, remark } = this.state;
<<<<<<< HEAD
    if (!weather || !position) return <View style={ styles.spinnerContainer }><Spinner/></View>;
=======
    if (!weather || !position) return <View style={ styles.container }><Spinner/></View>;
>>>>>>> d15cdae0dc83c2db51b04d7e9339a14dd6cea1ed

    return (
      <View style = { styles.container }>
        <View style = {{ height: 100 }}/>

        <View style = { styles.tempContainer }>
<<<<<<< HEAD
          <Text style={ styles.textStyle }>{ Math.round(weather.main.temp)+"\u2103" }</Text>
          <Text></Text>
          <Text>Bring an umbrella? { isRaining ? 'Probably...' : 'Nope' }</Text>
          <Text>{ weather.weather[0].main }</Text>
=======
          <Text style={ styles.textStyle }>{ Math.round((weather.main.temp-32)/1.8)+"\u2103" }</Text>
          <Text></Text>
          <Text>Bring an umbrella? { isRaining ? 'Probably...' : 'Nope' }</Text>
          <Text>{ weather.weather[0].description }</Text>
>>>>>>> d15cdae0dc83c2db51b04d7e9339a14dd6cea1ed
        </View>

        <View style = { styles.tempContainer }>
        { this.renderButton() }
        <Button onPress = { () => Actions.settings() }>Settings</Button>
        { this.renderUnderButtonText({ remark, lastUpdated }) }

        </View>
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
    fontSize:50
  },
  spinnerContainer : {
<<<<<<< HEAD
    flex:1,
    padding:5,
    justifyContent: 'center',
=======
    padding:5,
    justifyContent: 'flex-start',
>>>>>>> d15cdae0dc83c2db51b04d7e9339a14dd6cea1ed
    position:'relative'
  },
  tempContainer : {
    justifyContent: 'center',
    alignItems: 'center',
    margin:10
  },
};
