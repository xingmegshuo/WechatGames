# Generated by Django 2.1.5 on 2020-09-30 03:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mini', '0008_auto_20200924_1531'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shoppingcat',
            name='unionId',
            field=models.CharField(help_text='用户', max_length=100, verbose_name='用户'),
        ),
    ]
