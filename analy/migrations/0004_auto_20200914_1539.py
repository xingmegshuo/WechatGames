# Generated by Django 2.1.5 on 2020-09-14 07:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analy', '0003_auto_20200914_1536'),
    ]

    operations = [
        migrations.AlterField(
            model_name='analysis',
            name='url',
            field=models.FileField(help_text='分析结果', upload_to='analy', verbose_name='地址'),
        ),
    ]