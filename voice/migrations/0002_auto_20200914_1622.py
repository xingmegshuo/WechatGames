# Generated by Django 2.1.5 on 2020-09-14 08:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('voice', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='voice',
            name='url',
            field=models.FileField(help_text='音频地址', null=True, unique=True, upload_to='voice', verbose_name='链接'),
        ),
    ]
