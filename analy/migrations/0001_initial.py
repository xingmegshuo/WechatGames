# Generated by Django 2.1.5 on 2020-09-14 07:11

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Analysis',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creat_date', models.DateField(auto_now_add=True, help_text='分析日期', verbose_name='分析日期')),
                ('title', models.CharField(help_text='名字', max_length=200, verbose_name='名字')),
                ('table_type', models.CharField(choices=[('0', '每日分析'), ('1', '每周分析'), ('2', '月度分析')], default='0', help_text='类型', max_length=200, verbose_name='类型')),
                ('url', models.URLField(help_text='可视化结果地址', verbose_name='分析结果可视化')),
            ],
        ),
    ]
