# Generated by Django 2.1.5 on 2020-09-16 04:19

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0005_auto_20200908_1813'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='create_time',
            field=models.DateTimeField(default=datetime.datetime(2020, 9, 16, 4, 19, 45, 665176, tzinfo=utc), help_text='创建时间', verbose_name='创建时间'),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='login',
            field=models.DateTimeField(default=datetime.datetime(2020, 9, 16, 4, 19, 45, 665211, tzinfo=utc), verbose_name='登录时间'),
        ),
    ]
