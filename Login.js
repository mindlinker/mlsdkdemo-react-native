/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {TouchableOpacity} from 'react-native';
import { TextInput } from 'react-native';
import {SafeAreaView, StyleSheet, View, Text, StatusBar} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

type Props = {
}

type State = {
  inputValue: string,
}

export default class LoginView extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  _onChangeText = (text: string) => {
    console.info(`text: ${text}`);
    this.setState({
      inputValue: text,
    });
  }

  _onPress = () => {
    console.info('onpress login');
  }

  render() {
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
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
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
});
