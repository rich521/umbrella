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
    isNotifyPersistant: false,
    isNotifyOn: false,
    date: sevenAmDate,
    isMetric: false,
  }

  componentWillMount() {
    utils.fetchSettings()
      .then(settings => this.setState({ ...settings }));
  }

  onNotifyChange = (isNotifyOn) => this.setState({ ...this.state, isNotifyOn });

  onNotifyPersistantChange = (isNotifyPeristant) => this.setState({ ...this.state, isNotifyPeristant });

  onMetricChange = (isMetric) => this.setState({ ...this.state, isMetric });

  onDateChange = (date) => this.setState({ ...this.state, date });

  saveChanges = () => {
    const {isMetric, isNotifyOn, date} = this.state;
    utils.setLocalData(KEY.SETTINGS, {isMetric, isNotifyOn, date});
    Actions.pop( {refresh: {isMetric, isNotifyOn, date} });
  };

  render() {
    const { isNotifyPeristant, isNotifyOn, isMetric, date, isDateVisible } = this.state;

    return (
      <View style={styles.settingsContainer}>
        <View style={styles.settingsInner}>
          <Card>
            <CardSection style={settingsHeight}>
              <View>
                <Text style={styles.textStyle}>Notification</Text>
                <Text style={styles.underTextStyle}>Will not notify in battery saving mode.</Text>
              </View>
              <Switch
                value={isNotifyOn}
                onValueChange={this.onNotifyChange}
              />
            </CardSection>
            <CardSection style={settingsHeight}>
              <View>
                <Text style={styles.textStyle}>Notification Persistant</Text>
                <Text style={styles.underTextStyle}>Notify even when umbrella is not needed.</Text>
              </View>
              <Switch
                value={isNotifyPeristant}
                onValueChange={this.onNotifyPersistantChange}
              />
            </CardSection>
            <CardSection style={settingsHeight}>
              <View>
                <Text style={styles.textStyle}>Metric Option ({"\u2103"})</Text>
                <Text style={styles.underTextStyle}>Choose between {"\u2103"} and {"\u2109"}.</Text>
              </View>
              <View>
                <Switch
                  value={isMetric}
                  onValueChange={this.onMetricChange} />
              </View>
            </CardSection>
            <CardSection style={settingsHeight}>
              <View>
                <Text style={styles.textStyle}>Notify me at</Text>
                <Text style={styles.underTextStyle}>Minimum time before Notification is 15 minutes. </Text>
              </View>
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
          <Button onPress={() => this.saveChanges()}>Done</Button>
        </View>
      </View>
    );
  }
}

export default Settings;
