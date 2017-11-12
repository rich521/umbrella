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
     }
      return;
    }

    setDateVisible(true);
  }

  const formattedDate = new Date(date);
  const minutes = formattedDate.getMinutes();
  const minString = (minutes + '').length === 1 ? `0${minutes}` : minutes;

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isDateVisible}
        onRequestClose={()=>null}
      >
         <View style={{ marginTop: 22 }}>
          <View>
            <DatePickerIOS
              date={formattedDate}
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
            <Text>{`${formattedDate.getHours()}:${minString}`}</Text>
          </View>
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
