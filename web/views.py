from typing_extensions import runtime
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from .util import change_info
from Mypro import settings
from django.http import JsonResponse
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_job
from django.views.static import serve
from user.models import App_config, APP
from games.models import MengYou_knowlage
from job.models import Jobs, Job
from job.views import *
from django.db.models import Q
from user.views import get_app_config, get_parameter_dic
from django.utils import timezone
import time
from django.http import HttpResponse
from games.models import Advertising
from django.forms import model_to_dict
from voice.models import Voice

job_defaults = {'max_instance': 100,
                'misfire_grace_time': 15 * 60, ',coalesce': True}
scheduler = BackgroundScheduler(
    timezone=settings.TIME_ZONE, job_defaults=job_defaults)
scheduler.add_jobstore(DjangoJobStore())

logger = logging.getLogger('django')


def parse_job(jobs):
    # print('我在工作')
    if len(jobs) > 0:
        run_job = {}
        for j in jobs:
            if len(Job.objects.filter(job=j, on_line=False)) > 0:
                run_job[j.name] = Job.objects.filter(job=j, on_line=False)
            else:
                run_job[j.name] = None
            j.on_line = True
            logger.info(
                '获取' + str(len(Job.objects.filter(job=j, on_line=False))) + '个任务:' + j.name)
            j.save()
    else:
        run_job = None
    return run_job


# def pase_cron_job(jobs):
#     if len(jobs) > 0:
#         for i in jobs:
#             if i.name == 'analyze_data':
#                 print('1233')
#
#                 scheduler.add_job(analyze_data, trigger='cron', id='每日分析', day_of_week='0-6', hour=00, minute=00,
#                                   second=1, args=['0'])
#                 scheduler.add_job(analyze_data, trigger='cron', id='每周分析', day_of_week='0', hour=00, minute=00,
#                                   second=1, args=['1'])
#                 # scheduler.add_job(analyze_data, trigger='cron', id='每月分析', day_of_week='1', hour=00, minute=00,
#                 #                   second=1, args=[1])
#                 i.on_line = True
#                 i.save()


def parse_arg(next_arg):
    arg = json.loads(next_arg)
    return arg


def add_cron(cron_jobs):
    for k, v in cron_jobs.items():
        if v is not None:
            logger.info('添加cron任务' + k)
            for j in v:
                arg = parse_arg(j.next_run)
                scheduler.add_job(eval(k), trigger='cron', id=k + str(j.id) + '分析',
                                  day_of_week=arg['day_of_week'],
                                  hour=arg['hour'], minute=int(arg['minute']), second=arg['second'],
                                  args=[j.parameters])
                j.on_line = True
                j.save()


def add_once(once_jobs):
    for k, v in once_jobs.items():
        if v is not None:
            logger.info('添加定时任务' + k)
            for j in v:
                if j.on_line is False and j.is_over is False:
                    if j.parameters is None:
                        scheduler.add_job(eval(k), 'date', id=k + str(j.id),
                                          run_date=  # '2020-10-22 13:20:16'
                                          j.next_run
                                          )
                    else:
                        arg = parse_arg(j.parameters)
                        scheduler.add_job(eval(k), id=k + str(j.id) + 'status',
                                          run_date=j.next_run,
                                          # args=[arg['job']]
                                          args=[arg['job'], arg['id']]
                                          )
                    j.on_line = True
                    j.save()

        # main_job = Jobs.objects.get(name=k)
        # run_time = max([i.next_run for i in v])
        # Job.objects.create(job=main_job,
        #                    next_run=run_time + datetime.timedelta(seconds=3),
        #                    parameters=json.dumps({'job': 'Jobs', 'id': str(main_job.id)}))
        #     run_time = max([i.next_run for i in v])
        #     job = Jobs.objects.get(name='change_status')
        #     j = Job.objects.create(job=job, next_run=run_time.replace(tzinfo=utc),
        #                            parameters='{job:Jobs,id:' + str(job.id) + '}')
        #     j.save()
        # scheduler.add_job(change_status, id=k + 'status',
        #                   run_date=run_time.replace(tzinfo=utc), args=[job])


def start_job():
    once_jobs = parse_job(Jobs.objects.filter(jobType='date', on_line=False))
    # interval_jobs = parse_job(Jobs.objects.filter(jobType='interval', on_line=False))
    cron_jobs = parse_job(Jobs.objects.filter(jobType='cron', on_line=False))
    # logger.info({'once_job': once_jobs, 'cron_jobs': cron_jobs})
    if once_jobs is not None:
        add_once(once_jobs)
    if cron_jobs is not None:
        add_cron(cron_jobs)


try:
    logger.info("Starting scheduler...")
    scheduler.add_job(func=start_job, trigger='interval', id='检测任务', seconds=5)
    scheduler.start()

except KeyboardInterrupt:
    logger.info("Stopping scheduler...")
    scheduler.shutdown()
    logger.info("Scheduler shut down successfully!")


def checkMobile(request):
    import re
    """
    demo :
        @app.route('/m')
        def is_from_mobile():
            if checkMobile(request):
                return 'mobile'
            else:
                return 'pc'
    :param request:
    :return:
    """
    # 返回True是手机 返回false是电脑
    userAgent = request.META.get('HTTP_USER_AGENT', "pc")
    # userAgent = env.get('HTTP_USER_AGENT')

    _long_matches = r'googlebot-mobile|android|avantgo|blackberry|blazer|elaine|hiptop|ip(hone|od)|kindle|midp|mmp|mobile|o2|opera mini|palm( os)?|pda|plucker|pocket|psp|smartphone|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce; (iemobile|ppc)|xiino|maemo|fennec'
    _long_matches = re.compile(_long_matches, re.IGNORECASE)
    _short_matches = r'1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-'
    _short_matches = re.compile(_short_matches, re.IGNORECASE)

    if _long_matches.search(userAgent) != None:
        return True
    user_agent = userAgent[0:4]
    if _short_matches.search(user_agent) != None:
        return True
    return False


# Create your views here.
@csrf_exempt
def index(request):
    change_info(request)
    if checkMobile(request):
        return render(request, 'm/base.html')
    else:
        return render(request, 'pc/base.html')


def about_company(request):
    if checkMobile(request):
        return render(request, 'm/company.html')
    else:
        return render(request, 'pc/company.html')


def about_project(request):
    if checkMobile(request):
        return render(request, 'm/project.html')
    else:
        return render(request, 'pc/project.html')


def about_me(request):
    if checkMobile(request):
        return render(request, 'm/about.html')
    else:
        return render(request, 'pc/about.html')


def api_doc(request, path):
    """
    api文档视图，从url中移动到views
    :param 路径
    """
    if path == '':
        path = 'index.html'
    response = serve(
        request, path, document_root=settings.APIDOC_ROOT, show_indexes=True)
    return response


# 支付回调
def pay(request, *args, **kwargs):
    params = request.body
    import xmltodict
    content = xmltodict.parse(params)
    logger.info({"支付回调": content})
    return HttpResponse(content)


def bad_request(request, exception, template_name='page_400.html'):
    return render(request, template_name)


def permission_denied(request, exception, template_name='page_403.html'):
    return render(request, template_name)


def page_not_found(request, exception, template_name='404.html'):
    return render(request, template_name)


def server_error(request, template_name='page_500.html'):
    return render(request, template_name)


# 项目配置是否启动
def start_config(request):
    pk = request.GET.get('id')
    status = request.GET.get('status')
    config = App_config.objects.get(id=pk)
    if status == '0':
        config.on_line = '1'
    else:
        config.on_line = '0'
    config.save()
    return redirect('/MGG/user/app_config/')


# 项目配置是否启动
def start_app(request):
    pk = request.GET.get('id')
    status = request.GET.get('status')
    config = APP.objects.get(id=pk)
    if status == '0':
        config.on_line = '1'
    else:
        config.on_line = '0'
    config.save()
    return redirect('/MGG/user/app/')


# 萌游知知，知识是否审核通过
def review(request):
    pk = request.GET.get('id')
    status = request.GET.get('status')
    config = MengYou_knowlage.objects.get(id=pk)
    if status == 'True':
        config.status = False
        config.is_check = True
    else:
        config.status = True
        config.is_check = True
    config.save()
    return redirect('/MGG/games/mengyou_knowlage/')


# 游戏 启动参数
def GameStart(request):
    """
        @api {GET} /gameStart/ 启动参数
        @apiVersion 0.0.1
        @apiDescription 游戏启动信息
        @apiName 广告获取
        @apiGroup DATA
        @apiParam {String} name 小游戏名字 获取单个小游戏的配置

       @apiExample {json} Example usage:
                {
                    "name":"ml",
                }
    """
    app = get_app_config(request.GET.get('name'))
    config = App_config.objects.filter(app_id=app).filter(~Q(orther='0'))
    share_key = list(set([i.description for i in config.filter(orther='1')]))
    share_config = {i: {j.name: j.value for j in config.filter(
        orther='1', description=i)} for i in share_key}
    orther_key = list(set([i.description for i in config.filter(orther='2')]))
    orther_config = {i: {j.name: j.value for j in config.filter(
        orther='2', description=i)} for i in orther_key}
    box = config.filter(orther='3')
    if len(box) > 0:
        box = box[0].value.split(',')
        boxInfo = []
        for i in box:
            ad = Advertising.objects.get(id=int(i))
            # print(ad)
            boxInfo.append(
                {"id": ad.id, "title": ad.title, "logo": "https://www.menguoli.com/" + ad.logo.url, "appid": ad.appid})
        # print(boxInfo)
    else:
        boxInfo = "none"
    return JsonResponse({"shareConfig": share_config, 'ortherMS': orther_config, 'boxInfo': boxInfo})


# 氢原子项目暂时
def Hydor(request):
    try:
        n = request.GET.get('n', 4)
        l = request.GET.get('l', 1)
        m = request.GET.get('m', 0)
        n, l, m = float(n), float(l), float(m)
        import numpy as np
        import matplotlib.pyplot as plt
        from scipy.special import sph_harm
        from scipy.special import assoc_laguerre
        from pathlib import Path

        my_file = Path(settings.STATIC_ROOT + str(n) +
                       str(l) + str(m) + ".png")
        x = np.linspace(-n ** 2 * 4, n ** 2 * 4, 500)
        y = 0  # the plane locates at y = 0
        z = np.linspace(-n ** 2 * 4, n ** 2 * 4, 500)
        X, Z = np.meshgrid(x, z)
        rho = np.linalg.norm((X, y, Z), axis=0) / n
        Lag = assoc_laguerre(2 * rho, n - l - 1, 2 * l + 1)
        Ylm = sph_harm(m, l, np.arctan2(y, X), np.arctan2(
            np.linalg.norm((X, y), axis=0), Z))
        Psi = np.exp(-rho) * np.power((2 * rho), l) * Lag * Ylm
        density = np.conjugate(Psi) * Psi
        density = density.real
        if not my_file.is_file():
            fig, ax = plt.subplots(figsize=(10, 10))
            ax.imshow(density.real,
                      extent=[-density.max() * 0.2, density.max() *
                              0.2, -density.max() * 0.2, density.max() * 0.2],
                      cmap='gist_stern')
            # plt.show()
            fig.set_facecolor('black')
            fig.savefig(settings.STATIC_ROOT + str(n) +
                        str(l) + str(m) + ".png", dpi=300)
            plt.close()
        theta1 = np.linspace(0, 2 * np.pi, 181)
        phi1 = np.linspace(0, np.pi, 91)
        theta_2d, phi_2d = np.meshgrid(theta1, phi1)
        Ylm1 = sph_harm(abs(m), l, theta_2d, phi_2d)
        xyz_2d = np.array([np.sin(phi_2d) * np.sin(theta_2d),
                          np.sin(phi_2d) * np.cos(theta_2d), np.cos(phi_2d)])
        if m < 0:
            Ylm1 = np.sqrt(2) * (-1) ** m * Ylm1.imag
        else:
            Ylm1 = np.sqrt(2) * (-1) ** m * Ylm1.real
        r = np.abs(Ylm1.real) * xyz_2d

        # plt.plot(r[0][1], r[1][1])
        try:
            T = density * (((4 * np.pi) / 3) * (((np.max(X) + X)
                           ** 3) - ((4 * np.pi) / 3 * (X ** 3))))
            # T = (T - np.min(T)) / (np.max(T) - np.min(T))  # 最值归一化

            T = (T - np.min(T)) / (np.max(T) - np.min(T))
            T = T.tolist()[100:250]
            y = [round(x[249:250][0], 6) * 300 for x in T]
        except:
            y = None
        return JsonResponse({'src': settings.STATIC_ROOT + str(n) + str(l) + str(m) + ".png", 'r': r.tolist(), 'y': y})
    except:
        return JsonResponse({'sorry': 'error'})


# 文字转语音接口不使用jwt
def MyVoice(request):
    """
        @api {GET} /make_voice/ 生成音频数据接口-更新为不需要jwt认证接口
        @apiVersion 0.0.1
        @apiName 文字转音频
        @apiGroup GAME

        @apiParam {String} name 文件标签 参数必须,标签必须为唯一
        @apiParam {String} text 文本内容 参数必须
        @apiParam {string} human 说话人 参数可选 说话人参数0成年女人,1成年男人,101015,男孩,101016,女孩,针对不同游戏可能使用不同的声音来进行区分,默认为小女孩，通常不加此参数
        @apiError {String} status 请求状态1,成功,0失败
        @apiError {String} mes 信息提示
        @apiSuccess {String} voice_url 音频文件url

        @apiSuccessExample Success-Response:
        HTTP/1.1 200 OK
        {
            'status': 1,
            "voice_url":"static/voice/talk.mp3"
        }

        @apiError {String} mes 错误提示

        @apiErrorExample Error-Response:
        {
            'status': 0,
            "mes": "没有必须参数text"
        }
    """
    name = request.GET.get('name', 'demo')
    text = request.GET.get('text', 'None')
    human = request.GET.get('human', '101016')
    if text == 'None':
        return JsonResponse({
            'status': 0,
            'mes': '没有必须参数，text'
        })
    else:
        try:
            voice = Voice.objects.get(content=text, human=int(human))
        except:
            voice = Voice(content=text, name=name, human=int(human))
            voice.save()
        return JsonResponse({
            'status': 1,
            'voice_url': "https://menguoli.com" + settings.MEDIA_URL + str(voice.url)
        })


# 获取网络utc时间
def get_time(request):
    """
               @api {GET} /now/ 获取服务器utc时间
               @apiVersion 0.0.1
               @apiName 获取服务器utc时间
               @apiGroup GAME
    """
    return JsonResponse({'time': timezone.now().strftime("%Y-%m-%d-%H:%M:%S")})


def send_message(app_id, app_secret, data):
    r = requests.get(
        url='https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + app_id + '&secret=' + app_secret)
    token = json.loads(r.text)['access_token']
    mes_url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + token
    data["access_token"] = token
    r = requests.post(mes_url, json.dumps(data), headers={
        'Content-type': 'application/raw'})
    result = json.dumps(r.text)
    logger.info('发送订阅消息')
    logger.info('subscription:{}'.format(result))

# 订阅消息


def subscribe(request):
    name = request.GET.get("name", "null")
    openid = request.GET.get('user', 'null')
    dateSend = request.GET.get('date', 'null')
    templateId = request.GET.get('template', 'null')
    data = request.GET.get('data', '')
    if name == "null" or openid == 'null' or dateSend == 'null' or templateId == 'nul':
        return JsonResponse({"status": "error", 'msg': '缺少必须数据'})
    appid = get_app_config(name).app_id
    secert = get_app_config(name).secret
    if appid == '' or secert == '':
        return JsonResponse({"status": 'error', 'msg': '获取数据出错'})
    runtime = time.localtime(int(dateSend))
    param = {
        'touser': openid,
        'template_id': templateId,
        #  "page": "index",
        'data': json.loads(data)
    }
    scheduler.add_job(send_message, id=openid,
                      run_date=time.strftime("%Y-%m-%d %H:%M:%S", runtime),
                      args=[appid, secert, param]
                      )

    return JsonResponse({"status": 'ok', 'msg': '添加成功'})
