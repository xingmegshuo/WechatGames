# -*- coding:utf-8 -*-
import configparser
import urllib
import base64
import hmac
import hashlib, time
import requests

auth_file_path = "./conf/tcloud_auth.ini"
param_file_path = "./conf/request_parameter.ini"


class authorization:
    AppId = 0
    SecretId = ""
    SecretKey = ""
    Expired = 3600
    conf = configparser.ConfigParser()

    def init(self):
        self.conf.read("./conf/tcloud_auth.ini", encoding="UTF-8")
        self.AppId = self.conf.getint("authorization", "AppId")
        self.SecretId = self.conf.get("authorization", "SecretId")
        self.SecretKey = self.conf.get("authorization", "SecretKey")

    def verify_param(self):
        if len(str(self.AppId)) == 0:
            print('AppId can not empty')
        if len(str(self.SecretId)) == 0:
            print('SecretId can not empty')
        if len(str(self.SecretKey)) == 0:
            print('SecretKey can not empty')

    def init_auth(self, appid, secret_id, secret_key):
        self.AppId = appid
        self.SecretId = secret_id
        self.SecretKey = secret_key

    def generate_sign(self, request_data):
        url = "tts.cloud.tencent.com/stream"
        sign_str = "POST" + url + "?"
        sort_dict = sorted(request_data.keys())
        for key in sort_dict:
            sign_str = sign_str + key + "=" + urllib.parse.unquote(str(request_data[key])) + '&'
        sign_str = sign_str[:-1]
        sign_bytes = sign_str.encode('utf-8')
        key_bytes = self.SecretKey.encode('utf-8')
        authorization = base64.b64encode(hmac.new(key_bytes, sign_bytes, hashlib.sha1).digest())
        return authorization.decode('utf-8')


class request:
    Text = "今天天气真好啊！出去玩吧老东西"
    Action = "TextToStreamAudio"
    Codec = "pcm"
    Expired = 0
    ModelType = 0
    PrimaryLanguage = 1
    ProjectId = 0
    SampleRate = 16000
    SessionId = "123"
    Speed = 0
    VoiceType = 0
    Volume = 5
    conf = configparser.ConfigParser()

    def init(self):
        self.conf.read("./conf/request_parameter.ini", encoding="UTF-8")
        self.Text = self.conf.get("parameter", "Text")
        self.Action = self.conf.get("parameter", "Action")
        self.Codec = self.conf.get("parameter", "Codec")
        self.Expired = self.conf.getint("parameter", "Expired")
        self.ModelType = self.conf.getint("parameter", "ModelType")
        self.PrimaryLanguage = self.conf.getint("parameter", "PrimaryLanguage")
        self.ProjectId = self.conf.getint("parameter", "ProjectId")
        self.SampleRate = self.conf.getint("parameter", "SampleRate")
        self.SessionId = self.conf.get("parameter", "SessionId")
        self.Speed = self.conf.getint("parameter", "Speed")
        self.VoiceType = self.conf.getint("parameter", "VoiceType")
        self.Volume = self.conf.getint("parameter", "Volume")

    def verify_param(self):
        if len(str(self.Action)) == 0:
            print('Action can not empty')
        if len(str(self.SampleRate)) == 0:
            print('SampleRate is not set, assignment default value 16000')
            self.SampleRate = 16000

    def init_param(self, text, action, codec, expired, model_type, prim_lan, project_id, sample_rate, session_id, speed,
                   voice_type, volume):
        self.Action = action
        self.Text = text
        self.Codec = codec
        self.Expired = expired
        self.ModelType = model_type
        self.PrimaryLanguage = prim_lan
        self.ProjectId = project_id
        self.SampleRate = sample_rate
        self.SessionId = session_id
        self.Speed = speed
        self.VoiceType = voice_type
        self.Volume = volume


def make_voice(data):
    req = request()
    # req.init()
    req.init_param(data.get('text'), 'TextToStreamAudio', 'pcm', 0, 1, data.get('language'), 0, 16000, data.get('id'),
                   data.get('speed'), data.get('speaker'), data.get('sound'))
    auth = authorization()
    auth.init()
    request_data = dict()
    request_data['Action'] = req.Action
    request_data['AppId'] = auth.AppId
    request_data['Codec'] = req.Codec
    request_data['Expired'] = int(time.time()) + auth.Expired
    request_data['ModelType'] = req.ModelType
    request_data['PrimaryLanguage'] = req.PrimaryLanguage
    request_data['ProjectId'] = req.ProjectId
    request_data['SampleRate'] = req.SampleRate
    request_data['SecretId'] = auth.SecretId
    request_data['SessionId'] = req.SessionId
    request_data['Speed'] = req.Speed
    request_data['Text'] = req.Text
    request_data['Timestamp'] = int(time.time())
    request_data['VoiceType'] = req.VoiceType
    request_data['Volume'] = req.Volume
    signature = auth.generate_sign(request_data=request_data)
    header = {
        "Content-Type": "application/json",
        "Authorization": signature
    }
    url = "https://tts.cloud.tencent.com/stream"
    import json
    r = requests.post(url, headers=header, data=json.dumps(request_data), stream=True)
    '''
    if str(r.content).find("Error") != -1 :
        print(r.content)
        return
    '''
    i = 1
    import wave
    wavfile = wave.open(data.get('name') + '.mp3', 'wb')
    wavfile.setparams((1, 2, 16000, 0, 'NONE', 'NONE'))
    for chunk in r.iter_content(1000):
        if (i == 1) & (str(chunk).find("Error") != -1):
            print(chunk)
            return
        i = i + 1
        wavfile.writeframes(chunk)
    wavfile.close()



