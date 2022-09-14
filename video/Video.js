/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

 import React, { Component } from 'react';
import { ToastAndroid } from 'react-native';
import {
  requireNativeComponent,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
} from 'react-native';

import {
    addMemberJoinListener,
    getMembers,
    addMemberRemoveListener,
    addMeetingEndListener,
    quitMeeting,
    addMediaConnectStateListener
} from '../libs/MindlinkerSDK';

const LocalVideoView = requireNativeComponent('LocalVideoView');
const RemoteVideoView = requireNativeComponent('RemoteVideoView');

type Props = {
  navigation: any,
}

type State = {
  meetingMembers: ArrayList<any>,
};

export default class VideoView extends Component<Props, State> {

  memnerJoinListener: any
  memberLeaveListener: any
  meetingEndListener: any
  meetingMediaStateChanged: any

  static navigationOptions = ({ navigation }) => {
    return {
      title: `房间号：${navigation.getParam('roomCode', '')}`,
    };
  };

  constructor(props: Props) {
    super(props);
    getMembers().then(membersInfo => {
      console.info('VideoView members:', membersInfo);
      this.setState({
        meetingMembers: membersInfo.memberList,
      });
    });
    this.state = {
      meetingMembers: [],
    };
  }

  componentDidMount() {
    this.memnerJoinlistener = addMemberJoinListener(member => {
      console.info('member add listener member: ', member);
      const members = this.state.meetingMembers;
      members.push(member);
      this.setState({
        meetingMembers: members,
      });
    });
    this.memberLeaveListener = addMemberRemoveListener(leaveInfo => {
      console.info('member remove listener uid: ', leaveInfo.uid);
      console.info('member remove meetingMembers: ', this.state.meetingMembers);
      this.setState({
        meetingMembers: this.state.meetingMembers.filter(
          member => member.uid !== leaveInfo.uid,
        ),
      });
    });
    this.meetingEndListener = addMeetingEndListener(info => {
      console.info('meeting end listener: ', info);
      ToastAndroid.showWithGravity(
        '会议已结束',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      this.props.navigation.goBack();
    });
    this.meetingMediaStateChanged = addMediaConnectStateListener(stateInfo => {
      console.info('meeting media state listener: ', stateInfo);
      // 音频正在重连
      if (stateInfo.type === 1 && stateInfo.state === 1) {
        ToastAndroid.showWithGravity(
          '正在重连...',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else if (stateInfo.type === 1 && stateInfo.state === 2) {
        // 音频重连, 已经断开
        ToastAndroid.showWithGravity(
          '已经断线请重新入会',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    })
  }

  componentWillUnmount() {
    this.memnerJoinlistener.remove();
    this.memberLeaveListener.remove();
    this.meetingEndListener.remove();
    this.meetingMediaStateChanged.remove();
  }

  _onPress = () => {
    console.info('onpress handUp');
    quitMeeting().then(result => {
      console.info('quit meeting result: ', result);
      if (result.code === 0) {
        ToastAndroid.showWithGravity(
          '退出成功',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        this.props.navigation.goBack();
      } else {
        ToastAndroid.showWithGravity(
          '退出失败',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }
    });
  };

  render() {
    const hasRemote = this.state.meetingMembers.length >= 2;
    console.info('VideoView hasRemote :', hasRemote);
    let remoteVideo = null;
    if (this.state.meetingMembers.length >= 2) {
      const remoteMember = this.state.meetingMembers.find(
        member => !member.isSelf,
      );
      console.info('VideoView remoteMember :', remoteMember);
      remoteVideo = (
        <RemoteVideoView
          style={styles.remoteVideoStyle}
          uid={remoteMember.uid}
          subscribeVideo={remoteMember.uid}
          onTop={false}
        />
      );
    }
    return (
      <View style={styles.layoutContainer}>
        {remoteVideo}
        <LocalVideoView
          key={'localVideo'}
          style={
            hasRemote ? styles.smallLocalVideo : styles.fullLocalVideoStyle
          }
          onTop={hasRemote}
          subscribeVideo={'localVideo'}
        />
        <TouchableOpacity
          style={styles.handUpContainer}
          onPress={this._onPress}>
          <Image
            style={styles.handUpImage}
            source={require('./images/hangup.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  layoutContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  fullLocalVideoStyle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  smallLocalVideo: {
    position: 'absolute',
    top: 12,
    right: 12,
    height: 160,
    width: 120,
    elevation: 1,
  },
  remoteVideoStyle: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    elevation: 0,
  },
  handUpContainer: {
    position: 'absolute',
    bottom: 60,
    left: '42%',
    elevation: 2,
  },
  handUpImage: {
    width: 60,
    height: 60,
  },
});
