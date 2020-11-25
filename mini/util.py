# 微信支付工具

# 生成随机字符串

def get_nonce_str():
    import uuid
    return str(uuid.uuid4()).replace('-', '')


# 生成微信订单号
def getWxOrdrID():
    import time
    return str(int(time.time()))


# 生成paysign

def paysign(appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, Mch_key):
    ret = {
        "appid": appid,
        "body": body,
        "mch_id": mch_id,
        "nonce_str": nonce_str,
        "notify_url": notify_url,
        "openid": openid,
        "out_trade_no": out_trade_no,
        "spbill_create_ip": spbill_create_ip,
        "total_fee": total_fee,
        "trade_type": 'JSAPI'
    }

    # 处理函数，对参数按照key=value的格式，并按照参数名ASCII字典序排序
    stringA = '&'.join(["{0}={1}".format(k, ret.get(k)) for k in sorted(ret)])
    stringSignTemp = '{0}&key={1}'.format(stringA, Mch_key)
    import hashlib
    sign = hashlib.md5(stringSignTemp.encode("utf-8")).hexdigest()
    return sign.upper()


# 小程序签名
def get_paySign(prepay_id, timeStamp, nonceStr):
    Mch_key = 'mgg12345678910abcdefghijklmnopqr'
    pay_data = {
        'appId': 'wx8b8965c9adb49d33',
        'nonceStr': nonceStr,
        'package': "prepay_id=" + prepay_id,
        'siginType': 'MD5',
        'timeStamp': timeStamp
    }
    stringA = '&'.join(["{0}={1}".format(k, pay_data.get(k)) for k in sorted(pay_data)])
    StringSignTemp = '{0}&key={1}'.format(stringA, Mch_key)
    import hashlib
    sign = hashlib.md5(StringSignTemp.encode('utf-8')).hexdigest()
    return sign.upper()


def get_bodyData(openid, client_ip, price, body, out_trade_no, ):
    # body = 'Mytest'  # 商品描述
    notify_url = 'https://www.menguoli.com/api/payResult/'  # 填写支付成功的回调地址，微信确认支付成功会访问这个接口
    nonce_str = get_nonce_str()  # 随机字符串
    total_fee = str(price)  # 订单价格，单位是 分
    Mch_id = '1602401179'
    appid = 'wx8b8965c9adb49d33'
    Mch_key = 'mgg12345678910abcdefghijklmnopqr'
    # 获取签名
    sign = paysign(appid, body, Mch_id, nonce_str, notify_url, openid, out_trade_no, client_ip, total_fee, Mch_key)

    bodyData = '<xml>'
    bodyData += '<appid>' + appid + '</appid>'  # 小程序ID
    bodyData += '<body>' + body + '</body>'  # 商品描述
    bodyData += '<mch_id>' + Mch_id + '</mch_id>'  # 商户号
    bodyData += '<nonce_str>' + nonce_str + '</nonce_str>'  # 随机字符串
    bodyData += '<notify_url>' + notify_url + '</notify_url>'  # 支付成功的回调地址
    bodyData += '<openid>' + openid + '</openid>'  # 用户标识
    bodyData += '<out_trade_no>' + out_trade_no + '</out_trade_no>'  # 商户订单号
    bodyData += '<spbill_create_ip>' + client_ip + '</spbill_create_ip>'  # 客户端终端IP
    bodyData += '<total_fee>' + total_fee + '</total_fee>'  # 总金额 单位为分
    bodyData += '<trade_type>JSAPI</trade_type>'  # 交易类型 小程序取值如下：JSAPI

    bodyData += '<sign>' + sign + '</sign>'
    bodyData += '</xml>'
    from .views import logger
    logger.info({'生成的数据:'+bodyData})
    return bodyData
