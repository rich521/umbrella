import React from 'react';
import {Scene, Router,Actions} from 'react-native-router-flux';
import App from './App';
import Settings from './Settings';

const RouterComponent = () => {

  return (
    <Router>
      <Scene>
        <Scene
          key = "weather"
          component = { App }
          hideNavBar = { true }
        />
        <Scene
          navTransparent = { true }
          key = "settings"
          component = { Settings }
          title = "Settings"
          onLeft = { () => Actions.weather() }
        />
      </Scene>
    </Router>
  )
}

export default RouterComponent;
