import React, { Component } from 'react';
import { View, Text, Switch } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Card, CardSection, Button } from './components/common';
import DateModal from './components/DateModal';
import { SCENE } from './utils/constants';

const sevenAmDate = new Date();
sevenAmDate.setHours('07');
sevenAmDate.setMinutes('00');

class Settings extends Component {
  state = {
    isNotifyOn: true,
    isDateVisible: false,
    date: sevenAmDate,
  }

  render() {
    const { isNotifyOn, date, isDateVisible } = this.state;
    return (
      <View style = {styles.settingsContainer}>
        <View style = {{ flex:1, alignItems: 'stretch', marginTop:55, marginBottom:0 }}>
          <Card>
            <CardSection>
              <Text style={styles.textStyle}>Notification</Text>
              <Switch
                value={isNotifyOn}
                isNotifyOnonValueChange={isNotifyOn => this.setState({ isNotifyOn })}
              />
            </CardSection>
            <CardSection>
              <DateModal
                onDateChange={date => this.setState({ date })}
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
  textStyle: {
    fontSize:15,
  },
}

export default Settings;
