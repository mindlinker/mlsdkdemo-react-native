[TOC]

# React Native

## 开发准备

1.  Android minSdkVersion：21
2.  需要准备服务器地址，即在迈聆开放平台申请的房间服务器地址
3.  需要准备好 appKey 和 APPSecret

### 配置 npm 仓库

设置 mindlinker scope 的地址，执行如下命令：
 `npm config set @mindlinker:registry https://artifactory.gz.cvte.cn/artifactory/api/npm/npm-local/`

执行完成后，可使用命令： `npm config list` 检查是否有配置的mindlkinker对应的仓库地址。

### 添加依赖

执行完上述步骤后，添加 mindlinker react-native 的SDK依赖，执行如下命令：
`yarn add @mindlinker/react-native-mindlinker-sdk`

至此基本的依赖就添加完成了。


## 初始化SDK

### 功能介绍

SDK 初始化调用 MLApi.init(serverUrl, logPath, enableConsoleLog, enableLog) 就可以进行 sdk 的初始化。

### 示例代码

```js

const { MLApi } = NativeModules
export function init(serverUrl, logPath, enableConsoleLog, enableLog) {
  console.info(
    `init serverUrl： ${serverUrl} logPath: ${logPath} enableConsoleLog: ${enableConsoleLog} enableLog: ${enableLog}`,
  );
  return MLApi.init(serverUrl, logPath, enableConsoleLog, enableLog);
}

```

### 参数说明

| 参数名称             | 参数类型    | 是否必填 | 参数描述                                    |
| ---------------- | ------- | ---- | --------------------------------------- |
| serverUrl        | String  | 否    | 服务器地址，即在迈聆开放平台申请的房间服务器地址                |
| enableConsoleLog | Boolean | 否    | 是否在控制台输出日志打印                            |
| enableLog        | Boolean | 否    | 是否开启日志                                  |
| logPath          | String  | 是    | 本地日志保存路径，只有enableLog为true的情况下，才会进行日志的写入 |

### 返回值

初始化结果回调

| 参数名称    | 参数类型   | 参数描述               |
| ------- | ------ | ------------------ |
| code    | int    | 返回码 0-成功；-1：未知错误码； |
| message | String | 错误信息               |

## 获取AuthCode

### 功能介绍

AuthCode 根据 JWT 协议生成的，后续 [登录授权](#登录授权) 需要传给 MLApi.authenticate，目的是为了校验 APP 的身份，[了解 AuthCode](https://www.mindlinker.com/doc/rest-api/apis/auth/auth-code.html)

### 示例代码

:::warning
以下获取的 Jwt Token 是为了方便客户端在测试阶段方便调试使用，正式使用时建议从后台生成后获取
:::

生成 JWT 可添加 react-native-pure-jwt 库进行生成

```javascript
    // todo: 正式版的话，为了安全起见，appkey 和 appSecret 是保存在后台服务器的，这个 AuthCode 是由后台返回给到客户端的，
//  客户端这边拿到 authCode 之后传给 MLApi.authenticate，进行账号登录和验证

    import { sign } from "react-native-pure-jwt";

    static String getAuthCode(String nickname, String avatar, String openId)  {
      const userInfoObject = {
        nickname: nickname,
        avatar: avatar,
        openId: openId,
      };
      const payload = {
        appKey: APPID,
        userInfo: userInfoObject,
        iat: new Date().getTime(),
      };
      sign(payload, APP_SECRET, {
        alg: 'HS256',
      })
      .then(value => {
        console.info('jwt token = ', value);
        
      })
      .catch(error => {
        console.info('jwt error = ', error);
      });
    }

```

## 登录授权

### 功能介绍

在完成 [初始化 SDK](#初始化sdk) 调用和 [获取 AuthCode](#获取authcode) 后需要进行换取对应的 Token 来授权认证，授权成功后就可以创建会议和加入会议了，具体调用如下 Api MLApi.authenticate 进行授权认证。

```javascript

  // 获取Token 部分
  import { getClientToken } from "@mindlinker/react-native-mindlinker-sdk"; 

  getClientToken(URL, value)
  .then(response => {
    console.info('get client response = ', response);
    const accessToken = response.access_token || '';
    console.info('get client token = ', response.access_token);
  })
  .catch(error => {
    console.info('get client error = ', error);
  });

  // 认证部分
  const { MLApi } = NativeModules

  MLApi.authenticate(accessToken, nickName, avatar)
      .then(result => {
        console.info('authToken result= ', result);
        if (result.code === 0) {
          console.info('authToken success');
        }
      }

```

### 示例代码

```javascript
  import { getClientToken } from "@mindlinker/react-native-mindlinker-sdk"; 
  const { MLApi } = NativeModules

  getClientToken(URL, value)
  .then(response => {
    console.info('get client response = ', response);
    const accessToken = response.access_token || '';
    console.info('get client token = ', response.access_token);
    if (accessToken !== '') {
      MLApi.authenticate(accessToken, nickName, avatar)
      .then(result => {
        console.info('authToken result= ', result);
        if (result.code === 0) {
          console.info('authToken success');
        }
      }
    }
  })
  .catch(error => {
    console.info('get client error = ', error);
  });

```

### 参数说明

| 参数名称     | 参数类型   | 是否必填 | 参数描述                 |
| -------- | ------ | ---- | -------------------- |
| accessToken | String | 是    | 通过请求getClientToken生成返回（需传递authcode） |
| nickName | String | 是    | 用户名称                 |
| avatar   | String | 是    | 用户头像                 |

### 返回值

| 参数名称        | 参数类型   | 参数描述              |
| ----------- | ------ | ----------------- |
| code        | int    | 返回码 0-成功 -1：未知错误码 |
| message     | String | 错误信息              |

## 创建会议

### 功能介绍

创建会议，使用 Api 是：MLApi.createMeeting()，结果回调：MeetingResult

```javascript
const { MLApi } = NativeModules
export function createMeeting(isMuteVideo, isMuteAudio) {
  console.info(`createMeeting isMuteVideo: ${isMuteVideo} isMuteAudio: ${isMuteAudio} `,);
  return MLApi.createMeeting(isMuteVideo, isMuteAudio);
}

```

### 示例代码

```javascript
MLApi.createMeeting(false, false).then(result => {
      console.info('create meeting result:', result);
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

```

### 参数说明

| 参数名称        | 参数类型    | 是否必填 | 参数描述                     |
| ----------- | ------- | ---- | ------------------------ |
| isMuteVideo | Boolean | 是    | 是否关闭摄像头 true：关闭，false：打开 |
| isMuteAudio | Boolean | 是    | 是否关闭麦克风 true：关闭，false：打开 |

### 返回值

创建会议结果回调

| 参数名称    | 参数类型        | 参数描述                                             |
| ------- | ----------- | ------------------------------------------------ |
| code    | int         | 返回码 0-成功；9997-已经在房间中；403103014-会议室已经存在；-1：未知错误码； |
| message | String      | 错误信息                                             |
| data    | WritableMap | 会议房间信息                                           |

会议房间信息

| 参数名称      | 参数类型    | 参数描述                 |
| --------- | ------- | -------------------- |
| sessionId | String  | sessionId，房间的唯一标识    |
| roomNo    | String  | 房间号                  |
| password  | String  | 房间密码                 |
| isRejoin  | Boolean | 成员是否重新加入房间,默认为 false |

## 加入会议

### 功能介绍

创建会议，使用 Api 是：MLApi.joinMeeting()，结果回调：MeetingResult

```javascript
const { MLApi } = NativeModules
export function joinMeeting(meetingCode, isMuteVideo, isMuteAudio) {
  console.info(`joinMeeting meetingCode: ${meetingCode} isMuteVideo: ${isMuteVideo} isMuteAudio: ${isMuteAudio} `);
  return MLApi.joinMeeting(meetingCode, isMuteVideo, isMuteAudio);
}
```

### 示例代码

```javascript
MLApi.joinMeeting(this.state.roomCode, false, false).then(result => {
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

```

### 参数说明



| 参数名称        | 参数类型    | 是否必填 | 参数描述                     |
| ----------- | ------- | ---- | ------------------------ |
| meetingNo   | String  | 是    | 房间号                      |
| isMuteVideo | Boolean | 是    | 是否关闭摄像头 true：关闭，false：打开 |
| isMuteAudio | Boolean | 是    | 是否关闭麦克风 true：关闭，false：打开 |

### 返回值

&#x20;加入会议结果回调

| 参数名称    | 参数类型        | 参数描述                                             |
| ------- | ----------- | ------------------------------------------------ |
| code    | int         | 返回码 0-成功；9997-已经在房间中；403103014-会议室已经存在；-1：未知错误码； |
| message | String      | 错误信息                                             |
| data    | WritableMap | 会议房间信息                                           |

会议房间信息

| 参数名称      | 参数类型    | 参数描述                 |
| --------- | ------- | -------------------- |
| sessionId | String  | sessionId，房间的唯一标识    |
| roomNo    | String  | 房间号                  |
| password  | String  | 房间密码                 |
| isRejoin  | Boolean | 成员是否重新加入房间,默认为 false |

## LocalVideo

### 功能介绍

本地视频预览

### 示例代码

```javascript
const LocalVideoView = requireNativeComponent('LocalVideoView');
  
<LocalVideoView
          key={'localVideo'}
          style={
            hasRemote ? styles.smallLocalVideo : styles.fullLocalVideoStyle
          }
          onTop={hasRemote}
        />
```

### 参数说明

| 参数名称  | 参数类型 | 是否必填 | 参数描述     |
| ----- | ---- | ---- | -------- |
| onTop | bool | 否    | 是否显示在最上传 |

## &#x20;RemoteVideoView

### 功能介绍

订阅远程视频

### 示例代码

```javascript
const RemoteVideoView = requireNativeComponent('RemoteVideoView');
<RemoteVideoView
          style={styles.remoteVideoStyle}
          uid={remoteMember.uid}
          onTop={false}
        />
```

### &#x20;参数说明

| 参数名称  | 参数类型   | 是否必填 | 参数描述     |
| :---- | :----- | :--- | :------- |
| onTop | bool   | 否    | 是否显示在最上传 |
| uid   | String | 是    | 成员 uid   |

## 退出会议

### 功能介绍

离开会议，可以调用 MLApi.quitMeeting(),  sessionId 为房间的唯一标识符，创建房间或者加入房间成功后会返回该参数。

```javascript
const { MLApi } = NativeModules
export function quitMeeting(dismiss) {
  console.info(`quitMeeting dismiss: ${dismiss}`);
  return MLApi.quitMeeting(dismiss);
}

```

### 示例代码

```javascript
MLApi.quitMeeting(true).then(result => {
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
```

### 参数说明

| 参数名称    | 参数类型 | 是否必填 | 参数描述   |
| ------- | ---- | ---- | ------ |
| dismiss | bool | 是    | 是否解散会议 |

### 返回值

退出会议结果回调

| 参数名称    | 参数类型   | 参数描述               |
| ------- | ------ | ------------------ |
| code    | int    | 返回码 0-成功；-1：未知错误码； |
| message | String | 错误信息               |

## 获取参会人列表

### 功能介绍

获取参会人列表，可以调用 MLApi.getMeetingMembers(),  需要在创建会议/进入会议成功之后调用，否则返回空列表

```javascript
const { MLApi } = NativeModules
export function getMembers() {
  console.info('getMembers');
  return MLApi.getMeetingMembers();
}

```

### 示例代码

```javascript
  MLApi.getMembers().then(membersInfo => {
    console.info('VideoView members:', membersInfo);
    this.setState({
      meetingMembers: membersInfo.memberList,
    });
  });


```

### 参数说明

无

### 返回值

Member 参会人信息

| 参数名称       | 参数类型                | 参数描述               |
| :--------- | :------------------ | :----------------- |
| code       | int                 | 返回码 0-成功；-1：未知错误码； |
| message    | String              | 错误信息               |
| memberList | WritableNativeArray | 参会人列表              |

| 参数名称   | 参数类型   | 参数描述     |
| ------ | ------ | -------- |
| uid    | String | 参会人 uid  |
| name   | String | 昵称       |
| avatar | String | 头像       |
| userId | String | 参会人用户 id |
| isSelf | bool   | 是否为用户本人  |

## 会议状态监听

### 功能介绍

创建会议/加入会议成功之后，可以监听用户入会、用户离会、会议结束、参会人列表更新和会议连接状态

```javascript
const { MLApi } = NativeModules

export const {
  EVENT_ON_USER_JOIN,
  EVENT_ON_USER_LEAVE,
  EVENT_ON_USER_UPDATE,
  EVENT_ON_MEETING_END,
  EVENT_ON_MEDIA_STATE_CHANGED,
} = MLApi;

// 用户入会
export function addMemberJoinListener(listener: (data) => void) {
  return addMindlinkerListener(EVENT_ON_USER_JOIN, listener);
}

// 用户离开会议
export function addMemberRemoveListener(listener: (data) => void) {
  return addMindlinkerListener(EVENT_ON_USER_LEAVE, listener);
}

// 会议结束
export function addMeetingEndListener(listener: (data) => void) {
  return addMindlinkerListener(EVENT_ON_MEETING_END, listener);
}

// 参会人列表更新
export function addMemberUpdatesListener(listener: (data) => void) {
  return addMindlinkerListener(EVENT_ON_USER_UPDATE, listener);
}

// 会议链接状态回调
export function addMediaConnectStateListener(listener: (data) => void) {
  return addMindlinkerListener(EVENT_ON_MEDIA_STATE_CHANGED, listener);
}

function addMindlinkerListener(eventKey: string, listener: any) {
  const nativeEventEmitter = new NativeEventEmitter(MLApi);
  return nativeEventEmitter.addListener(eventKey, listener);
}
```

### 示例代码

```javascript
import {
    addMemberJoinListener,
    addMemberRemoveListener,
    addMeetingEndListener,
    addMediaConnectStateListener
} from '../libs/MindlinkerSDK';

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

```

## 错误码对照表

| 错误码       | 描述                                      |
| --------- | --------------------------------------- |
| 0         | 成功                                      |
| -1        | 未知错误                                    |
| 1004      | 会议已经解散                                  |
| 9992      | 本地录制失败                                  |
| 9993      | 无效的本地录制路径                               |
| 9994      | 无效的方法调用                                 |
| 9995      | 加入会议过程中被取消                              |
| 9997      | 用户已在房间中                                 |
| 9998      | SDK 未初始化                                |
| 9999      | 无效参数                                    |
| 11000     | 无效的设备                                   |
| 11001     | 无法创建渲染器                                 |
| 11002     | 无法启动照相机                                 |
| 11003     | 无效的 sdp                                 |
| 11004     | 无效的 sdp answer                          |
| 11005     | 无法启动麦克风                                 |
| 11006     | 无法启动扬声器                                 |
| 11007     | 无法关闭照相机                                 |
| 12000     | 不能识别的滤镜 GUID                            |
| 12001     | 滤镜已经存在                                  |
| 13001     | 未授权                                     |
| 13002     | 未加入任务房间                                 |
| 99997     | 当前网络不可用                                 |
| 4001002   | 该参数的值进行唯一性校验时，已存在                       |
| 4011000   | Token 失效或者账号在其他设备上登录了                   |
| 4003100   | 访问不存在的资源                                |
| 4003101   | 端点不存在，端点 ID 错误                          |
| 4003102   | 会议不存在                                   |
| 4003105   | 用户不存在                                   |
| 4003106   | 设备不存在                                   |
| 4003107   | 企业不存在                                   |
| 4031000   | 资源被禁止访问。                                |
| 4031001   | 资源被禁止删除。                                |
| 4031002   | 用户角色验证失败                                |
| 4031003   | 用户权限验证失败                                |
| 4031004   | API 权限验证失败                              |
| 4031005   | 匿名入会时会议不存在                              |
| 4003124   | 房间已存在                                   |
| 4041000   | URL 参数错误                                |
| 4041001   | 找不到对应的 namespace                        |
| 4041002   | API未注册                                  |
| 4041003   | 对应的API版本不支持当前的 Method                   |
| 4041004   | 对应版本找不到指定的 host                         |
| 5000001   | 获取不到 ClientToken                        |
| 5000002   | 无法向认证服务器认证 Accesstoken                  |
| 5001002   | 服务器更新数据失败                               |
| 5001005   | 没有可用的 DS                                |
| 5001006   | 节点未级联                                   |
| 5002002   | 账号系统异常                                  |
| 5002001   | SFU 服务器异常                               |
| 400111001 | 请求参数校验不正确                               |
| 404111003 | 房间号错误或加入房间已结束                           |
| 403111031 | 成员禁止加入房间                                |
| 403111044 | 输入房间密码错误，如果房间是需要密码的，而成员没传密码加入房间也会报这个错误码 |
| 403111044 | 输入房间密码次数 5 分钟内达到上限                      |
| 403111051 | 无法被指定为主持人，当前用户可能是小程序入会                  |
| 403111052 | 无法被指定为焦点视频，当前用户可能是小程序入会                 |
| 403111066 | 正在应用自定义布局，暂不支持设置焦点视频                    |
| 403111023 | 房间已锁定                                   |
| 403111046 | 密码输入错误次数过多                              |
| 403111006 | 当前用户无权限                                 |
| 403111030 | 不能将角色转给硬件终端                             |
| 400111001 | 某参数值校验不正确,在于值的类型错误                      |
| 400111002 | 缺少 Accesstoken                          |
| 404111003 | 房间不存在                                   |
| 404111007 | 未加入任何房间，端点有效，但不存在请求的房间中                 |
| 403119005 | 免费视频会议并发数量已到上限                          |
| 403119009 | 购买的视频会议数量已到上限                           |
| 403119010 | 在其他平台发起了会议                              |
| 403119011 | 免费方数已到上限                                |
| 403119012 | 支付方数已到上限                                |
| 403119013 | 专属会议方数已到上限                              |
| 403103017 | 企业开启的会议总数已达上限                           |
| 403111018 | 单个会议的人数超过限制                             |
| 403111023 | 会议已被锁定                                  |
| 403111031 | 您已被禁止入会                                 |
| 403111044 | 入会密码错误                                  |
| 403111045 | 入会凭证已失效                                 |
| 403111040 | 企业未开通录制功能                               |
| 400111041 | 存储空间不足                                  |
| 500111004 | 当前资源被锁定                                 |
| 500111011 | 信令服务器不可用                                |
| 500111012 | 没有可用的SFU                                |
| 500111013 | 远程服务异常                                  |

