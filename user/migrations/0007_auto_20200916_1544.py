# Generated by Django 2.1.5 on 2020-09-16 07:44

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_auto_20200916_1219'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='create_time',
            field=models.DateTimeField(default=django.utils.timezone.now, help_text='创建时间', verbose_name='创建时间'),
        ),
        migrations.AlterField(
            model_name='myuser',
            name='login',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='登录时间'),
        ),
    ]