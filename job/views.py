from django.shortcuts import render

# Create your views here.

from user.views import settings, logger
import requests
import json
from .models import Jobs, Job
from analy.models import Analysis
from games.models import *


def send_mes(app_id, app_secret, data):
    r = requests.get(
        url='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + app_id + '&secret=' + app_secret)
    token = json.loads(r.text)['access_token']
    mes_url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + token
    r = requests.post(mes_url, json.dumps(data))
    result = json.dumps(r.text)
    logger.info('发送订阅消息')
    logger.info('subscription:{}'.format(result))


def change_status(recoding, id):
    logger.info('修改状态')
    coding = eval(recoding).objects.get(id=id)
    coding.is_over = True
    coding.save()
    job = Job.objects.filter(parameters__contains=recoding).filter(parameters__contains=str(id))[0]
    job.is_over = True
    job.save()
    all_job = Jobs.objects.all()
    for j in all_job:
        if len(Job.objects.filter(job=j)) == len(Job.objects.filter(job=j).filter(is_over=True)):
            j.is_over = True
            j.save()
        else:
            j.is_over = False
            j.save()


def analyze_data(table_type):
    a = Analysis.objects.create(title='数据分析', table_type=table_type)
    a.save()


def test():
    print('are you ok?')
