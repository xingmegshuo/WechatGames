from django.db import models
from django.utils.translation import gettext_lazy as _
from user.models import DELETE_CHOICE

from django.db.models import signals
from django.dispatch import receiver

PRODUCT_CHOICE = ((0, '支持萌度/微信/余额支付'), (1, '不支持萌度支付'), (2, '仅支持微信/支付宝/银行卡支付'))
DISCOUNT_CHOICE = ((False, '不打折'), (True, '打折'))
STAATUS_CHOICE = ((False, '订单正常'), (True, '订单失效'))
OVER_CHOICE = ((False, '订单未完成'), (True, '订单完成'))
SEND_CHOICE = ((False, '订单未发货'), (True, '订单已发货'))
VIRTU_CHOICE = ((False, '不支持萌度'), (True, '支持萌度'))


# Create your models here.
class Activity(models.Model):
    # 在可视化后台添加活动增加到api doc
    title = models.CharField(max_length=500, verbose_name=_('活动标题'), help_text=_('活动标题'), null=True)
    description = models.CharField(verbose_name=_('简要介绍'), help_text=_('简要介绍'), max_length=1000, null=True)
    content = models.TextField(verbose_name=_('活动内容'), help_text=_('活动内容'), null=True)
    img = models.ImageField(verbose_name=_('活动图片'), help_text=_('活动图片'), upload_to='active', null=True)
    date = models.DateField(verbose_name=_('发布时间'), help_text=_('发布时间'), auto_now_add=True, null=True)
    begin = models.DateField(verbose_name=_('活动开始时间'), help_text=_('活动开始时间'), null=True)
    over = models.DateField(verbose_name=_('活动结束时间'), help_text=_('活动结束时间'), null=True)
    is_show = models.BooleanField(verbose_name=_('是否上架'), help_text=_('是否展示在小程序'), default=False, choices=DELETE_CHOICE)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ('-date',)
        verbose_name = _('活动信息')
        verbose_name_plural = verbose_name


# 商品
class ProductInfo(models.Model):
    name = models.CharField(max_length=400, verbose_name=_('商品名称'), help_text=_('商品名称'))
    price = models.FloatField(verbose_name=_('单价'), help_text=_('商品单价'))
    virtual = models.FloatField(verbose_name=_('萌度兑换需要的单价'), help_text=_('萌度兑换需要的价格'), blank=True)
    quantity = models.IntegerField(verbose_name=_('数量'), help_text=_('商品总数'))
    sail = models.IntegerField(verbose_name=_('卖出数量'), help_text=_('卖出数量'), default=0)
    property = models.IntegerField(verbose_name=_('商品属性'), help_text=_('商品属性等级, 支持支付方式,萌度,现金,余额'), default=0,
                                   choices=PRODUCT_CHOICE)
    date = models.DateTimeField(verbose_name=_('创建时间'), help_text=_('创建时间'), auto_now_add=True)
    is_show = models.BooleanField(verbose_name=_('是否上架'), help_text=_('是否展示在商城'), default=False, choices=DELETE_CHOICE)
    discount = models.FloatField(verbose_name=_('折扣'), help_text=_('打几折'), default=1.0)
    is_discount = models.BooleanField(verbose_name=_('是否打折'), help_text=_('是否打折'), default=False,
                                      choices=DISCOUNT_CHOICE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('商品信息')
        verbose_name_plural = verbose_name


# 商品展示图
class ProductImg(models.Model):
    img = models.ImageField(verbose_name=_('商品展示图'), help_text=_('商品图片'), upload_to='product', null=True)
    product = models.ForeignKey(ProductInfo, on_delete=models.CASCADE, verbose_name=_('商品'), help_text=_('商品'),
                                related_name='productImg')
    property = models.IntegerField(verbose_name=_('属性等级'), help_text=_('属性等级'), default=0)
    is_show = models.BooleanField(verbose_name=_('是否上架'), help_text=_('是否展示在商城'), default=False, choices=DELETE_CHOICE)

    def __str__(self):
        return self.product.name + str(self.property)

    class Meta:
        verbose_name = _('商品图片')
        verbose_name_plural = verbose_name


class ShoppingCat(models.Model):
    unionId = models.CharField(max_length=100, verbose_name=_('用户'), help_text=_('用户'))
    product = models.ForeignKey(ProductInfo, on_delete=models.CASCADE, verbose_name=_('商品'), help_text=_('商品'),
                                related_name='catProduct')
    num = models.IntegerField(verbose_name=_('数量'), help_text=_('数量'))
    create_time = models.DateTimeField(verbose_name=_('添加时间'), help_text=_('添加时间'), auto_now_add=True)
    is_show = models.BooleanField(verbose_name=_('是否删除'), help_text=_('是否删除'), default=False, choices=DELETE_CHOICE)
    status = models.BooleanField(verbose_name=_('状态'), help_text=_('商品数量是否满足'), default=True)

    def save(self, *args, **kwargs):
        if self.product.quantity < self.num:
            self.status = False
        super().save(*args, **kwargs)

    def __str__(self):
        return self.unionId + '_' + str(self.id)

    class Meta:
        ordering = ('-create_time',)
        verbose_name = _('购物车')
        verbose_name_plural = verbose_name


class Order(models.Model):
    number = models.CharField(max_length=200, verbose_name=_('订单号'), help_text=_('订单号'))
    unionId = models.CharField(max_length=200, verbose_name=_('用户标识'), help_text=_('用户标识'))
    remarks = models.CharField(max_length=500, verbose_name=_('订单备注'), help_text=_('订单备注'), blank=True)
    status = models.BooleanField(verbose_name=_('订单状态'), help_text=_('订单状态，付款还是未付款'), default=False)
    is_fail = models.BooleanField(verbose_name=_('订单是否失效'), help_text=_('超过时间未付款,或者其他状态订单失效'), default=False,
                                  choices=STAATUS_CHOICE)
    is_send = models.BooleanField(verbose_name=_('是否发货'), help_text=_('是否发货'), default=False, choices=SEND_CHOICE)
    is_over = models.BooleanField(verbose_name=_('此订单是否完成'), help_text=_('此订单是否完成'), default=False, choices=OVER_CHOICE)
    is_show = models.BooleanField(verbose_name=_('是否删除'), help_text=_('用户删除不做物理删除,是否向用户展示'), default=False,
                                  choices=DELETE_CHOICE)
    product = models.ManyToManyField(ShoppingCat, verbose_name=_('购物车'), help_text=_('购物车'))
    money = models.FloatField(verbose_name=_('支付金额'), help_text=_('支付金额'))
    virtualMoney = models.FloatField(verbose_name=_('萌度支付'), help_text=_('萌度兑换支付'))
    is_virtual = models.BooleanField(verbose_name=_('是否支持萌度兑换'), help_text=_('是否支持萌度兑换'), default=True,
                                     choices=VIRTU_CHOICE)
    date = models.DateTimeField(verbose_name=_('订单创建时间'), help_text=_('订单创建时间'), auto_now_add=True)

    def on_save(self):
        self.number = self.unionId + str(self.id)

    def __str__(self):
        return self.number + self.unionId

    def save(self, *args, **kwargs):
        self.on_save()
        super().save(*args, **kwargs)

    class Meta:
        ordering = ('-date',)
        verbose_name = _('订单管理')
        verbose_name_plural = verbose_name


@receiver(signals.post_save, sender=Order)
def model_post_save(sender, created, instance, *args, **kwargs):
    if created:
        if len(instance.product.all()) > 0:
            money = []

            virtual_money = []
            for i in instance.product:
                if i.product.is_discount is True:
                    money.append(i.product.price * i.num * i.product.discount)
                    if i.property == 0:
                        virtual_money.append(i.product.virtual * i.num * i.product.discount)
                else:
                    money.append(i.product.price * i.num)
                    if i.product.product.property == 0:
                        virtual_money.append(i.product.virtual * i.num)
                if i.product.property != 0:
                    instance.is_virtual = False
            instance.money = sum(money)
            instance.virtualMoney = sum(virtual_money)
            instance.save()
