import React, { Component } from 'react';
import { View, Text, Switch } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Card, CardSection, Button } from './components/common';
import DateModal from './components/DateModal';
import utils from './utils/methods';
import { KEY } from './utils/constants';
import styles from './styles/settings';

const initDate = new Date();
initDate.setHours('07');
initDate.setMinutes('00');
const sevenAmDate = initDate.toDateString();
const settingsHeight = { paddingTop: 30, paddingBottom: 30, alignItems: 'center' };

class Settings extends Component {
  state = {
    isDateVisible: false,
    // persisted data
    isNotifyOn: false,
    date: sevenAmDate,
    isMetric: true,
  }

  componentWillMount() {
    utils.fetchSettings()
      .then(settings => this.setState({ ...settings }));
  }

  onDateChange = (date) => {
    const settingsData = { date, isNotifyOn: this.state.isNotifyOn };
    utils.setLocalData(KEY.SETTINGS,settingsData)
      .then(() => this.setState({ ...settingsData }));
  }

  onNotifyChange = (isNotifyOn) => {
    const settingsData = { date: this.state.date, isNotifyOn };
    utils.setLocalData(KEY.SETTINGS,settingsData)
      .then(() => this.setState({ ...settingsData }));
  };

  onMetricChange = (isMetric) => {
    const settingsData = { date: this.state.date, isMetric };
    utils.setLocalData(KEY.SETTINGS,settingsData)
      .then(() => this.setState({ ...settingsData }));
  };

  render() {
    const { isMetric, isNotifyOn, date, isDateVisible } = this.state;

    return (
      <View style={styles.settingsContainer}>
        <View style={styles.settingsInner}>
          <Card>
            <CardSection style={settingsHeight}>
              <Text style={styles.textStyle}>Notification</Text>
              <Switch
                value={isNotifyOn}
                onValueChange={this.onNotifyChange}
              />
            </CardSection>
            <CardSection style={settingsHeight}>
              <Text style={styles.textStyle}>Metric Option ({"\u2103"})</Text>
              <View>
                <Switch value={isMetric} onValueChange={this.onMetricChange} />
              </View>
            </CardSection>
            <CardSection style={settingsHeight}>
              <Text style={styles.textStyle}>Notify me at</Text>
              <DateModal
                onDateChange={this.onDateChange}
                date={new Date(date)}
                isDateVisible={isDateVisible}
                setDateVisible={isDateVisible => this.setState({ isDateVisible })}
              />
            </CardSection>
          </Card>

        </View>
        <View style={{ paddingBottom: 20 }}>
          <Button onPress={() => Actions.pop( {refresh: {isMetric} })}>Done</Button>
        </View>
      </View>
    );
  }
}

export default Settings;
