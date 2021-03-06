# Generated by Django 2.1.5 on 2020-09-08 05:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Voice',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('img', models.FileField(default='mp.png', null=True, upload_to='game', verbose_name='图片')),
                ('name', models.CharField(blank=True, default='demo', help_text='文件名', max_length=50, null=True, unique=True, verbose_name='文件名')),
                ('content', models.CharField(blank=True, help_text='文本内容', max_length=6000, null=True, verbose_name='文本内容')),
                ('human', models.CharField(blank=True, default='xiaoyan', help_text='说话人可选', max_length=20, null=True, verbose_name='说话人')),
                ('url', models.URLField(blank=True, help_text='音频地址', null=True, unique=True, verbose_name='链接')),
            ],
        ),
    ]
