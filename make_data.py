import faker
import os
import django
from django.db.models import *
from django.utils.timezone import utc
import datetime
from Mypro import settings

fake = faker.Faker('zh_CN')


# fake = faker.Faker()
def merge(dict1, dict2):
    res = {**dict1, **dict2}
    return res


def deal_fields(fields):
    if isinstance(fields, CharField):
        if fields.name in ('name', 'nick_name', 'first_name', 'last_name'): return {fields.name: fake.word()}
        if fields.name in ('app_id', 'secret', 'password', 'username', 'openid', 'unionId'): return {fields.name: str(
            fake.random_number(digits=8)) + fake.random_element() + fake.md5()}
        if fields.name in ('property', 'grade', 'score', 'level'): return {fields.name: fake.random_digit()}
        if fields.name == 'language': return {fields.name: fake.language_code()}
        if fields.name == 'city': return {fields.name: fake.city_name()}
        if fields.name == 'province': return {fields.name: fake.province()}
        if fields.name == 'country': return {fields.name: '中国'}
        if fields.name == 'ip': return {fields.name: fake.ipv4()}
        if fields.name == 'area': return {fields.name: '亚洲'}
        if fields.name == 'LaL': return {fields.name: fake.local_latlng(country_code='CN', coords_only=False)}
        if fields.name == 'Tl': return {fields.name: settings.TIME_ZONE}

    if isinstance(fields, BooleanField): return {fields.name: fake.boolean()}
    if isinstance(fields, FileField): return {fields.name: fake.file_name()}
    if isinstance(fields, URLField): return {fields.name: fake.url()}
    if isinstance(fields, SmallIntegerField): return {fields.name: fake.random.choice(['0', '1', '2'])}
    if isinstance(fields, DateTimeField): return {
        fields.name: fake.date_time_between(tzinfo=utc,
                                            start_date=(datetime.datetime.now() + datetime.timedelta(days=-7)).replace(
                                                tzinfo=utc), end_date=datetime.datetime.now().replace(tzinfo=utc))}
    if isinstance(fields, DateField): return {
        fields.name: fake.past_date(tzinfo=utc, start_date='-7d')}
    if isinstance(fields, TextField): return {fields.name: fake.sentences()}
    if isinstance(fields, EmailField): return {fields.name: fake.email()}
    if isinstance(fields, ForeignKey):
        import random
        if fields.name == 'user_id':
            c = random.randint(1, MyUser.objects.count() - 1)
            return {fields.name: MyUser.objects.all()[c]}
        if fields.name == 'game_id': return {fields.name: fake.random.choice(APP.objects.all())}
    if isinstance(fields, IntegerField): return {fields.name: fake.random_digit_not_null()}
    return {fields.name: None}


# @vthread.thread(20)
def make_data(model, num):
    count = 0
    for _ in range(0, num):
        dic = {}
        for field in model._meta.fields:
            dic = merge(dic, deal_fields(field))
        # print(dic)
        model.objects.create(**dic)
        count += 1
        print(count)


if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Mypro.settings')
    django.setup()
    from user.models import APP, MyUser, Userip
    from user.models import App_config
    from games.models import GameInfo

    Userip.objects.all().delete()
    # APP.objects.all().delete()
    # GameInfo.objects.all().delete()
    # # print('app 已清除')
    # MyUser.objects.all().delete()
    # print('clean Data,pass')
    # # make_data(APP, 10)
    # make_data(MyUser, 10000)
    # make_data(GameInfo, 10000)
    make_data(Userip, 10000)
