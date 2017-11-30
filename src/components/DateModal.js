import React from 'react';
import Toast from 'react-native-simple-toast';
import PropTypes from 'prop-types';

import {
  View,
  TouchableHighlight,
  Modal,
  Text,
  DatePickerIOS,
  TimePickerAndroid,
} from 'react-native';
import utils from '../utils/methods';
import { Button } from './common';
import styles from '../styles/dateModal';

const DateModal = ({
  onDateChange,
  date,
  isDateVisible,
  setDateVisible,
}) => {
  async function onClickDateTime() {
    if (utils.isAndroid()) {
      const { action, hour, minute } = await TimePickerAndroid.open({
         hour: formattedDate.getHours(), // hour
         minute: formattedDate.getMinutes(), // set minute
         is24Hour: true,
      });

     if (action !== TimePickerAndroid.dismissedAction) {
       const dateTime = new Date();
       dateTime.setHours(hour);
       dateTime.setMinutes(minute);
       dateTime.setDate(dateTime.getDate() + 1);
       onDateChange(dateTime);
       const period_difference = new Date(dateTime - Date.now());
       const hour_difference = period_difference.getHours();
       const min_difference = period_difference.getMinutes()>=15? period_difference.getMinutes() : "15" ;
       if(hour_difference>0){
        Toast.show(`Reminder set in approximately
                   ${hour_difference} ${hour_difference===1? "hour." : "hours."}`);
       }else{
        Toast.show(`Reminder set in approximately
                ${min_difference} minutes.`);
       }

     }
      return;
    }

    setDateVisible(true);
  }

  const formattedDate = new Date(date);
  const minutes = formattedDate.getMinutes();
  const hours = formattedDate.getHours();
  const minString = (minutes + '').length === 1 ? `0${minutes}` : minutes;
  const hourString = (hours + '').length === 1 ? `0${hours}` : hours;

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isDateVisible}
        onRequestClose={()=>null}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Set your reminder</Text>
          <DatePickerIOS
            date={formattedDate}
            mode="time"
            onDateChange={onDateChange}
          />
          <Button onPress={() => setDateVisible(false)}>Done</Button>
        </View>
      </Modal>

      <TouchableHighlight onPress={() => onClickDateTime()}>
          <Text style={styles.time}>{`${hourString}:${minString}`}</Text>
      </TouchableHighlight>
    </View>
  );
};

DateModal.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
  isDateVisible: PropTypes.bool.isRequired,
  onDateChange: PropTypes.func.isRequired,
  setDateVisible: PropTypes.func.isRequired,
}

export default DateModal;
