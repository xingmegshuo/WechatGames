import geoip2.database
from .models import Userip



def deal_ip(request, id):
    if 'HTTP_X_FORWARDED_FOR' in request.META:  # 获取ip
        ip = request.META['HTTP_X_FORWARDED_FOR']
        ip = ip.split(",")[0]  # 所以这里是真实的ip
    else:
        ip = request.META['REMOTE_ADDR']  # 这里获得代理ip
    if ip not in ['127.0.0.1']:
        reader = geoip2.database.Reader('static/GeoLite2-City/GeoLite2-City.mmdb')
        user = Userip.objects.filter(ip=ip)
        if len(user) > 1:
            user = user[0]
            user.count += 1
            if user.name == '未知玩家':
                user.name = id
            user.save()
        else:
            response = reader.city(ip)
            # 有多种语言，我们这里主要输出英文和中文
            user = Userip()
            user.ip = ip
            user.name = id
            user.area = response.continent.names["es"] + '/' + response.continent.names["zh-CN"]
            user.country = response.country.name + '/' + response.country.names[
                "zh-CN"] + '/' + response.country.iso_code
            user.province = response.subdivisions.most_specific.name + '/' + response.subdivisions.most_specific.names[
                "zh-CN"]
            user.city = response.city.name + '/' + response.city.names.get("zh-CN")
            user.LaL = str(response.location.longitude) + '/' + str(response.location.latitude)
            user.Tl = response.location.time_zone
            user.count = 1
            user.save()
