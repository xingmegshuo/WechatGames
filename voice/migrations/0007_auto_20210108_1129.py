# Generated by Django 2.1.5 on 2021-01-08 03:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('voice', '0006_auto_20210106_1502'),
    ]

    operations = [
        migrations.AlterField(
            model_name='voice',
            name='name',
            field=models.CharField(blank=True, default='demo', help_text='文件名', max_length=50, null=True, verbose_name='文件名'),
        ),
    ]
