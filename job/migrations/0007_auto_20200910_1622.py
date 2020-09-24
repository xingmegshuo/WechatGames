# Generated by Django 2.1.5 on 2020-09-10 08:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0006_auto_20200910_1612'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='case_id',
            field=models.CharField(default='0', help_text='任务名', max_length=200, verbose_name='任务队列'),
        ),
        migrations.AlterField(
            model_name='job',
            name='parameters',
            field=models.CharField(default='0', help_text='参数', max_length=500, null=True, verbose_name='参数'),
        ),
    ]
