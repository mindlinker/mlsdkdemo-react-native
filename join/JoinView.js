/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { TouchableOpacity, Image, ToastAndroid } from 'react-native';
import { Switch } from 'react-native';
import { TextInput } from 'react-native';
import {SafeAreaView, StyleSheet, View, Text, StatusBar} from 'react-native';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { joinMeeting } from '../libs/MindlinkerSDK';

type Props = {
}

type State = {
  roomCode: string,
  nickName: string,
  isAuidoEnable: boolean,
  isVideoEnable: boolean,
}

export default class JoinView extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      roomCode: '',
      nickName: '',
      isAuidoEnable: false,
      isVideoEnable: false,
    };
  }

  _onRoomCodeChangeText = (text: string) => {
    console.info(`text: ${text}`);
    this.setState({
      roomCode: text,
    });
  };

  _onNickNameChangeText = (text: string) => {
    console.info(`text: ${text}`);
    this.setState({
      nickName: text,
    });
  };

  _toggleAuidoSwitch = () => {
    this.setState({
      isAuidoEnable: !this.state.isAuidoEnable,
    });
  };

  _toggleVideoSwitch = () => {
    this.setState({
      isVideoEnable: !this.state.isVideoEnable,
    });
  };

  _onPress = () => {
    console.info('onpress join');
    joinMeeting(this.state.roomCode, !this.state.isVideoEnable, !this.state.isAuidoEnable).then(result => {
      console.info('join meeting result:', result);
      if (result.code === 0) {
        this.props.navigation.navigate('Video', {roomCode: result.data.roomNo});
      } else {
        ToastAndroid.showWithGravity(
            result.message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        );
      }
    });
  };

  _renderLoginView = () => {
    return <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.body}>
          <View>
            <View style={styles.containerViewTop}>
              <Text style={styles.roomNoText}>房间号</Text>
              <TextInput
                onChangeText={this._onRoomCodeChangeText}
                value={this.state.roomCode}
                keyboardType={'numeric'}
                returnKeyType="next"
                style={styles.inputStyle}
                placeholder={'请输入会议号'}
              />
            </View>
            <View style={styles.line} />
            <View style={styles.containerView}>
              <Text style={styles.roomNoText}>用户名称</Text>
              <TextInput
                onChangeText={this._onNickNameChangeText}
                value={this.state.nickName}
                returnKeyType="next"
                style={styles.inputStyle}
                keyboardType={'default'}
                placeholder={'请输入用户名称'}
              />
            </View>
            <View style={styles.containerViewTop}>
              <Text style={styles.roomNoText}>开启麦克风</Text>
              <Switch
                  style={styles.switchStyle}
                  trackColor={{ false: '#EBEBEB', true: '#0B7BFF' }}
                  thumbColor={'#FFFFFF'}
                  onValueChange={this._toggleAuidoSwitch}
                  value={this.state.isAuidoEnable}
              />
            </View>
            <View style={styles.containerView}>
              <Text style={styles.roomNoText}>开启摄像头</Text>
              <Switch
                  style={styles.switchStyle}
                  trackColor={{ false: '#EBEBEB', true: '#0B7BFF' }}
                  thumbColor={'#FFFFFF'}
                  onValueChange={this._toggleVideoSwitch}
                  value={this.state.isVideoEnable}
              />
            </View>
            <TouchableOpacity
              style={styles.touchStyle}
              onPress={this._onPress}
              >
              <Text style={styles.joinText}>加入房间</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </>;
  }

  render() {
      const loginView = this._renderLoginView()
      return <>{loginView}</>
  }
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#F1F3F5',
    flex: 1,
  },
  containerViewTop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    marginTop: 12,
    height: 50,
  },
  line: {
    color: '#D6D6D6',
    height: 1,
  },
  containerView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    height: 50,
  },
  roomNoText: {
    fontSize: 16,
    color: '#333333',
    width: 90,
  },
  inputStyle: {
    height: 50,
  },
  switchStyle: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  touchStyle: {
    backgroundColor: '#0B7BFF',
    height: 44,
    marginTop: 15,
    borderRadius: 4,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginHorizontal: 45,
  },
  joinText: {
    color: Colors.white,
    fontSize: 16,
  },
});
