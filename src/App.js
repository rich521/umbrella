import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Spinner, Button } from './components/common';
// import { PermissionsAndroid } from 'react-native';

const API_KEY = '124120424'; //weather API KEY
const API_DEBOUNCE_TIME = 2000; // time required before second refresh (ms)

export default class App extends Component<{}> {
  state = {
    isRaining: false,
    position: null,
    lastAPICall: null,
    gpsAccuracy: null,
    temperature: null,
    weatherDecription:'',
    isFetching:false,
  }

  componentWillMount() {
    this.getCurrentPosition();
  }

  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({ position });
    });
  }

  renderLongLat(position){ //probably won't be required.
    if (position){
    return(
      <View>
        <Text>Longitude: {position.coords.longitude}</Text>
        <Text>Latitude: {position.coords.latitude}</Text>
      </View>
    );}
    return(<Spinner />);
  }

  renderButton(){ //If already fetching for weather, spinner will appear.
    if(this.state.isFetching) return (
      <View style = {styles.spinnerContainer}>
        <Spinner size={'small'}/>
      </View>
    );
    return (<Button onPress = {this.fetchWeather.bind(this)}>Refresh</Button>);
  }

  fetchWeather(){
    this.setState({isFetching:true});
      if(this.shouldFetchWeather()) {
        if(this.state.position){
        //condition for fetching weather. enter code with fetch query
        this.setState({
          weatherDecription: 'slight rain',
          temperature: 13,
          isRaining: true,
          lastAPICall: new Date(),
          isFetching:false,
        });
      }else{
        this.setState({
          weatherDecription: 'waiting for location',
          temperature: 0,
          isRaining: false,
          isFetching:false,
        });
      }

      }else{
        //condition if refresh is clicked too soon
        this.setState({
          weatherDecription: 'refresh timeout',
          temperature: 0,
          isRaining: false,
          isFetching:false,
        });
      }
  }

  shouldFetchWeather(){ //checks if the allowable refresh time has passed
    return  this.state.lastAPICall === null
    || new Date() - this.state.lastAPICall > API_DEBOUNCE_TIME
  }

  render() {
    const { isRaining , position, temperature, weatherDecription } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>{temperature}</Text>
        <Text>{isRaining ? 'Yes' : 'No'}</Text>
        <Text>{weatherDecription}</Text>
        {this.renderLongLat(position)}
        {this.renderButton()}
      </View>
    );
  }
}

const styles = {
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  textStyle : {
    fontSize:30
  },
  spinnerContainer : {
    padding:5,
    justifyContent: 'flex-start',
    position:'relative'
  },
};
