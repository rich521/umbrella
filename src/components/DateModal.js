import React from 'react';
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

const DateModal = ({
  onDateChange,
  date,
  isDateVisible,
  setDateVisible,
}) => {
  async function onClickDateTime() {
    if (utils.isAndroid()) {
      const { action, hour, minute } = await TimePickerAndroid.open({
         hour: date.getHours(), // hour
         minute: date.getMinutes(), // set minute
         is24Hour: true,
      });

     if (action !== TimePickerAndroid.dismissedAction) {
       const dateTime = new Date();
       dateTime.setHours(hour);
       dateTime.setMinutes(minute);
       onDateChange(dateTime);
     }
      return;
    }

    setDateVisible(true);
  }

  const minutes = date.getMinutes();
  const minString = (minutes + '').length === 1 ? `0${minutes}` : minutes;

  return (
    <View style={{ marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={isDateVisible}
        >
         <View style={{ marginTop: 22 }}>
          <View>
            <DatePickerIOS
              date={date}
              mode="time"
              onDateChange={onDateChange}
            />
            <TouchableHighlight onPress={() => setDateVisible(false)}>
              <Text>Done</Text>
            </TouchableHighlight>
          </View>
         </View>
        </Modal>

        <TouchableHighlight onPress={() => onClickDateTime()}>
          <View>
            <Text>Notify me at: </Text>
            <Text>{`${date.getHours()}:${minString} >`}</Text>
          </View>
        </TouchableHighlight>

      </View>
  );
};

DateModal.propTypes = {
  date: PropTypes.shape({}).isRequired,
  isDateVisible: PropTypes.bool.isRequired,
  onDateChange: PropTypes.func.isRequired,
  setDateVisible: PropTypes.func.isRequired,
}

export default DateModal;
