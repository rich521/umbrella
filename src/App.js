import React, { Component } from 'react';
import { Text, View } from 'react-native';
import utils from './utils/methods';

export default class App extends Component<{}> {
  state = {
    isRaining: false,
    position: null,
    weatherData: null,
    lastUpdated: null,
  }

  componentWillMount() {
    this.getCachedItems();
  }

  getCachedItems = async () => {
    // 1. first get the localdata
    const value = await utils.getLocalData();
    if (value === null) {
      await utils.setLocalData();
      return;
    }

    const data = JSON.parse(value);

      // if (value.position) {
      //   this.setState({ position: value.position });
      // } else {
      //   this.getCurrentPosition();
      // }
      //
      // if (value.weatherData) {
      //   this.setState({ weatherData: value.weatherData });
      // } else {
      //
      // }
  };

  render() {
    const { isRaining } = this.state;

    return (
      <View style={styles.container}>
        <Text>London, United Kingdom</Text>
        <Text>{isRaining ? 'Yes' : 'No'}</Text>
        <Text>Small weather details go here</Text>
        <Text>Refresh button goes here</Text>
        <Text>Settings button goes here</Text>
      </View>
    );
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
