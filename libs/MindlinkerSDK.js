import {NativeModules,NativeEventEmitter} from 'react-native';

const { MLApi } = NativeModules

export const {
  EVENT_ON_USER_JOIN,
  EVENT_ON_USER_LEAVE,
  EVENT_ON_USER_UPDATE,
  EVENT_ON_MEETING_END,
  EVENT_ON_MEDIA_STATE_CHANGED,
} = MLApi;

export function init(serverUrl, logPath, enableConsoleLog, enableLog) {
  console.info(
    `init serverUrl： ${serverUrl} logPath: ${logPath} enableConsoleLog: ${enableConsoleLog} enableLog: ${enableLog}`,
  );
  return MLApi.init(serverUrl, logPath, enableConsoleLog, enableLog);
}

export function authenticate(accessToken, nickName, avatar) {
  console.info(
    `authenticate： ${accessToken} nickName: ${nickName} avatar: ${avatar}`,
  );
  return MLApi.authenticate(accessToken, nickName, avatar);
}

export function createMeeting(isMuteVideo, isMuteAudio) {
  console.info(`createMeeting isMuteVideo: ${isMuteVideo} isMuteAudio: ${isMuteAudio} `,);
  return MLApi.createMeeting(isMuteVideo, isMuteAudio);
}

export function joinMeeting(meetingCode, isMuteVideo, isMuteAudio) {
  console.info(`joinMeeting meetingCode: ${meetingCode} isMuteVideo: ${isMuteVideo} isMuteAudio: ${isMuteAudio} `);
  return MLApi.joinMeeting(meetingCode, isMuteVideo, isMuteAudio);
}

export function quitMeeting(dismiss) {
  console.info(`quitMeeting dismiss: ${dismiss}`);
  return MLApi.quitMeeting(dismiss);
}

export function getMembers() {
  console.info('getMembers');
  return MLApi.getMeetingMembers();
}

export function addMemberJoinListener(listener: (data) => void) {
  return addMindlinkerListener(EVENT_ON_USER_JOIN, listener);
}

export function addMemberRemoveListener(listener: (data) => void) {
  return addMindlinkerListener(EVENT_ON_USER_LEAVE, listener);
}

export function addMeetingEndListener(listener: (data) => void) {
  return addMindlinkerListener(EVENT_ON_MEETING_END, listener);
}

export function addMemberUpdatesListener(listener: (data) => void) {
  return addMindlinkerListener(EVENT_ON_USER_UPDATE, listener);
}

export function addMediaConnectStateListener(listener: (data) => void) {
  return addMindlinkerListener(EVENT_ON_MEDIA_STATE_CHANGED, listener);
}

function addMindlinkerListener(eventKey: string, listener: any) {
  const nativeEventEmitter = new NativeEventEmitter(MLApi);
  return nativeEventEmitter.addListener(eventKey, listener);
}
