import React from 'react';
import { Scene, Router,Actions } from 'react-native-router-flux';
import App from './App';
import Settings from './Settings';
import { SCENE } from './utils/constants';

const { SETTINGS, WEATHER } = SCENE;

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
        onLeft={() => Actions[WEATHER]()}
      />
    </Scene>
  </Router>;

export default RouterComponent;
