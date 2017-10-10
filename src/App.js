import React, { Component } from 'react';
import { Text, View } from 'react-native';
import utils from './utils/methods';
import defaultState from './utils/constants';

export default class App extends Component<{}> {
  // Default values
  state = { ...defaultState }

  componentWillMount() {
    utils.getCachedItems().then(data => this.setState(data));
  }

  render() {
    const { isRaining, position, weather, lastUpdated } = this.state;
    console.log(position, lastUpdated);

    return (
      <View style={styles.container}>
        <Text>Bring an umbrella? {isRaining ? 'YES' : 'NO'}</Text>
        <Text>
          pos: lat: {position.coords.latitude} and {position.coords.longitude}
        </Text>
        <Text>weather: {`${weather}`}</Text>
        <Text>lastUpdated: {lastUpdated}</Text>
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
