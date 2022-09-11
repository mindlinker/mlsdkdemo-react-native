/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native';
import {SafeAreaView, StyleSheet, View, Text, StatusBar} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

type Props = {
  navigation: any
}

type State = {
  inputValue: string,
  isLogined: boolean,
}

export default class LoginView extends Component<Props, State> {

  static navigationOptions = {
    title: 'Home',
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: '',
      isLogined: false,
    };
  }

  _onChangeText = (text: string) => {
    console.info(`text: ${text}`);
    this.setState({
      inputValue: text,
    });
  };

  _onPress = () => {
    console.info('onpress login');
    this.setState({
      isLogined: !this.state.isLogined
    });
  };

  _onCreatePress = () => {
    console.info('onpress create');
    this.props.navigation.navigate('Join');
  };

  _onJoinPress = () => {
    console.info('onpress join');
    this.props.navigation.navigate('Join');
  };

  _renderLoginView = () => {
    return <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.body}>
            <Text style={styles.welcomeLogin}>欢迎登录</Text>
  
            <TextInput
              onChangeText={this._onChangeText}
              value={this.state.inputValue}
              returnKeyType="done"
              underlineColorAndroid={'#D6D6D6'}
              style={styles.inputStyle}
              keyboardType={'default'}
              placeholder={'请输入用户昵称'}
            />
            <TouchableOpacity
              style={styles.touchStyle}
              onPress={this._onPress}
              >
              <Text style={styles.loginText}>登录</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>;
  }

  _renderHomeView = () => {
    return <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.homeView}>
            <TouchableOpacity onPress={this._onCreatePress}>
              <Image
                style={styles.createImage} 
                source={require('./images/createMeeting.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._onJoinPress}>
              <Image
                style={styles.joinImage}
                source={require('./images/joinMeeting.png')}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>;
  };

  render() {
    const loginView = this.state.isLogined ? this._renderHomeView() : this._renderLoginView()
    return <>{loginView}</>;
  }
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
  },
  welcomeLogin: {
    fontSize: 22,
    color: '#333333',
    marginTop: 75,
  },
  inputStyle: {
    height: 60,
    marginTop: 35,
  },
  touchStyle: {
    backgroundColor: '#0B7BFF',
    height: 44,
    marginTop: 60,
    borderRadius: 4,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: Colors.white,
    fontSize: 16,
  },

  homeView: {
    flexDirection: 'column',
  },
  createImage: {
    marginTop: 80,
    width: 360,
    height: 160,
  },
  joinImage: {
    width: 360,
    height: 160,
  },
});
