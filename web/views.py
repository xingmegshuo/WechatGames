from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from .util import change_info
from Mypro import settings
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_job
from django.views.static import serve
from user.models import App_config, APP
from games.models import MengYou_knowlage
from job.models import Jobs, Job
from job.views import *
from django.utils.timezone import utc
import datetime
from django.http import HttpResponse

job_defaults = {'max_instance': 100, 'misfire_grace_time': 15 * 60, ',coalesce': True}
scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE, job_defaults=job_defaults)
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
            logger.info('获取' + str(len(Job.objects.filter(job=j, on_line=False))) + '个任务:' + j.name)
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
                                          run_date=
                                          # '2020-10-22 13:20:16'
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
    response = serve(request, path, document_root=settings.APIDOC_ROOT, show_indexes=True)
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
    return redirect('/admin/user/app_config/')


# 项目配置是否启动
def start_app(request):
    pk = request.GET.get('id')
    status = request.GET.get('status')
    config = App.objects.get(id=pk)
    if status == '0':
        config.on_line = '1'
    else:
        config.on_line = '0'
    config.save()
    return redirect('/admin/user/app/')


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
    return redirect('/admin/games/mengyou_knowlage/')
