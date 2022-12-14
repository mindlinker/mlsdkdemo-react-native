/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoginView from './login/Login';
import JoinView from './join/JoinView';
import VideoView from './video/Video';

const AppNavigator = createStackNavigator(
  {
    Home: {
    screen: LoginView,
      navigationOptions: {
        header: null,
      },
    },
    Join: {
      screen: JoinView,
      navigationOptions: {
        title: '加入房间',
      },
    },
    Video: {
      screen: VideoView,
    },
  },
  {
    initialRouteName: 'Home',
  },
);

export default createAppContainer(AppNavigator);
