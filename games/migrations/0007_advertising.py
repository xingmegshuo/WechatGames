# Generated by Django 2.1.5 on 2020-12-04 06:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('games', '0006_auto_20201020_1524'),
    ]

    operations = [
        migrations.CreateModel(
            name='Advertising',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='游戏名字', max_length=200, verbose_name='游戏名字')),
                ('logo', models.ImageField(blank=True, help_text='游戏图片144*144大小', null=True, upload_to='game', verbose_name='图片')),
                ('appid', models.CharField(help_text='appid', max_length=200, verbose_name='appid')),
                ('status', models.BooleanField(choices=[(False, '未删除'), (True, '删除')], default=False, help_text='是否删除', verbose_name='是否删除')),
            ],
            options={
                'verbose_name': '游戏广告',
                'verbose_name_plural': '游戏广告',
            },
        ),
    ]
