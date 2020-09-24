# Generated by Django 2.1.5 on 2020-09-08 17:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_auto_20200908_1721'),
    ]

    operations = [
        migrations.AlterField(
            model_name='app_config',
            name='on_line',
            field=models.CharField(choices=[('0', '不启用'), ('1', '启用')], default='0', max_length=20, verbose_name='是否启动'),
        ),
    ]
