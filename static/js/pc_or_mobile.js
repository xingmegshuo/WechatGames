/**
 * Created by zhouxin on 2019-09-20
 **/
'use strict';

function browserRedirect(pc_or_mobile) {

    var sUserAgent = navigator.userAgent.toLowerCase();


    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";

    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";

    var bIsMidp = sUserAgent.match(/midp/i) == "midp";

    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";

    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";

    var bIsAndroid = sUserAgent.match(/android/i) == "android";

    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";

    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";


    if (pc_or_mobile === 'pc') {
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            // window.location.href = window.location.origin + '/m';
            console.log('手机站链接')
                // alert('手机站链接')

        } else {
            // window.location.href= window.location.origin;
            console.log('PC站链接')

        }
    } else if (pc_or_mobile === 'mobile') {
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            // window.location.href = window.location.origin + '/m';
            // console.log('手机站链接')
            // alert('手机站链接')

        } else {
            // window.location.href = window.location.origin;
            console.log('PC站链接')

        }
    }


};