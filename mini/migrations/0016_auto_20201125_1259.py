# Generated by Django 2.1.5 on 2020-11-25 04:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mini', '0015_auto_20201125_1257'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='virtualMoney',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='萌度兑换支付', max_digits=10, null=True, verbose_name='萌度支付'),
        ),
    ]