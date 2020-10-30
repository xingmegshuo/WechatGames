/*******************************************
 *
 * 创建说明：页面公用js
 * 主要位置：头部   导航   底部  侧面导航
 *
 *********************************************/

$(function () {
    $(".header .btn").click(function () {
        $("html").toggleClass("open")
    })
    $(".small-nav-header").click(function () {
        $(this).siblings(".small-nav-body").toggle();
    })
});
