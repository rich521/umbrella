import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import { View } from 'react-native';
import App from './App';
import Settings from './Settings';
import { SCENE } from './utils/constants';

const { SETTINGS, WEATHER } = SCENE;

const renderBackButton = () => {
    return <View/>
};
const renderLeftButton = () => {
    return <View/>
};

const RouterComponent = () =>
  <Router>
    <Scene>
      <Scene
        key={WEATHER}
        component={App}
        hideNavBar
      />
      <Scene
        navTransparent
        key={SETTINGS}
        component={Settings}
        title="Settings"
        renderBackButton={() => renderBackButton()}
        renderLeftButton={() => renderLeftButton()}
      />
    </Scene>
  </Router>;

export default RouterComponent;
