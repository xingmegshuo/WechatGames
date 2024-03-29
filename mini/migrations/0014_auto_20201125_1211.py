# Generated by Django 2.1.5 on 2020-11-25 04:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mini', '0013_auto_20201117_1609'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='money',
            field=models.DecimalField(decimal_places=2, help_text='支付金额', max_digits=10, verbose_name='支付金额'),
        ),
        migrations.AlterField(
            model_name='order',
            name='virtualMoney',
            field=models.DecimalField(decimal_places=2, help_text='萌度兑换支付', max_digits=10, verbose_name='萌度支付'),
        ),
        migrations.AlterField(
            model_name='productinfo',
            name='price',
            field=models.DecimalField(decimal_places=2, help_text='商品单价', max_digits=10, verbose_name='单价'),
        ),
        migrations.AlterField(
            model_name='productinfo',
            name='virtual',
            field=models.DecimalField(blank=True, decimal_places=2, help_text='萌度兑换需要的价格', max_digits=10, verbose_name='萌度兑换需要的单价'),
        ),
    ]
