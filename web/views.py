from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
from .util import change_info
from Mypro import settings
import logging
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_job
from django.views.static import serve
from user.models import App_config
from games.models import MengYou_knowlage
from job.models import Jobs, Job
from job.views import *
from django.utils.timezone import utc
import datetime

job_defaults = {'max_instance': 100, 'misfire_grace_time': 15 * 60, ',coalesce': True}
scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE, job_defaults=job_defaults)
scheduler.add_jobstore(DjangoJobStore())

logger = logging.getLogger('django')


def parse_job(jobs):
    print('我在工作')
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
                                          run_date='2020-10-22 13:20:16'
                                          # j.next_run
                                          )
                    else:
                        arg = parse_arg(j.parameters)
                        scheduler.add_job(eval(k), id=k + str(j.id) + 'status',
                                          run_date=j.next_run,
                                          args=[arg['job']]
                                          # [arg['job'], arg['id']]
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
    # if once_jobs is not None:
    #     add_once(once_jobs)
    # if cron_jobs is not None:
    #     add_cron(cron_jobs)


try:
    logger.info("Starting scheduler...")
    scheduler.add_job(func=start_job, trigger='interval', id='检测任务', seconds=5)
    scheduler.start()

except KeyboardInterrupt:
    logger.info("Stopping scheduler...")
    scheduler.shutdown()
    logger.info("Scheduler shut down successfully!")


# Create your views here.
@csrf_exempt
def index(request):
    change_info(request)
    return render(request, 'demo.html')


def api_doc(request, path):
    """
    api文档视图，从url中移动到views
    :param 路径
    """
    if path == '':
        path = 'index.html'
    response = serve(request, path, document_root=settings.APIDOC_ROOT, show_indexes=True)
    return response


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
