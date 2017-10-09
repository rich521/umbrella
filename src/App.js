import React, { Component } from 'react';
import { Text, View } from 'react-native';
// import { PermissionsAndroid } from 'react-native';

export default class App extends Component<{}> {
  state = {
    isRaining: false,
    position: null,
    region: null,
    gpsAccuracy: null,
  }

  componentWillMount() {
    this.getCurrentPosition();
  }

  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({ position });
    });
  }

  render() {
    const { isRaining , position} = this.state;
    if(position){
    return (
      <View style={styles.container}>
        <Text>London, United Kingdom</Text>
        <Text>{isRaining ? 'Yes' : 'No'}</Text>
        <Text>Small weather details go here</Text>
        <Text>Refresh button goes here</Text>
        <Text>Longitude {position.coords.longitude}</Text>
        <Text>Latitude {position.coords.latitude}</Text>
      </View>
    );
  }else {
      return (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      );
    }

  }
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
};
