import BackgroundTask from 'react-native-background-task';
import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';
import utils from './methods';
import { KEY } from './constants';

const TASK_PERIOD = 24 * 3600;

const isTimeNHoursAwayFromSetTime = (hours, n) => hours <= n || hours >= (24 - n);
const isTime59MinsAwayFromSetTime = (hours, mins) => (hours === 0 && mins <= 59);

function renderNotification(settings, refreshData) {
  const notificationTitle = (refreshData.isRaining) ? "We woulsd recommend you take an umbrella" : "No umbrella needed";
  const minTemp = Math.round(refreshData.description.tempMinMax.min);
  const maxTemp = Math.round(refreshData.description.tempMinMax.max);
  const degreeNotation = settings.isMetric ? " \u2103" : " \u2109";
  const notificationMessage = minTemp === maxTemp ? `Expected temperature around ${minTemp}${degreeNotation}` : `Expected temperatures between ${minTemp}${degreeNotation} and ${maxTemp}${degreeNotation}`;
  if (refreshData.isRaining || settings.isNotifyPeristant){
    if (utils.isAndroid()) {
      PushNotification.localNotification({
        title: notificationTitle,
        message: `${notificationMessage} with ${refreshData.description.weatherDescription}.`, // (required)
        playSound: false,
        // largeIcon: "icon2",
        smallIcon: "icon",
      });
    } else {
      const settingsDate = new Date(settings.date);
      const hours = fireDate.getHours();
      const mins = fireDate.getMinutes();
      const nowDate = new Date();
      nowDate.setHours(hours);
      nowDate.setMinutes(mins);

      PushNotificationIOS.scheduleLocalNotification({
        fireDate: nowDate,
        alertTitle: notificationTitle,
        alertBody: `${notificationMessage} with ${refreshData.description.weatherDescription}.`,
      });
    }
  }
}

let runBackgroundRunOnce = false;

/**
 * FOR ANDROID
 */
if (utils.isAndroid()) {
  (function() {
    BackgroundTask.define(async () => {
      BackgroundTask.cancel();
      if (runBackgroundRunOnce) return;
      runBackgroundRunOnce = true;

      const refreshData = await utils.refreshCachedItems();
      const settings = await utils.fetchSettings();

      renderNotification(settings, refreshData);

      const { hours, mins } = utils.getTimeDifference(settings.date);
      const remindLaterTimeInSecs = (hours * 60 * 60 + mins * 60);

      BackgroundTask.schedule({
        period: remindLaterTimeInSecs, // TODO: do check here
      });

      setTimeout(() => { runBackgroundRunOnce = false; }, 2000);
    });
  })()

} else {

  /**
   * FOR IOS
   */

  (function () {
    console.log('defining background tasks');
    PushNotificationIOS.requestPermissions();

    BackgroundTask.define(async () => {
      console.log('should run lots');

      if (runBackgroundRunOnce) return;
      runBackgroundRunOnce = true;

      console.log('should run only once');
      // Runs every ~15 mins for 30s
      // 1. fetch local storage
      const settings = await utils.fetchSettings();
      const { hours, mins } = utils.getTimeDifference(settings.date);

      console.log(hours, mins, '!isTimeNHoursAwayFromSetTime(hours, 3)', !isTimeNHoursAwayFromSetTime(hours, 3));
      console.log('!settings.canNotify', !settings.canNotify);
      // 2. compare date with current date
      if (!settings.canNotify && !isTimeNHoursAwayFromSetTime(hours, 3)) {
        // check if its not close to set time.
        const setDate = await utils.setLocalData(KEY.SETTINGS, { ...settings, canNotify: true });
        BackgroundTask.finish();
        return;
      }

      console.log('isTime59MinsAwayFromSetTime(hours, mins)', isTime59MinsAwayFromSetTime(hours, mins));

      // notify as usual
      if (settings.canNotify && isTime59MinsAwayFromSetTime(hours, mins)) {
        const refreshData = await utils.refreshCachedItems();
        renderNotification(settings, refreshData);
        const check = await utils.setLocalData(KEY.SETTINGS, { ...settings, canNotify: false });
        BackgroundTask.finish();
        return;
      }

      setTimeout(() => {
        runBackgroundRunOnce = false;
        BackgroundTask.finish();
      }, 2000);
    });
  })()
}

