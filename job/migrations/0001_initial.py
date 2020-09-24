# Generated by Django 2.1.5 on 2020-09-09 17:24

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Jobs',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[(0, '发送订阅消息'), (1, '修改学习状态')], default='0', help_text='任务名称，描述任务做什么的', max_length=200, verbose_name='任务名称')),
                ('jobType', models.CharField(choices=[('0', '定时一次任务'), ('1', '周期任务'), ('2', 'corn任务')], default='0', help_text='任务类型', max_length=10, verbose_name='任务类型')),
                ('job_id', models.CharField(help_text='任务名', max_length=200, verbose_name='任务队列')),
                ('plan', models.CharField(help_text='计划运行', max_length=200, verbose_name='计划运行')),
                ('next_run', models.DateTimeField(help_text='下次执行时间', null=True, verbose_name='下次执行时间')),
                ('on_line', models.BooleanField(choices=[(True, '启动'), (False, '停止')], default=True, help_text='是否启动', verbose_name='是否启动')),
                ('create_date', models.DateTimeField(auto_now_add=True, help_text='任务创建时间', verbose_name='任务创建时间')),
                ('parameters', models.CharField(help_text='所需参数', max_length=2000, verbose_name='参数')),
            ],
            options={
                'verbose_name': '任务管理',
                'verbose_name_plural': '任务管理',
                'ordering': ['-create_date'],
            },
        ),
    ]
