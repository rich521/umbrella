import React, { Component } from 'react';
import { View, Text, Switch } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Card, CardSection, Button } from './components/common';
import DateModal from './components/DateModal';
import { SCENE } from './utils/constants';
import utils from './utils/methods';

const initDate = new Date();
initDate.setHours('07');
initDate.setMinutes('00');
const sevenAmDate = initDate.toDateString();

class Settings extends Component {
  state = {
    isDateVisible: false,

    // persisted data
    isNotifyOn: true,
    date: sevenAmDate,
  }

  componentWillMount() {
    utils.fetchSettings(this.state)
      .then(settings => this.setState({ ...settings }));
  }

  onDateChange = date => {
    const settingsData = { date: date.toDateString(), isNotifyOn: this.state.isNotifyOn };
    utils.setSettings(settingsData)
      .then(() => this.setState({ ...settingsData }));
  }

  onNotifyChange = (isNotifyOn) => {
    const settingsData = { date: this.state.date, isNotifyOn };
    utils.setSettings(settingsData)
      .then(() => this.setState({ ...settingsData }));
  };

  render() {
    const { isNotifyOn, date, isDateVisible } = this.state;
    return (
      <View style={styles.settingsContainer}>
        <View style={styles.settingsInner}>
          <Card>
            <CardSection>
              <Text style={styles.textStyle}>Notification</Text>
              <Switch
                value={isNotifyOn}
                onValueChange={this.onNotifyChange}
              />
            </CardSection>
            <CardSection>
              <DateModal
                onDateChange={this.onDateChange}
                date={date}
                isDateVisible={isDateVisible}
                setDateVisible={isDateVisible => this.setState({ isDateVisible })}
              />
            </CardSection>
          </Card>

        </View>
        <View style={{ paddingBottom: 20 }}>
          <Button onPress={() => Actions[SCENE.WEATHER]()}>Save</Button>
        </View>
      </View>
    );
  }
}

const styles = {
  settingsContainer: {
    flex:1,
    backgroundColor: '#f9f9f9'
  },
  settingsInner: {
    flex: 1,
    alignItems: 'stretch',
    marginTop: 55,
    marginBottom: 0,
  },
  textStyle: {
    fontSize:15,
  },
}

export default Settings;
