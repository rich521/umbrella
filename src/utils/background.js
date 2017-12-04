import BackgroundTask from 'react-native-background-task';
import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';
import utils from './methods';
import { KEY } from './constants';

const TASK_PERIOD = 24 * 3600;

const isTimeNHoursAwayFromSetTime = (hours, n) => hours <= (n - 1) || hours >= (24 - n);
const isTime30MinsAwayFromSetTime = (hours, mins, n) => (hours === 0 && mins <= 30) || (hours === 23 && mins >= 30);

function renderNotification(settings, refreshData) {
  const notificationTitle = (refreshData.isRaining) ? "We woulsd recommend you take an umbrella" : "No umbrella needed";
  const minTemp = Math.round(refreshData.description.tempMinMax.min);
  const maxTemp = Math.round(refreshData.description.tempMinMax.max);
  const degreeNotation = settings.isMetric ? " \u2103" : " \u2109";
  const notificationMessage = minTemp===maxTemp ? `Expected temperature around ${minTemp}${degreeNotation}` : `Expected temperatures between ${minTemp}${degreeNotation} and ${maxTemp}${degreeNotation}`;
  if (refreshData.isRaining || settings.isNotifyPeristant){
    PushNotification.localNotification({
      title: notificationTitle,
      message: `${notificationMessage} with ${refreshData.description.weatherDescription}.`, // (required)
      playSound: false,
      // largeIcon: "icon2",
      smallIcon: "icon",
    });
  }

}

/**
 * FOR ANDROID
 */
if (utils.isAndroid()) {
  (function() {
    BackgroundTask.define(async () => {
      BackgroundTask.cancel(); // ios/android

      const refreshData = await utils.refreshCachedItems();
      const settings = await utils.fetchSettings();

      renderNotification(settings, refreshData);


      const { hours, mins } = utils.getTimeDifference(settings.date);
      const remindLaterTimeInSecs = (hours * 60 * 60 + mins * 60);

      BackgroundTask.schedule({
        period: remindLaterTimeInSecs, // TODO: do check here
      });
    });
  })()

} else {

  /**
   * FOR IOS
   */

  (function (){
    PushNotificationIOS.requestPermissions();

    BackgroundTask.define(async () => {
      // Runs every ~15 mins for 30s

      // 1. fetch local storage
      const settings = await utils.fetchSettings();
      const { hours, mins } = utils.getTimeDifference(settings.date);
      // 2. compare date with current date
      if (!settings.canNotify && !isTimeNHoursAwayFromSetTime(hours, 3)) {
        // check if its not close to set time.
        await utils.setLocalData(KEY.SETTINGS, { ...settings, canNotify: true });
        setTimeout(() => BackgroundTask.finish(), 500);
        return;
      }

      // notify as usual
      if (settings.canNotify && isTime30MinsAwayFromSetTime(hours, mins, 1)) {
        const refreshData = await utils.refreshCachedItems();
        renderNotification(settings, refreshData);
        await utils.setLocalData(KEY.SETTINGS, { ...settings, canNotify: false });
        setTimeout(() => BackgroundTask.finish(), 500);
        return;
      }

      BackgroundTask.finish();
    });
  })()
}
