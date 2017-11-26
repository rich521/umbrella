import PushNotification from 'react-native-push-notification';
import BackgroundTask from 'react-native-background-task';
import utils from './methods';
import { KEY } from './constants';

PushNotification.configure({ requestPermissions: true })
PushNotification.checkPermissions(() => null);

const TIME_LIMIT_HRS = 1;
const TIME_LIMIT_MINS = 45;
const RANGE_HOURS_TO_STOP_REPEAT = 20;

BackgroundTask.define(async () => {
  BackgroundTask.cancel(); // ios/android
  const bgProps = await utils.getBackgroundProperties();

  if (!utils.isAndroid()) {
    console.log(bgProps.hours, bgProps.mins, !(bgProps.hours < TIME_LIMIT_HRS && bgProps.mins < TIME_LIMIT_MINS));

    // DONT NOTIFY if --> NOT WITHIN THE SET TIME || IF JUST RECENTLY NOTIFIED
    if ((bgProps.hours > TIME_LIMIT_HRS && bgProps.mins > TIME_LIMIT_MINS) ||
    (utils.getTimeDifference(bgProps.lastNotification).totalMins / 60 < RANGE_HOURS_TO_STOP_REPEAT)) {
      BackgroundTask.finish();
      return;
    }
  }

  const refreshData = await utils.refreshCachedItems();
  const notificationTitle = (refreshData.isRaining) ? "🌧️🌧️ Bring an ☂️ umbrella" : "No ☂️  umbrella needed";
  const minTemp = Math.round(refreshData.description.tempMinMax.min);
  const maxTemp = Math.round(refreshData.description.tempMinMax.max);
  const degreeNotation = bgProps.settings.isMetric ? " \u2103" : " \u2109";
  const notificationMessage = minTemp === maxTemp ?
    `Expected temperature around ${minTemp}${degreeNotation}` :
    `Expected temperatures between ${minTemp}${degreeNotation} and ${maxTemp}${degreeNotation}`;

  PushNotification.localNotification({
    title: notificationTitle,
    message: `${notificationMessage} with ${refreshData.description.weatherDescription}.`, // (required)
    playSound: true,
    smallIcon: "icon",
  });

  await utils.setLocalData(KEY.SETTINGS, { ...bgProps.settings, lastNotification: new Date() });

  const TASK_PERIOD = 24 * 3600; // 24 hours in secs
  console.log(TASK_PERIOD, '+', (bgProps.remindLaterTimeInSec * (bgProps.isBeforeRemind ? -1 : 1)));
  BackgroundTask.schedule({
    period: TASK_PERIOD + (bgProps.remindLaterTimeInSec * (bgProps.isBeforeRemind ? -1 : 1)),
  });

  BackgroundTask.finish();
});