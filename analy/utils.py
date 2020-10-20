from pyecharts import options as opts
from pyecharts.charts import Bar, Tab, Pie, Geo, Grid, Line
from pyecharts.faker import Faker
from pyecharts.globals import ThemeType
from user.models import APP, App_config, Userip
from games.models import GameInfo
import datetime
from django.utils.timezone import utc


def filter_data():
    pass


def parse_user_today():
    """
    :return games , peoples , keep_peoples, reg_peoples, all_peoples, user of every game , active people, keep people, register eople
    """

    games = [App_config.objects.get(app_id=app, on_line='1', name='name').value if len(
        App_config.objects.filter(app_id=app, on_line='1', name__exact='name')) > 0
             else app.name for app in APP.objects.all()]
    now = datetime.datetime.now(tz=utc)
    zeroToday = now - datetime.timedelta(hours=now.hour, minutes=now.minute, seconds=now.second,
                                         microseconds=now.microsecond)
    yesterday = (zeroToday + datetime.timedelta(days=-1)).replace(tzinfo=utc)
    lastToday = (zeroToday - datetime.timedelta(seconds=1)).replace(tzinfo=utc)
    all_peoples = [GameInfo.objects.filter(game_id=app.id,
                                           ).count() for app in APP.objects.all()]

    peoples = [GameInfo.objects.filter(game_id=app.id,
                                       user_id__login__gte=zeroToday
                                       ).count() for app in
               APP.objects.all()]
    reg_peoples = [GameInfo.objects.filter(game_id=app.id,
                                           user_id__create_time__gte=zeroToday
                                           ).count() for app in
                   APP.objects.all()]
    keep_peoples = [
        GameInfo.objects.filter(game_id=app.id,
                                user_id__login__gte=zeroToday,
                                user_id__create_time__gt=str(yesterday),
                                user_id__create_time__lte=str(lastToday)
                                ).count() for app in
        APP.objects.all()]
    return games, peoples, keep_peoples, reg_peoples, all_peoples


def parse_day(days):
    """
    :param days list date
    :return sort to utc all days
    """
    now = datetime.datetime.now(tz=utc)
    zeroToday = now - datetime.timedelta(hours=now.hour, minutes=now.minute, seconds=now.second,
                                         microseconds=now.microsecond)
    all_days = [(zeroToday + datetime.timedelta(days=-i)).replace(tzinfo=utc) for i in range(1, days + 1)]
    all_days.sort()
    return all_days


def parse_app(day, app):
    """
    :param day the date , app the game
    :return active user
    """
    today_end = (day + datetime.timedelta(days=1)).replace(tzinfo=utc)
    active_user = GameInfo.objects.filter(user_id__login__gte=day, user_id__login__lt=today_end).count()
    return active_user


def get_long(day):
    """
    :param： day the date
    :return： active user, join user
    """
    today_end = (day + datetime.timedelta(days=1)).replace(tzinfo=utc)
    active_user = GameInfo.objects.filter(user_id__login__gte=day, user_id__login__lt=today_end).count()
    join_user = GameInfo.objects.filter(user_id__create_time__gte=day, user_id__create_time__lt=today_end).count()
    return active_user, join_user


def parse_local():
    """
    :return: the local of data
    """
    geo = Geo()
    geo_province = list(geo._coordinates.keys())
    values = [[i, Userip.objects.filter(province__contains=i).count()] for i in geo_province if Userip.objects.filter(
        province__contains=i).count() > 0]
    return values


# 商品售卖分析
def product_sail(title):
    c = (
        Bar(init_opts=opts.InitOpts(theme=ThemeType.CHALK))
            .add_xaxis(Faker.days_attrs)
            .add_yaxis("商品A", Faker.days_values)
            .add_yaxis("商品B", Faker.days_values)
            .add_yaxis("商品C", Faker.days_values)
            .add_yaxis("商品D", Faker.days_values)
            .set_global_opts(
            title_opts=opts.TitleOpts(title=title),
            datazoom_opts=[opts.DataZoomOpts()],
        )
    )
    return c


# 游戏日活跃用户分析
def user_today(title):
    # games = [app.app_config.value if app.app_config.name == 'name' else app.name for app in APP.objects.all()]
    games, actives, keep_peoples, reg_peoples, all_peoples = parse_user_today()
    c = (
        Bar(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="1400px", height='1000px'))
            .add_xaxis(games)
            .add_yaxis('总注册人数', all_peoples)
            .add_yaxis('今日注册人数', reg_peoples)
            .add_yaxis('游戏活跃人数', actives)
            .add_yaxis('留存人数', keep_peoples)
            .set_global_opts(
            title_opts=opts.TitleOpts(title=title),
        )
    )
    print(datetime.datetime.now())
    return c


# 用户地理分布
def user_local(title):
    data = parse_local()
    c = (
        Geo(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="1400px", height='1000px'))
            .add_schema(maptype="china")
            .add("用户地理分布", data)
            .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
            .set_global_opts(
            visualmap_opts=opts.VisualMapOpts(max_=max([i[1] for i in data])), title_opts=opts.TitleOpts(title=title),
        )
    )
    return c


# 每周统计
def weak_user(title):
    all_day = parse_day(7)
    x_data = [str(i.day)+'日' for i in all_day]
    y_data = [get_long(i) for i in all_day]
    bar = (
        Bar(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="1400px", height='1000px'))
            .add_xaxis(x_data)
            .add_yaxis(
            "增长用户",
            [i[1] for i in y_data],
            yaxis_index=0,
            color="#d14a61",
        )
            .extend_axis(
            yaxis=opts.AxisOpts(
                type_="value",
                name="活跃用户",
                min_=0,
                max_=max([i[0] for i in y_data]),
                position="left",
                axisline_opts=opts.AxisLineOpts(
                    linestyle_opts=opts.LineStyleOpts(color="#675bba")
                ),
                axislabel_opts=opts.LabelOpts(formatter="{value} 人"),
                splitline_opts=opts.SplitLineOpts(
                    is_show=True, linestyle_opts=opts.LineStyleOpts(opacity=1)
                ),
            )
        )
            .set_global_opts(
            yaxis_opts=opts.AxisOpts(
                name="增长用户",
                type_="value",
                min_=0,
                max_=max([i[1] for i in y_data]),
                position="right",
                offset=80,
                axisline_opts=opts.AxisLineOpts(
                    linestyle_opts=opts.LineStyleOpts(color="#5793f3")
                ),
                axislabel_opts=opts.LabelOpts(formatter="{value} 人"),
            ),

            title_opts=opts.TitleOpts(title=title),
            tooltip_opts=opts.TooltipOpts(trigger="axis", axis_pointer_type="cross"),
        )
    )
    line = (
        Line(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="1400px", height='1000px'))
            .add_xaxis(x_data)
            .add_yaxis(
            "活跃用户",
            [i[0] for i in y_data],
            yaxis_index=1,
            color="#675bba",
            label_opts=opts.LabelOpts(is_show=False),
        )
    )
    bar.overlap(line)
    grid = Grid(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="1400px", height='1000px'))
    grid.add(bar, opts.GridOpts(), is_control_axis_index=True)
    return grid


def weak_app(title):
    all_day = parse_day(7)
    x_data = [str(i.day)+'日' for i in all_day]
    apps = APP.objects.all()
    c = Line(init_opts=opts.InitOpts(theme=ThemeType.DARK, width="1400px", height='1000px'))
    c.add_xaxis(x_data)
    for app in apps:
        name = App_config.objects.get(app_id=app, on_line='1', name='name').value if len(App_config.objects.filter(app_id=app, on_line='1', name__exact='name')) > 0 else app.name
        c.add_yaxis(
            series_name=name,
            stack='总量',
            y_axis=[parse_app(i, app) for i in all_day],
            label_opts=opts.LabelOpts(is_show=False),
        )
    c.set_global_opts(
            title_opts=opts.TitleOpts(title=title),
    )
    return c


def moth(title):
    pass