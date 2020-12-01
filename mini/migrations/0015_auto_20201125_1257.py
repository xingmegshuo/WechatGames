# Generated by Django 2.1.5 on 2020-11-25 04:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mini', '0014_auto_20201125_1211'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='money',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='支付金额', max_digits=10, null=True, verbose_name='支付金额'),
        ),
    ]