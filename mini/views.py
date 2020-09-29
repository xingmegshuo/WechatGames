from django.shortcuts import render
from user.models import MyUser, Address
from user.views import get_parameter_dic, get_app_config, logger, Response, APIView
from django.forms import model_to_dict
from games.models import GameInfo
from rest_framework.status import *
from rest_framework import serializers, viewsets
from .models import *
from .serializers import *


# Create your views here.

# 获取用户所有游戏信息
class Games(APIView):
    # to do 缺少游戏信息，游戏红包，金额，累计到用户余额
    """
        @api {GET} /api/games/ 授权信息
        @apiVersion 0.0.1
        @apiDescription 获取授权用户的游戏之间关联
        @apiName 获取授权信息
        @apiGroup 小程序

        @apiParam {String} name 小程序名字
        @apiSuccess {String} status 请求状态
        @apiSuccess {String} mes 提示信息
        @apiSuccess {String} info 该用户在此平台授权的所有游戏数据，包括红包信息等等

    """

    def post(self, request):
        params = get_parameter_dic(request)
        if 'name' in params:
            user = MyUser.objects.get(id=request.user.id)
            if user.unionId is not None:
                users = MyUser.objects.filter(unionId=user.unionId)
                gameInfo = GameInfo.objects.filter(user_id__in=users).exclude(
                    game_id=int(get_app_config(params.get('name')).id))
                logger.info('返回授权用户的所有信息')
                status = 1
                mes = '该用户所有游戏信息'
                info = [{**(model_to_dict(info, fields=['level', 'grade', 'score', 'property', 'ortherInfo'])),
                         **(model_to_dict(info.game_id, fields=['id', ]))}
                        for info in gameInfo]
            else:
                status = 0
                mes = 'no mes'
                info = None
        else:
            status = 0
            mes = '缺少必须参数'
            info = None
        return Response({'status': status, 'mes': mes, 'info': info}, status=HTTP_200_OK)


class ActivityViewSet(viewsets.ModelViewSet):
    """
        @api {GET} /data/activity/ 活动信息
        @apiVersion 0.0.1
        @apiDescription 可通过加id来获取单个活动
        @apiName 获取全部活动
        @apiGroup 小程序
    """
    queryset = Activity.objects.filter(is_show=False)
    serializer_class = ActivitySerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
        @api {GET} /data/activity/ 商品信息
        @apiVersion 0.0.1
        @apiDescription 可通过加id来获取单个商品
        @apiName 获取全部商品
        @apiGroup 小程序
    """
    queryset = ProductInfo.objects.filter(is_show=False).order_by('id')
    serializer_class = ProductSerializer


class ProductApi(APIView):
    """
        @api {GET} /api/productImg/ 商品图片信息
        @apiVersion 0.0.1
        @apiDescription 获取该商品图片信息
        @apiName 获取商品图片
        @apiGroup 小程序
        @apiHeader {string} Authorization jwt验证秘钥必须添加此内容请求

        @apiParam {String} productId 商品id

        @apiSuccess {String} status 请求状态
        @apiSuccess {String} mes 提示信息
        @apiSuccess {String} info 该商品的所有图片属性等级不为0的信息

    """

    def get(self, request):
        params = get_parameter_dic(request)
        try:
            product = ProductInfo.objects.get(id=params.get('productId'))
            img = ProductImg.objects.filter(product=product, is_show=False).exclude(property=0)
            status = 1
            mes = '返回商品所有图片信息'
            Img = [model_to_dict(i, fields=['img', 'property']) for i in img]
        except:
            status = 0
            mes = 'error， 查看参数传递'
            Img = None
        return Response({'status': status, 'mes': mes, 'info': Img}, status=HTTP_200_OK)


class CatApi(APIView):
    def get(self, request):
        """
            @api {GET} /api/cat/ 获取购物车
            @apiVersion 0.0.1
            @apiDescription 获取用户添加购物车内容
            @apiName 获取购物车
            @apiGroup 小程序
            @apiHeader {string} Authorization jwt验证秘钥必须添加此内容请求

            @apiSuccess {String} status 请求状态
            @apiSuccess {String} mes 提示信息
            @apiSuccess {String} info 购物车中的商品信息

        """
        user = MyUser.objects.get(id=request.user.id)
        cats = ShoppingCat.objects.filter(unionId=user.unionId, is_show=False)
        status = 1
        mes = '购物车信息' if len(cats) > 0 else '购物车暂无信息'
        info = [model_to_dict(i, fields=['id', 'product', 'num', 'create_time', 'status']) for i in cats]
        return Response({'status': status, 'mes': mes, 'info': info}, status=HTTP_200_OK)

    def post(self, request):
        """
            @api {POST} /api/cat/ 添加购物车
            @apiVersion 0.0.1
            @apiDescription 用户添加购物车
            @apiName 添加购物车
            @apiGroup 小程序
            @apiHeader {string} Authorization jwt验证秘钥必须添加此内容请求

            @apiParam {String} productId 商品id
            @apiParam {String} num 商品数量
            @apiSuccess {String} status 请求状态
            @apiSuccess {String} mes 提示信息
        """
        params = get_parameter_dic(request)
        user = MyUser.objects.get(id=request.user.id)
        try:
            cat = ShoppingCat.objects.create(unionId=user.unionId, product_id=params.get('productId'),
                                             num=int(params.get('num')))
            cat.save()
            status = 1
            mes = '添加购物车成功'
        except:
            status = 0
            mes = '添加购物车失败'
        return Response({'status': status, 'mes': mes}, status=HTTP_200_OK)


class OrderApi(APIView):
    def get(self, request):
        """
            @api {POST} /api/order/ 获取订单
            @apiVersion 0.0.1
            @apiDescription 获取全部订单
            @apiName 获取订单信息
            @apiGroup 小程序
            @apiHeader {string} Authorization jwt验证秘钥必须添加此内容请求


            @apiSuccess {String} status 请求状态
            @apiSuccess {String} mes 提示信息
            @apiSuccess {String} info 订单详情

        """
        user = MyUser.objects.get(id=request.user.id)
        orders = Order.objects.filter(unionId=user.unionId, is_show=False)
        status = 1
        mes = '该用户所有订单，购买记录' if len(orders) > 0 else '该用户还没有订单'
        info = [model_to_dict(order) for order in orders]
        return Response({'status': status, 'mes': mes, 'info': info}, status=HTTP_200_OK)

    def post(self, request):
        """
            @api {POST} /api/order/ 创建订单
            @apiVersion 0.0.1
            @apiDescription 购物车创建订单
            @apiName 创建订单
            @apiGroup 小程序
            @apiHeader {string} Authorization jwt验证秘钥必须添加此内容请求

            @apiParam {String} catId 购物车内容,逗号分隔id
            @apiParam {String} remark 订单备注

            @apiSuccess {String} status 请求状态
            @apiSuccess {String} mes 提示信息
            @apiSuccess {String} info 订单详情

        """
        params = get_parameter_dic(request)
        user = MyUser.objects.get(id=request.user.id)
        cats = params.get('catId').split(',')
        order = Order.objects.create(unionId=user.unionId, remarks=params.get('remark'),
                                     product=[ShoppingCat.objects.get(id=i) for i in cats])
        order.save()
        status = 1
        mes = '订单创建完成，请付款'
        info = model_to_dict(order)
        return Response({'status': status, 'mes': mes, 'info': info}, status=HTTP_200_OK)

    def put(self, request):
        """
            @api {POST} /api/order/ 修改订单
            @apiVersion 0.0.1
            @apiDescription 修改订单状态
            @apiName 修改订单
            @apiGroup 小程序
            @apiHeader {string} Authorization jwt验证秘钥必须添加此内容请求

            @apiParam {String} orderId 订单选项,开通给用户付款，删除功能
            @apiParam {String} pay 付款状态,0,1
            @apiParam {String} delete 删除状态,0,1

            @apiSuccess {String} status 请求状态
            @apiSuccess {String} mes 提示信息
        """

        params = get_parameter_dic(request)
        order = Order.objects.get(id=params.get('orderId'))
        status = 0
        mes = '没有信息修改'
        if params.get('pay') == '1':
            order.state = True
            status = 1
            mes = '用户付款了'
        if params.get('delete') == '1':
            order.is_show = True
            status = 1
            mes = '用户删除了'

        order.save()
        return Response({'status': status, 'mes': mes}, status=HTTP_200_OK)


class AddressApi(APIView):
    def get(self, request):
        """
            @api {GET} /api/address/ 获取收货地址
            @apiVersion 0.0.1
            @apiDescription 获取用户收货地址
            @apiName 获取收货地址
            @apiGroup 小程序
            @apiHeader {string} Authorization jwt验证秘钥必须添加此内容请求

            @apiSuccess {String} status 请求状态
            @apiSuccess {String} mes 提示信息
            @apiSuccess {String} info 用户的收货地址
        """
        user = MyUser.objects.get(id=request.user.id)
        address = Address.objects.filter(unionId=user.unionId)
        if len(address) > 0:
            status = 1
            mes = '用户收货地址'
            info = [model_to_dict(i) for i in address]
        else:
            status = 0
            mes = '暂无收货地址'
            info = None
        return Response({'status': status, 'mes': mes, 'info': info}, status=HTTP_200_OK)

    def post(self, request):
        """
            @api {GET} /api/address/ 新建收货地址
            @apiVersion 0.0.1
            @apiDescription 用户新建收货地址
            @apiName 新建收货地址
            @apiGroup 小程序
            @apiHeader {string} Authorization jwt验证秘钥必须添加此内容请求

            @apiSuccess {String} status 请求状态
            @apiSuccess {String} mes 提示信息
            @apiSuccess {String} info 用户新建的收货地址
        """
        user = MyUser.objects.get(id=request.user.id)
        params = get_parameter_dic(request)
        address = Address.objects.create(unionId=user.unionId, human=params.get('human'), phone=params.get('phone'),
                                         address=params.get('address'))
        address.save()
        status = 1
        mes = '新建地址成功'
        return Response({'status': status, 'mes': mes}, status=HTTP_200_OK)

    def put(self, request):
        """
            @api {GET} /api/address/ 修改收货地址
            @apiVersion 0.0.1
            @apiDescription 用户修改收货地址
            @apiName 修改收货地址
            @apiGroup 小程序
            @apiHeader {string} Authorization jwt验证秘钥必须添加此内容请求

            @apiSuccess {String} status 请求状态
            @apiSuccess {String} mes 提示信息
            @apiSuccess {String} info 用户修改的收货地址
        """
        user = MyUser.objects.get(id=request.user.id)
        params = get_parameter_dic(request)
        address = Address.objects.get(id=params.get('id')).update(human=params.get('human'), phone=params.get('phone'),
                                                                  address=params.get('address'))
        address.save()
        status = 1
        mes = '地址修改成功'
        return Response({'status': status, 'mes': mes}, status=HTTP_200_OK)
