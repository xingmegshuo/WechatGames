# Generated by Django 2.1.5 on 2020-09-08 17:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='is_auth',
            field=models.BooleanField(choices=[('0', '未授权'), ('1', '授权')], default=False, help_text='是否被授权', verbose_name='是否被授权'),
        ),
    ]
