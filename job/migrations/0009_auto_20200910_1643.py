# Generated by Django 2.1.5 on 2020-09-10 08:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('job', '0008_auto_20200910_1624'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='id',
            field=models.AutoField(help_text='不需要操作', primary_key=True, serialize=False, verbose_name='主键'),
        ),
    ]