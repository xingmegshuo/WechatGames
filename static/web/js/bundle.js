(function () {
   'use strict';

   var GameFIG_this; //当前this
   var BUTdownTF = false; //全局按钮变量，防止多按钮同时触发/同个按钮多次触发！
   var wx = Laya.Browser.window.wx; //微信api
   var ShouQuanFirst = false; //是否第一次授权
   window.RunListOpen = [];
   //------------------------------------------------**--------以上参数请勿修改----**------------------------------------

   /**游戏参数防止加载其他同类数据导致错误*********************************************************************************************/
   var GameConfig = {
       banbenID: "1.0.3",
       GameName: "旋转出击",//不同游戏游戏名请勿重复---------
       InitFBL: { width: 1334, height: 750 },//屏幕分辨率标准
   };
   var gameNameName = "xzcj";
   //-------------------------------------------------**--------以下参数请修改----------**------------------------------
   var GameGGConfig = { //微信QQ广告设置
       appid: "wxf3fb0175cdb16437", //当前小游戏appid
       TPid: [ //图片bannerID 无 请设置[]

       ],
       SPid: null, //激励视频ID 无请设置null
       shareBFB: 95, //3秒分享成功率百分比
       nowtp: 0, //当前图片广告*******************请勿修改
       readtf: false, //广告是否加载成功*************请勿修改
       TVorShare: true, //true是视频****************请勿修改
       sharetime: null, //分享时间****************请勿修改
       shareNow: false, //当前是否正在分享****************请勿修改
       banner: null, //广告组件****************请勿修改
       redio: null, //视频组件****************请勿修改
   };
   window.serverUrlPre = "https://nwkdp.youdongxi.cn/v1.1/api"; //服务器地址
   window.boxInfo; //广告盒子
   window.serverBox = "https://ad.geyian.ink"; //导量盒子
   window.serverBUY = "https://tj.geyian.ink"; //导量记录
   //---导航页---添加新功能务必从尾部添加  否则导致导航顺序错乱-----

   //GetRandName 获取随机名字
   //SaveMsgToJson 导出数据到本地   
   //saveLocalData 保存数据到本地   
   //fetchLocalData 获取本地数据    
   //removeLocalData 清除本地所有数据 
   //getfangxiang  通过两物体获取方向  

   //------摇杆区----
   //InitYaoGan 初始化摇杆  
   //OpenYaoGan 打开摇杆 
   //CloseYaoGan 关闭摇杆  
   //player_move_Down 玩家手指按下
   //player_move_Move 玩家手指移动
   //player_move_out 玩家手指离开
   //player_move_up 玩家手指抬起
   //DengbiZhuan 数值等比转换
   //GetMaxXXYY 获取最大数值
   //----------------


   //----自定义按钮区----
   //butTween 自定义按钮（可自我缩放）
   //TweenScalSim 缩小动画
   //TweenScalBig 放大动画
   //-------------------
   //---微信区---
   var TFyun = false; // 微信云开发流程(true)  服务器流程(false)
   //此流程暂只支持 “合作方：游动西+萌果”
   var YunHanShu = { //云函数 服务器流程请忽略
       env: "", //这里填写云环境id
       login: "", //获取真实ID的云函数名称
       GetInitPlayer: "", //获取用户注册信息
       updatePlayer: "", //更新玩家至云端
       getjson: "", //获取云json
   };
   //Login 一键登录 自动调用wxLogin--getcode--getplayer
   //compareVersion 版本对比
   //WXLogin 微信登录
   //getcode 获取真实ID
   //getplayer 服务器获取用户信息
   //UpdatePlayerMsg 用户信息保存至服务器和本地
   //GetUserInfo 微信获取用户信息  未授权会主动调用授权按钮
   //ShouQuan 授权按钮

   //---云开发
   //initwxCloud **初始化云开发**
   //GetWXYjson 获取云json
   //TFYaoQinPeople 是否是邀请人员
   //GetCloudFileURL 获取云路径

   //----------------------------------自定义方法
   //InitTongZhi 初始化自定义通知
   //Tongzhi 通知方法---
   //addScrollText 添加Lable文字滚动
   //startScrollText Lable文字开始滚动
   //finishScrollText 结束文字滚动
   //scrollText 鼠标滚动文字
   //--------------------------------------------

   //-----------------------------------------
   //Randshuzhu 随机打乱数组
   //GetRandNub 获取随机函数
   // ----音乐管理---
   //this.Open 控制音效震动开关  请优先设置 this.MusicJson
   //PlayMusic 播放音乐
   //PlaySound 播放音效
   //wxZD   微信震动
   //----------------

   //InitViewToView 初始化页面跳转
   //ViewToView 页面跳转

   //TiShiKuang 微信自带提示框
   //JiaoHukuang 微信自带交互框

   //----------------------------------------------------------------广告区 1.0 合并版本------------------------------------------------------------
   //----------------------banner 激励视频  导出盒子 分享接口
   //Main_Use 广告主逻辑  *** 请务必在主脚本第一时间调用    自动运行初始化广告的所有步骤
   //----
   //initGG 初始化广告 *请勿调用
   //JtGG 设置banner  *请勿调用
   //dtgg 设置激励视频  *请勿调用
   //ShareGet 分享获取  *请勿调用
   //GETshareGift 获取分享物品  *请勿调用
   //WXLog    分享成功失败窗口 *请勿调用  弹窗请调用JiaoHukuang
   //TVLog    视频观影成功 失败弹窗 *请勿调用  弹窗请调用TiShiKuang
   //----

   //changgebanner  隐藏并切换banner----------------------
   //hidebanner  隐藏banner----------------------
   //bannershow  显示banner----------------------
   //GG_all   调用观影广告/分享获取奖励-----
   //FXget    主动拉起分享
   //GetUpdate 获取游戏是否更新 无需调用
   //GetGameInitConfig 初始化游戏转发按钮
   //--------------------------------------导出盒子--------
   window.boxInfo = [ //请按照此法书写
       [{
           appid: "",
           path: "",
           locationid: ""
       },
       {
           appid: "",
           path: "",
           locationid: ""
       },
       ],
       [{
           appid: "",
           path: "",
           locationid: ""
       },
       {
           appid: "",
           path: "",
           locationid: ""
       },
       ]
   ];
   //GoGame 小游戏跳转
   //ListRun 滚动列表 无需调用
   //ListRun2 滚动列表 无需调用
   //SetOnceBOX 设置单个盒子类型
   //SetOpenCloseRunlist 打开关闭滚动列表
   //SetListJS 设置滚动列表
   //updateList 回调 无需调用
   //SetCanLet 读取广告数据
   //GetboxAll 初始化所有广告位
   //boxGetConfig2 获取对应的盒子
   //Setboxall 设置所有的盒子
   //PinJie_Fun 字符拼接 上传数据专用 ---请勿调用
   //boxShangChuan_WX 盒子点击成功上传----游动西
   //boxShangChuan_WX_first 盒子点击上传。----游动西
   //TimeCha 时间差---内部专用 请勿调用
   //BUY_people_StopMsg 玩家停留上传 ----游动西
   //BUY_people_shouQuan 玩家授权上传 ----游动西
   //BUY_people_init 玩家首次进入上传 ----游动西
   //--------------------------------------------------------------------------使用以上功能请务阅读源码根据需求适当修改-----------------------------------------------
   //---------------------------------****************-------------------

   ///-----------------------------微信其他工具-----------------------
   //WxReportMonitor 微信数据上报
   //WxCreatGameQuan 创建微信游戏圈
   class GameFIG {
       /**
        * 游戏工具类
        */
       constructor() { //请务必设置这里面的参数
           this.BoxSetList = {};//提前加载准备渲染列表

           window.P_RunTime_time = new Date(); //游戏开始时间
           this.inst = null; //单例

           //------
           /**玩家数据信息 */
           this.Player = { //其他脚本的player信息请存放至otherMsg
               playerConfig: { //需要上传服务器数据
                   Name: this.GetRandName(),
                   HeadUrl: "UI/head.png",
                   FirstTime: "", //首次注册时间s
                   openid: "", //openid
                   lastTime: null, //上次退出时间
                   Sgin: GameConfig.banbenID, //如需重置修改玩家变量请修改
                   Md: 100,//萌度
                   JB: 1000,//金币
                   FZ: { "0": true },//服装解锁情况
                   Studytype: "学习完毕",//准备学习 学习完毕 正在学习
                   StudyTime: 20000,//学习剩余时间
                   StudyID: "0",//当前学习ID
                   homeDJ: { "0": true, "1": true, "2": true },//房间道具解锁情况
                   isNewPeople: true,//新手引导
                   CanLoveShare: true,//是否能使用爱分享功能
                   curLevel: 0,
                   maxPhysicalStrength: 5,//最大体力
                   gold: 0,
                   physicalStrength: null,
                   curlevelpro: 0,
                   jwt: "",
                   session_key: "",
                   maxCore: 0,//核心已解锁的最高等级
                   grade: 0,//玩家等级
                   gold: 2000,//玩家金币
                   curLevel: 0,//当前关卡
                   EquipMaxId: 0,//已解锁装备的最大等级
                   bag: [0, 0, 0, 0, 0, null, null, null, null, null, null, null],//玩家背包 存放物品id
                   otherInfo: {
                       maxCore: 0,//核心已解锁的最高等级
                       grade: 0,//玩家等级
                       gold: 2000,//玩家金币
                       curLevel: 0,//当前关卡
                       EquipMaxId: 0,//已解锁装备的最大等级
                       bag: [0, 0, 0, 0, 0, null, null, null, null, null, null, null]//玩家背包 存放物品id
                   }

               },
               jwt: "",//萌果 认证密钥
               sessid: "", //sessid
               TFUSE: true, //玩家是否可操作。
               MoveJULIbiaoz: 93, //玩家移动摇杆最大范围半径
               Movespeed: 5, //移动速度
               JumpSpeed: 1.1,//跳跃速度
               MovePOS: {
                   x: 0,
                   y: 0
               }, //当前准备移动参数

           };
           /**腾讯云储存地址*/
           this.GameLoadPath = "";
           this.MoveRot = 0;
           /**云数库对象 */
           this.WXcloud_MSG = null;
           this.Player.playerConfig.openid = (new Date()).getTime() + ""; //暂时测试使用 保证openid的唯一性
           if (TFyun == true) {
               this.initwxCloud();
           }
           this.MusicJson = [{
               name: "主界面背景",
               URL: "anim/Music/BGM.mp3"
           },//0
           {
               name: "失败",
               URL: "anim/Music/fail.mp3"
           },//1
           {
               name: "雷劈",
               URL: "anim/Music/dianji.mp3"
           },//2
           {
               name: "狗叫",
               URL: "anim/Music/dog.mp3"
           },//3
           {
               name: "爆炸",
               URL: "anim/Music/boom.mp3"//
           },//4
           {
               name: "11关的喷雾",
               URL: "anim/Music/pengwu.mp3"
           },//5
           {
               name: "拍照",
               URL: "anim/Music/paizhao.wav"
           },//6
           {
               name: "胜利",
               URL: "anim/Music/vic.mp3"
           },//7
           {
               name: "通用扔东西",
               URL: "anim/Music/rendongxi.wav"
           },//8
           {
               name: "女孩走路",
               URL: "anim/Music/walk.wav"
           },//9
           {
               name: "女孩害怕",
               URL: "anim/Music/haipa.mp3"
           },//10
           {
               name: "通用僵尸吼叫",
               URL: "anim/Music/houjiao.mp3"
           },//11
           {
               name: "关柜门",
               URL: "anim/Music/closedoor.mp3"
           },//12
           {
               name: "16关晕倒",
               URL: "anim/Music/yun.mp3"
           },//13
           {
               name: "鸡叫",
               URL: "anim/Music/jijiao.mp3"
           },//14
           {
               name: "19关蛐蛐叫",
               URL: "anim/Music/ququer.mp3"
           },//15
           {
               name: "吃黄瓜",
               URL: "anim/Music/huanggua.mp3"
           },//16
           {
               name: "用户点击按钮",
               URL: "anim/Music/click.wav"
           },//17
           {
               name: "选择正确",
               URL: "anim/Music/seltrue.wav"
           },//18
           ];
           this.Open = {
               YX: true,
               ZD: true
           }; //声音开关
       }
       /**单例获取 */
       static Get() {
           if (GameFIG_this == undefined) {
               GameFIG_this = new GameFIG();
           }
           return GameFIG_this;
       }
       GetRandName() {

           //----随机取名----
           var nameKu = ["小", "菜", "果", "心", "鬼", "白", "萌", "失", "微", "笑", "然", "云", "非", "宝", "窥", "范", "傻", "大", "龙", "云", "天", "甜", "莎", "阳", "懒", "笨", "生", "憩", "灰", "初", "王", "周", "赵", "毕"];
           nameKu = this.Randshuzhu(nameKu);
           var randLen = this.GetRandNub(1, 3);
           var TestName = "";
           for (var a = 0; a < randLen; a++) {
               TestName += nameKu[this.GetRandNub(0, nameKu.length - 1)];
           }
           return TestName;
       }

       //----------------------------保存数据-------------------
       /**
        * 导出信息至本地——json
        * @param {*} MSG 数据
        *  @param {*} index 导出序号 不同json请填写不同序号否则导致覆盖相同文件
        */
       SaveMsgToJson(MSG, index) {
           //--此方法为具体格式 每一步都不可缺少   保存MSG至本地  
           var elementA = document.createElement('a');
           elementA.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(MSG));
           elementA.setAttribute('download', +index + ".json");
           elementA.style.display = 'none';
           document.body.appendChild(elementA);
           elementA.click();
           document.body.removeChild(elementA);
       }
       /**
        * 本地储存数据
        * @param key 对应的 key 值
        * @param data 对应的数据
        */
       saveLocalData(key, data) {
           Laya.LocalStorage.setItem(key, JSON.stringify(data));
       }

       /**
        * 获取本地数据
        * @param key 对应的 key 值
        */
       fetchLocalData(key) {
           let data = Laya.LocalStorage.getItem(key) ? JSON.parse(Laya.LocalStorage.getItem(key)) : null;
           return data;
       }

       /** 清除本地所有数据*/
       removeLocalData() {
           Laya.LocalStorage.clear();
       }
       //--------------------------------------------------------------------摇杆
       /**
        * 获取物体方向，返回值直接给需要旋转的物体
        * @param {*} start {x:当前物体x,y：当前物体y}
        * @param {*} end  {x:目标物体x，y:目标物体y}
        */
       getfangxiang(start, end) {

           var diff_x = end.x - start.x;
           var diff_y = end.y - start.y;
           if (diff_x == 0 && diff_y == 0) {
               return 0;
           }
           var jd = 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);

           if (diff_x >= 0) {
               return jd;
           } else {
               return 180 + jd;
           }

       }
       /**接口 */
       send_request(url, data, header, method, callback) {
           // url 请求地址 data json发送数据 header jwt秘钥，不携带可以为空 method 请求方式 callback 回调函数
           var url = 'https://www.menguoli.com/' + url + '/';
           console.log(data);
           console.log(header);
           wx.request({
               url: url,
               method: method,
               data: data,
               header: {
                   'Authorization': 'Bearer  ' + header,
               },

               dataType: 'json',
               complete: function (res) {
                   return typeof callback == 'function' && callback(res.data)
               }
           });
       }
       /**
        * 初始化摇杆：注意设置规范(整局只用初始化一次即可，除非后续变更参数)
        * @param {*} TFHide 是否自动隐藏摇杆
        * @param {*} bigCircle 大圆圈 **（必填）**
        * @param {*} smallCircle 小圆圈 **（必填）**
        * @param {*} move_ceng 摇杆移动层(摇杆在什么上面移动 超出则不移动 通常左半屏摇杆 右半屏其他按钮) （可选）
        * @param {*} Fun2 松开摇杆 调用方法 （可选）     
        * @param {*} DownFun 首次按下摇杆 调用方法（可选）
        * @param {*} YaoGanRoat 摇杆指针 （可选）
        * @param 其他关联方法 OpenYaoGan(开启摇杆) CloseYaoGan(关闭摇杆)
        */
       InitYaoGan(TFHide, bigCircle, smallCircle, move_ceng = Laya.stage, Fun2, DownFun, YaoGanRoat) {
           this.TFHide = TFHide;
           this.YaoGanRoat = YaoGanRoat;
           this.bigCircle = bigCircle; //同理
           this.smallCircle = smallCircle; //把小圆圈传递到当前脚本
           this.player_move = move_ceng; //同理
           this.DownFun = DownFun;
           this.HuaGan_Fun2 = Fun2; //传递方法过来（当鼠标抬起过后执行的方法）
           if (this.TFHide) {
               this.bigCircle.visible = false;
               this.smallCircle.visible = false;
           } else {
               this.bigCircle.visible = true;
               this.smallCircle.visible = true;
           }
       }
       /**
        * 开启角色摇杆
        */
       OpenYaoGan() {
           this.Player.TFUSE = true; //当前摇杆可用
           this.player_move.on(Laya.Event.MOUSE_DOWN, this, this.player_move_Down);
           //.on(事件类型，作用域 ，回调方法)    
       }
       /**关闭角色摇杆*/
       CloseYaoGan() {
           this.Player.TFUSE = false;
           this.player_move.off(Laya.Event.MOUSE_DOWN, this, this.player_move_Down);
           this.player_move.off(Laya.Event.MOUSE_MOVE, this, this.player_move_Move);
           this.player_move.off(Laya.Event.MOUSE_OUT, this, this.player_move_out);
           this.player_move.off(Laya.Event.MOUSE_UP, this, this.player_move_up);
           if (this.HuaGan_Fun2) {
               this.HuaGan_Fun2();
           }
           if (this.TFHide) {
               this.bigCircle.visible = false;
               this.smallCircle.visible = false;
           }


       }
       /**
        * 玩家摇杆点击
        */
       player_move_Down() {
           if (this.Player.TFUSE) { //限制滑杆可移动的位置
               if (this.DownFun) {
                   this.DownFun();
               }
               if (this.YaoGanRoat != undefined) {
                   this.YaoGanRoat.rotation = 0;

               }
               if (this.TFHide) {
                   this.bigCircle.pos(Laya.stage.mouseX, Laya.stage.mouseY); //大圆圈的位置等于当前手指位置
                   this.smallCircle.pos(Laya.stage.mouseX, Laya.stage.mouseY); //小圆圈位置等于当前手指位置
                   this.bigCircle.visible = true; //显示大圆图片
                   this.smallCircle.visible = true; //显示小圆图片（visible）是sprite的属性
               } else {
                   this.smallCircle.pos(this.bigCircle.x, this.bigCircle.y); //小圆圈位置等于当前手指位置
               }
               this.player_move.on(Laya.Event.MOUSE_MOVE, this, this.player_move_Move); //当玩家手指移动时候执行的方法
               this.player_move.on(Laya.Event.MOUSE_OUT, this, this.player_move_out); //当玩家手指离开屏幕的时候执行的方法
               this.player_move.on(Laya.Event.MOUSE_UP, this, this.player_move_up); //当玩家抬起手指执行的方法
           }
       }

       player_move_Move() {
           // 鼠标与大圆中心x、y轴的距离
           var rotation = this.getfangxiang(this.bigCircle, {
               x: Laya.stage.mouseX,
               y: Laya.stage.mouseY
           });
           //   console.log("角度:" + rotation);
           this.MoveRot = rotation;
           if (isNaN(rotation)) {
               rotation = 0;
           }

           var xx = Laya.stage.mouseX - this.bigCircle.x; //
           var yy = Laya.stage.mouseY - this.bigCircle.y;

           // 勾股定理求斜边
           var obl = Math.sqrt(Math.pow(xx, 2) + Math.pow(yy, 2));
           var bfb = 0;
           if (obl <= this.Player.MoveJULIbiaoz) { //在最远拉伸范围内
               bfb = obl / this.Player.MoveJULIbiaoz;
               this.smallCircle.pos(Laya.stage.mouseX, Laya.stage.mouseY);
           } else { //在最远拉伸范围外
               var smallCircleX = (this.Player.MoveJULIbiaoz * xx) / obl + this.bigCircle.x;
               var smallCircleY = (this.Player.MoveJULIbiaoz * yy) / obl + this.bigCircle.y;
               this.smallCircle.pos(smallCircleX, smallCircleY);
               bfb = 1;
               var pos = this.GetMaxXXYY(rotation, this.Player.MoveJULIbiaoz);
               xx = pos.x;
               yy = pos.y;
           }
           if (this.YaoGanRoat != undefined) {
               this.YaoGanRoat.rotation = rotation;
           }

           this.Player.MovePOS = this.DengbiZhuan(xx, yy);
           // console.log(this.Player.MovePOS.x);

       }

       player_move_out() {
           if (this.HuaGan_Fun2) {
               this.HuaGan_Fun2();
           }
           if (this.TFHide) {
               this.bigCircle.visible = false;
               this.smallCircle.visible = false;

           } else {
               this.smallCircle.pos(this.bigCircle.x, this.bigCircle.y); //小圆圈位置等于当前手指位置
           }

           this.player_move.off(Laya.Event.MOUSE_MOVE, this, this.player_move_Move);
           this.player_move.off(Laya.Event.MOUSE_OUT, this, this.player_move_out);
           this.player_move.off(Laya.Event.MOUSE_UP, this, this.player_move_up);
       }
       player_move_up() {
           if (this.HuaGan_Fun2) {
               this.HuaGan_Fun2();
           }
           this.player_move.off(Laya.Event.MOUSE_MOVE, this, this.player_move_Move);
           this.player_move.off(Laya.Event.MOUSE_OUT, this, this.player_move_out);
           this.player_move.off(Laya.Event.MOUSE_UP, this, this.player_move_up);
           if (this.TFHide) {
               this.bigCircle.visible = false;
               this.smallCircle.visible = false;
           } else {
               this.smallCircle.pos(this.bigCircle.x, this.bigCircle.y); //小圆圈位置等于当前手指位置
           }

       }
       /**移动距离转换为实际速度 */
       DengbiZhuan(xx, yy) {
           var bfb = this.Player.Movespeed / this.Player.MoveJULIbiaoz; //  速度/每寸可移动距离
           var speed = {
               x: xx * bfb,
               y: yy * bfb
           };
           return speed
       }
       /**
        * 获取最大方向值
        * @param {*} rotation 旋转角度
        * @param {*} length 长度
        * @param {*} return ---返回一个向量
        */
       GetMaxXXYY(rotation, length) { //sin(弧度)**
           //弧度=角度×π÷180°
           var hudu = 0;
           var xx = 0;
           var yy = 0;
           if (rotation == 0) {
               xx = length;
           } else if (rotation == -90 || rotation == 270) {
               yy = length * -1;
           } else if (rotation == 180) {
               xx = length * -1;
           } else if (rotation == 90) {
               yy = length;
           } else if (rotation < 0) { //第一象限内
               hudu = (rotation * -1) * Math.PI / 180;
               yy = Math.sin(hudu) * length * -1;
               xx = Math.cos(hudu) * length;
           } else if (rotation > 180 && rotation < 270) { //第二象限
               hudu = (90 - (270 - rotation)) * Math.PI / 180;
               yy = Math.sin(hudu) * length * -1;
               xx = Math.cos(hudu) * length * -1;
           } else if (rotation > 90 && rotation < 180) { //第三象限
               hudu = (90 - (180 - rotation)) * Math.PI / 180;
               xx = Math.sin(hudu) * length * -1;
               yy = Math.cos(hudu) * length;
           } else if (rotation > 0 && rotation < 90) { //第四象限
               hudu = (90 - rotation) * Math.PI / 180;
               xx = Math.sin(hudu) * length;
               yy = Math.cos(hudu) * length;
           }
           return {
               x: xx,
               y: yy
           };
       }
       //------------------------------------------------

       /**
        * 按钮动画汇总
        * @param {*} but  按钮
        * @param {*} FunHander  Laya.hander回调
        * @param {*} TFListRun  是否是滚动list 无请空缺 后面不填
        */
       butTween(but, FunHander = new Laya.Handler(), TFListRun = false) {
           but.offAll(); //清除当前所有事件 防止重复
           but.on(Laya.Event.MOUSE_DOWN, this, function () {
               this.TweenScalSim(but);
               BUTdownTF = true;
           }.bind(this));
           but.on(Laya.Event.MOUSE_UP, this, function () {
               this.TweenScalBig(but, FunHander);
               if (TFListRun == true) {
                   this.ListRun(but.listID);
               }
               BUTdownTF = false;

           }.bind(this));
           but.on(Laya.Event.MOUSE_OUT, this, function () {
               this.TweenScalBig(but, undefined);
               BUTdownTF = false;
               if (TFListRun == true) {
                   this.ListRun(but.listID);
               }
           }.bind(this));

       }
       /**
        * 
        * @param {*} but 传入按钮
        */
       TweenScalSim(but) {
           Laya.Tween.to(but, {
               scaleX: 0.8,
               scaleY: 0.8
           }, 100, Laya.Ease.linearOut);
       }
       /**
        * 
        * @param {*} but 传入按钮
        * @param {*} Hander 传入回调方法Laya.hander
        */
       TweenScalBig(but, Hander) {
           Laya.Tween.to(but, {
               scaleX: 1,
               scaleY: 1
           }, 100, Laya.Ease.linearOut);
           if (Hander != undefined) {
               Hander.run();
           }
       }
       //---------------------------------------

       /**
        * 微信登录---获取真实code----获取用户注册信息---获取用户信息
        * @param {*} Fun Laya.Handler成功回调方法
        */
       Login(Fun) {
           GameFIG_this.LoadSuccess_Fun = Fun;
           if (wx) { //登录微信
               this.WXLogin();
           } else {
               console.log("当前不在微信环境下无法登录");

           }
       }
       /**版本对比 */
       compareVersion(v2) {
           var v1 = wx.getSystemInfoSync().SDKVersion;
           v1 = v1.split('.');
           v2 = v2.split('.');
           var len = Math.max(v1.length, v2.length);

           while (v1.length < len) {
               v1.push('0');
           }
           while (v2.length < len) {
               v2.push('0');
           }

           for (let i = 0; i < len; i++) {
               const num1 = parseInt(v1[i]);
               const num2 = parseInt(v2[i]);

               if (num1 > num2) {
                   return 1;
               } else if (num1 < num2) {
                   return -1;
               }
           }

           return 0;
       }
       /**登录微信 */
       WXLogin() {
           let luach = wx.getLaunchOptionsSync();
           /** 邀请者id */
           let id = luach.query.inviter_id ? luach.query.inviter_id : '';
           window.sceneid = luach.scene;
           GameFIG_this.Tongzhi("微信登录", "正在登录", null);
           wx.login({
               success: (loginres) => {
                   if (loginres.code) {
                       var that = GameFIG_this;
                       var data = { 'name': gameNameName, 'code': loginres.code };
                       GameFIG_this.send_request('api/wx_login', data, '', 'POST', function (res) {
                           that.Player.playerConfig.openid = res.user.openid;
                           that.Player.playerConfig.session_key = res.user.session_key;
                           that.Player.playerConfig.jwt = res.jwt;
                           if (res.user.last_login) {
                               GameFIG_this.getplayer();
                           }
                       });
                       //=====
                   }
                   // var wxCode = loginres.code;
                   // GameFIG_this.getcode(wxCode); //获取真实code   
               }
           });
       }
       /**获取真实id */
       getcode(code) {
           if (TFyun == true) {
               wx.cloud.callFunction({
                   // 要调用的云函数名称
                   name: YunHanShu.login,
                   // 传递给云函数的参数
                   data: {
                       code: "请求返回oppid",
                   },
                   success: res => {
                       GameFIG_this.Tongzhi("微信登录", "登录成功", null);
                       GameFIG_this.Player.playerConfig.openid = res.result.openid;
                       //    GameFIG_this.Player.sessid = res.result.sessid;
                       GameFIG_this.Tongzhi("获取用户信息", "正在获取", null);
                       GameFIG_this.getplayer();
                   },
                   fail: err => {
                       GameFIG_this.Tongzhi("获取玩家code", "获取玩家code失败", {
                           err: err
                       });
                   }
               });
           } else {
               wx.request({
                   method: "POST",
                   url: window.serverUrlPre + "/User/sendSessionCode.html",
                   header: {
                       'content-type': 'application/x-www-form-urlencoded; charset=utf-8',
                   },
                   data: {
                       "code": code,
                   },
                   success: function (res) {
                       var resdate = res.data.result;
                       GameFIG_this.Player.playerConfig.openid = resdate.openid;
                       GameFIG_this.Player.sessid = resdate.sessid;
                       window.FistrUpdate = false;
                       GameFIG_this.getplayer(); //获取用户信息

                       var Allmsg = wx.getLaunchOptionsSync();
                       console.log(Allmsg);
                       if (GameFIG_this.fetchLocalData("P_buyPeople_Openid") != undefined) {
                           window.P_buyPeople_Openid = GameFIG_this.fetchLocalData("P_buyPeople_Openid").id;
                       }
                       if (Allmsg.query != undefined && Allmsg.query != null & Allmsg.query != "") {
                           window.P_key = Allmsg.query;
                           window.P_GotoFromAppid = Allmsg.referrerInfo.appId;
                           GameFIG_this.BUY_people_init();

                       }
                   },

                   fail: function () {
                       GameFIG_this.LoadSuccess_Fun.runWith(GameFIG_this.Player.playerConfig);
                   }

               });
           }

       }
       /**获取用户注册信息 */
       getplayer() {
           this.Player.playerConfig.otherInfo;
           wx.request({
               method: "POST",
               url: "https://www.menguoli.com/api/gameInfo/",//
               header: {
                   "Authorization": 'Bearer  ' + GameFIG_this.Player.playerConfig.jwt,
               },
               data: {
                   "name": gameNameName,
               },
               dataType: 'json',
               success: function (res) {
                   var resdate = res.data;

                   let otherInfoStr = resdate.gameInfo.ortherInfo;
                   if (otherInfoStr != "") {
                       console.log("成功获取用户数据");
                       let otherInfo = JSON.parse(otherInfoStr);
                       console.log(otherInfo);

                       GameFIG_this.Player.playerConfig.otherInfo = otherInfo;//JSON.stringify(otherInfo);
                       if (GameFIG_this.LoadSuccess_Fun != undefined) {
                           GameFIG_this.LoadSuccess_Fun.runWith(GameFIG_this.Player.playerConfig);
                       }
                   }


                   //    if (window.FistrUpdate == false) {
                   //        if (resdate.Sgin == GameConfig.banbenID) {
                   //            console.log("已注册");
                   //            GameFIG_this.Player.playerConfig = resdate;
                   //            if (GameFIG_this.LoadSuccess_Fun != undefined) {
                   //                GameFIG_this.LoadSuccess_Fun.runWith(resdate);
                   //            }
                   //        } else { //未注册
                   //            console.log("未注册");
                   //            GameFIG_this.UpdatePlayerMsg();
                   //            if (GameFIG_this.LoadSuccess_Fun != undefined) {
                   //                GameFIG_this.LoadSuccess_Fun.runWith(GameFIG_this.Player.playerConfig);
                   //            }
                   //        }
                   //        window.FistrUpdate = true;
                   //    }

               },

               fail: function () { }

           });
       }
       /**
         * 更新玩家数据至服务器 需要sessid
         */
       UpdatePlayerMsg() {
           var data2 = JSON.stringify(GameFIG_this.Player.playerConfig.otherInfo);
           console.log('(){}{}{}{}');
           console.log(data2);
           var header = {
               //    'content-type': 'application/json',
               "Authorization": 'Bearer  ' + GameFIG_this.Player.playerConfig.jwt
           };
           if (wx)
               wx.request({
                   url: 'https://www.menguoli.com/api/gameInfo',//
                   method: "PUT",
                   header: header,
                   data: {
                       "ortherInfo": data2,
                       "name": gameNameName,
                   },
                   success(res) {
                       console.log("玩家数据上传成功");
                   },
                   complete(res) {

                   }
               });
           GameFIG_this.saveLocalData(GameConfig.GameName + GameConfig.banbenID, GameFIG_this.Player.playerConfig);


       }
       /**是否是被邀请进入游戏人员 */
       TFYaoQinPeople() { //此接口待定
           var spk = wx.getLaunchOptionsSync(); //判断当前的key是否是分享key
           console.log(spk.query);
           if (spk.query.key != undefined) {

               console.log("你是被邀请人");
               var key = spk.query.key;
               console.log("当前邀请kode：" + key);
               wx.cloud.callFunction({
                   // 要调用的云函数名称
                   name: 'yqjz',
                   // 传递给云函数的参数
                   data: {
                       opid: key,
                   },
                   success: res3 => {
                       console.log(res3);

                   },
                   fail: err => {

                       GameFIG_this.Tongzhi("判断key是否分享key", "判断失败", {
                           err: err
                       });
                   },
                   complete: () => {
                       // ...
                   }
               });
           }
       }
       /**
        * 获取微信用户头像 姓名 此接口会调用微信授权按钮 请确保  微信登录成功之后调用
        * @param {*} callback 成功回调fun
        */
       GetUserInfo(callback = new Laya.Handler()) {
           wx.getSetting({ //判断是否授权
               success(res) {
                   console.log("判断是否授权");
                   console.log(res);
                   console.log(res.authSetting['scope.userInfo']);
                   if (res.authSetting['scope.userInfo']) //如果授权
                   {
                       // wx.getUserInfo({
                       //     success: (res) => {
                       //         var data = { 'name': gameNameName, 'session_key': GameFIG_this.Player.playerConfig.session_key, 'openid': GameFIG_this.Player.playerConfig.openid, 'iv': res.iv, 'encrypteData': res.encryptedData }

                       //         GameFIG_this.send_request('api/wx_auth', data, GameFIG_this.Player.playerConfig.jwt, 'POST', function (user) {
                       //             console.log(user)
                       //         })
                       //         // GameFIG_this.Player.playerConfig.Name = res.userInfo.nickName;
                       //         // GameFIG_this.Player.playerConfig.HeadUrl = res.userInfo.avatarUrl;
                       //         // GameFIG_this.UpdatePlayerMsg();
                       //         // callback.run();
                       //     }
                       // })
                       callback.run();
                       ShouQuanFirst = true;
                   } else {
                       ShouQuanFirst = false;
                       GameFIG_this.ShouQuan(callback);
                   }
               }
           });
       }
       /**微信 授权 */
       ShouQuan(callback = new Laya.Handler) {
           var button = wx.createUserInfoButton({ //创建微信授权按钮
               type: 'text',
               text: '',
               style: {
                   left: 0,
                   top: 0,
                   width: 1920,
                   height: 1080,
                   lineHeight: 40,
                   backgroundColor: '',
                   color: '',
                   textAlign: 'center',
                   fontSize: 16,
                   borderRadius: 4
               }
           });
           button.show();
           button.onTap((res) => {
               button.hide();
               if (res.errMsg == "getUserInfo:ok" && ShouQuanFirst == false) {
                   console.log(res);
                   let url = "api/wx_auth";
                   let sessionKey = GameFIG_this.Player.playerConfig.session_key;
                   let openId = GameFIG_this.Player.playerConfig.openid;
                   let jwt = GameFIG_this.Player.playerConfig.jwt;
                   wx.getUserInfo({
                       success: res => {
                           var data = { 'name': gameNameName, 'session_key': sessionKey, 'openid': openId, 'iv': res.iv, 'encrypteData': res.encryptedData };
                           console.log(data, jwt);
                           GameFIG_this.send_request(url, data, jwt, 'POST', function (userinfo) {
                               console.log(userinfo);
                           });
                       }
                   });
                   ShouQuanFirst = true;
                   GameFIG_this.Player.playerConfig.Name = res.userInfo.nickName;
                   GameFIG_this.Player.playerConfig.HeadUrl = res.userInfo.avatarUrl;
                   callback.run();
                   GameFIG_this.UpdatePlayerMsg();
                   //    GameFIG_this.BUY_people_shouQuan();
                   button.destroy();
               } else if (res.errMsg != "getUserInfo:ok") {
                   wx.showModal({
                       title: '是否重新授权',
                       content: "亲，接下来的游戏需要获取您的头像和姓名哟~",
                       success(res) {
                           if (res.confirm) {
                               button.destroy();
                               GameFIG_this.ShouQuan();
                           } else if (res.cancel) {
                               console.log("已取消授权");
                               button.destroy();
                           } else if (res.fail) {

                               button.destroy();
                           }
                       }
                   });
                   return;
               }
           });
       }

       /**
        * 初始化 微信云开发 
        */
       initwxCloud() {
           wx.cloud.init(); //初始化云
           this.WXcloud_MSG = wx.cloud.database({ //初始化云数据库
               env: YunHanShu.env //这里填写云环境id
           });
       }
       /**
        * 获取数据json
        * @param {*} typeID 集合名称
        * @param {*} isAll 是否全部获取
        * @param {*} much 获取多少
        * @param {*} CallBack 回调方法
        */
       GetWXYjson(typeID, isAll, much, CallBack) {
           wx.cloud.callFunction({
               // 要调用的云函数名称
               name: YunHanShu.getjson,
               // 传递给云函数的参数
               data: {
                   typeID: typeID
               },
               success: res2 => {
                   CallBack(res2.result);
               },
               fail: err => {
                   GameFIG_this.Tongzhi("获取json", "获取" + typeID + "失败", {
                       err: err
                   });
               },
               complete: () => {
                   // ...
               }
           });
       }
       /**
        * 获取微信云 资源路径
        * @param {*} URLlist 资源列表
        * @param {*} huidiaoFun 监听后回调方法
        */
       GetCloudFileURL(URLlist, successFun) {

           wx.cloud.getTempFileURL({ //获取邀请背景
               fileList: URLlist,
               success: res => {
                   successFun(res);
               },
               fail: console.error
           });
       }


       /**
        * 是否初始化自定义内部通知方法
        * @param {*} Fun 通知回调方法 务必bind 执行域
        * @param 示例   GameFIG.InitTongZhi(this.TongZhi_Back.bind(this));
        * @returns--- 返回参数结构如下（注意方法接收处理）
        * @-------返回数据如下
        * @type:"类型"string  通知类型，如“登录通知”,"加载通知等" 
        * @msg:"通知消息"string  通知的消息
        * @otherDate:{ } 其他附加信息
        * @-------
        */
       InitTongZhi(Fun) {
           this.TongzhiTF = true;
           this.TongzhiFun = Fun;
       }
       /**
        * 自定义通知方法 类似与consolo的功能 本脚本通知外部方法
        *  @param type:"类型"string  通知类型，如“登录通知”,"加载通知等"
        *  @param msg:"通知消息"string  通知的消息
        *  @param otherDate:{ } 其他附加信息
        */
       Tongzhi(type, msg, otherDate) {
           var res = {
               type: type,
               msg: msg,
               otherDate: otherDate
           };
           if (this.TongzhiTF == true) {
               this.TongzhiFun(res);
           } else {
               console.log(res);
           }
       }


       /**
        * 添加Text鼠标滚动监听(注意* 仅供Laya.Text类型非label)
        * @param {*} text 需要滚动的文本组件
        */
       addScrollText(text) {
           this.ScrollText = text;
           this.ScrollText.overflow = Laya.Text.SCROLL;
           this.ScrollText.on(Laya.Event.MOUSE_DOWN, this, this.startScrollText);
       }
       /* 开始滚动文本 */
       startScrollText(e) {
           this.ScrollText_prevX = this.ScrollText.mouseX;
           this.ScrollText_prevY = this.ScrollText.mouseY;
           Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.scrollText);
           Laya.stage.on(Laya.Event.MOUSE_UP, this, this.finishScrollText);
           Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.finishScrollText);
       }
       /* 停止滚动文本 */
       finishScrollText(e) {
           Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.scrollText);
           Laya.stage.off(Laya.Event.MOUSE_UP, this, this.finishScrollText);
           Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.finishScrollText);
       }
       /* 鼠标滚动文本 */
       scrollText(e) {
           var nowX = this.ScrollText.mouseX;
           var nowY = this.ScrollText.mouseY;
           this.ScrollText.scrollX += this.ScrollText_prevX - nowX;
           this.ScrollText.scrollY += this.ScrollText_prevY - nowY;
           this.ScrollText_prevX = nowX;
           this.ScrollText_prevY = nowY;
       }
       /**
        * 随机打乱数组
        * @param array
        */
       Randshuzhu(array) {
           let random = (a, b) => Math.random() > 0.5 ? -1 : 1;
           return array.sort(random);
       }
       /**
        * 获取min~max的正整数
        * @param {*} min 最小数正整数
        * @param {*} max 最大数正整数
        */
       GetRandNub(min, max) {
           return Math.floor(Math.random() * (max - min + 1) + min); //0-10
       }
       /**
       * 获取min~max的整数 例如-50~50
       * @param {*} min 最小数整数
       * @param {*} max 最大数正整数
       */
       GetRandNub2(min, max) {
           var biaoxu = 0;
           if (min < 0) {
               biaoxu = min * -1;
               max += biaoxu;
               min = 0;
           }
           return Math.floor(Math.random() * (max - min + 1) + min) - biaoxu; //0-10
       }
       /**
        * 播放音乐 (网络加载模式)
        * @param {*} id 音乐表ID
        */
       PlayMusic(id) {
           if (this.Open.YX) {
               if (this.SoundManager) {
                   this.SoundManager.stop();
                   Laya.SoundManager.removeChannel(this.SoundManager);
               }
               this.SoundManager = Laya.SoundManager.playMusic(this.GameLoadPath + this.MusicJson[id].URL, 0);
           }
       }
       /**暂停音乐 */
       PauseMusic() {
           if (this.SoundManager) {
               this.SoundManager.pause();
           }
       }
       /**继续音乐 */
       ResumeMusic() {
           if (this.SoundManager) {
               this.SoundManager.resume();
           }
       }
       /**
        * 播放音效 (网络加载模式)
        * @param {*} id 音乐表ID
        * @param {*} isloop 是否循环 默认1次  0表示无限循环
        */
       PlaySound(id, isloop = 1) {
           if (this.Open.YX) {
               return Laya.SoundManager.playSound(this.GameLoadPath + this.MusicJson[id].URL, isloop);
           }

       }
       /**
        * 微信震动
        * @param {*} TF true,短 false 长
        */
       wxZD(TF) {
           if (wx && this.Open.ZD) {
               if (TF) {
                   wx.vibrateShort();
               } else {
                   wx.vibrateLong();
               }
           }
       }
       /**
        * 初始化页面跳转
        * @param {*} array 页面数组 例如：[this.zjm_ceng,this.load_Ceng]
        * @param {*} back 页面调整背景 this.backback
        */
       InitViewToView(array, back) {
           this.viewID = array;
           this.back_back = back;
       }
       /**
        * 打开页面 使用前请调用**InitViewToView**
        * @param {*} whereid 从何id
        * @param {*} toid 去哪儿id
        * @param {*} isclose 是否关闭当前页面
        * @param {*} openOrCloseBcke 关闭或者开启遮罩
        */
       ViewToView(whereid, toid, isclose = true, openOrCloseBcke = false) {
           if (isclose == true) {
               this.viewID[whereid].visible = false;
           }
           this.viewID[toid].visible = true;
           if (openOrCloseBcke) {
               this.back_back.visible = true;
               this.back_back.on(Laya.Event.CLICK, this, function () { });
           } else {
               this.back_back.visible = false;
               this.back_back.offAll();
           }
       }

       /**
        * 微信自带提示框
        * @param {*} msg 提示信息 
        * @param {*} time 显示的时间  默认2000毫秒
        * @param {*} TFMask 是否开启按钮mask 防止点击穿透 默认false
        */
       TiShiKuang(msg, time = 2000, TFMask = false) {
           if (wx != undefined) {
               wx.showToast({
                   title: msg,
                   icon: 'none',
                   duration: time,
                   mask: TFMask
               });
           } else {
               alert(msg);
           }

       }
       /**
        * 
        * @param {*} biaoti 标题
        * @param {*} msg 内容
        * @param {Laya.Handler} success_Hander 成功回调 
        * @param {Laya.Handler} cancel_Hander 失败/取消 回调
        */
       JiaoHukuang(biaoti, msg, success_Hander, cancel_Hander) {
           if (wx) {
               wx.showModal({
                   title: biaoti,
                   content: msg,
                   showCancel: true, //隐藏取消
                   success(res) {
                       if (res.confirm) { //点了确定
                           if (success_Hander) {
                               success_Hander.run();
                           }

                       } else if (res.cancel) { //点了取消
                           if (cancel_Hander) {
                               cancel_Hander.run();
                           }
                       } else if (res.fail) { //其他错误
                           if (cancel_Hander) {
                               cancel_Hander.run();
                           }
                       }
                   }
               });
           }
       }

       //--------------------------------------广告区

       /**
        *  广告入口  请务必在主脚本第一时间调用
        * @param {Laya.Handler} LoginHander  登录成功回调
        * @param {Laya.Handler} InitHander  初始信息成功回调 附带返回参数
        */
       Main_Use(LoginHander, InitHander) {

           window.begintime = Math.floor(new Date().getTime() / 1000);//游戏开始时间
           var hander = undefined;
           if (wx) {//走服务器登录流程---登录微信--获取真实code---获取玩家注册信息--
               hander = Laya.Handler.create(this, function (success, data) {
                   GameFIG_this.Player.playerConfig = data;
                   success.run();
               }, [LoginHander]);
           } else {
               if (GameFIG_this.fetchLocalData(GameConfig.GameName + GameConfig.banbenID)) {
                   GameFIG_this.Player.playerConfig = GameFIG_this.fetchLocalData(GameConfig.GameName + GameConfig.banbenID);
                   LoginHander.run();
               } else {
                   LoginHander.run();
               }
               // return
           }
           this.Login(hander);//游动西服务器登录逻辑接口 适当修改
           // this.SetCanLet();//游动西游戏盒子接口  适当关闭
           this.GetboxAll();
           this.GameBegin();
           this.getServerConfig(InitHander);
       }
       getServerConfig(InitHander) { //获取游戏配置信息

           var data = {};
           var xhr = new Laya.HttpRequest();
           xhr.http.timeout = 10000; //设置超时时间；
           xhr.once(Laya.Event.COMPLETE, this, getCfgOk);
           xhr.once(Laya.Event.ERROR, this, getCfgError);
           xhr.send(window.serverUrlPre + "/Utils/init.html", "", "GET", "application/x-www-form-urlencoded");
           function getCfgError(data) { //失败回调
           }

           function getCfgOk(res) { //成功回调
               var resdate = JSON.parse(res).result;
               if (resdate.share.length > 0) {
                   window.shareInfo = resdate.share;
                   this.GetGameInitConfig();
               }
               window.Config = resdate.config;
               InitHander.runWith(res);

           }


       }







       /**
        * 游戏开始可在加载页面调用此函数 加载广告
        */
       GameBegin() {
           window.shareInfo = [{
               img: "XZZZ_fx_500x400.jpg",
               title: "一起来玩"
           },
           {
               img: "XZZZ_fx_500x400.jpg",
               title: "全新游戏等你来玩"
           }
           ];
           if (wx) {
               this.initGG();
               this.GetUpdate(); //更新检测 
               wx.onShow(function (res) { //微信进入监听
                   console.log(res);
                   console.log("回到游戏界面");
                   if (GameGGConfig.shareNow == true) {
                       GameGGConfig.shareNow = false;
                       GameFIG_this.ShareGet();
                   }
                   if (window.ShowShowBanner == true) {
                       window.ShowShowBanner == false;
                       window.mythis.closeZhadandan();
                   }
               });
               wx.onHide(function (res) { //微信退出后台监听
                   GameFIG_this.BUY_people_StopMsg();
                   console.log(res);
                   GameFIG_this.Player.playerConfig.lastTime = new Date();
                   console.log("退出游戏");
                   GameFIG_this.UpdatePlayerMsg();
               });
           }
       }
       initGG() { //初始化广告
           GameGGConfig.nowtp = Math.floor(Math.random() * ((GameGGConfig.TPid.length - 1) - (0) + 1) + (0)); //max-min
           this.JtGG(); //初始化所有bander广告
           this.dtgg(); //视频广告
       }
       JtGG(width = 300) { //图片广告
           if (GameGGConfig.TPid == undefined) {
               return;
           }
           if (GameGGConfig.banner) {
               GameGGConfig.banner.destroy();
           }
           if (GameGGConfig.nowtp > GameGGConfig.TPid.length - 1) {
               GameGGConfig.nowtp = 0;
           }
           if (GameGGConfig.TPid != undefined && GameFIG_this.compareVersion('2.0.4') >= 0) { //id不为空时
               GameGGConfig.banner = wx.createBannerAd({
                   adUnitId: GameGGConfig.TPid[GameGGConfig.nowtp],
                   adIntervals: 30,
                   style: {
                       left: 15,
                       top: 0,
                       width: width
                   }
               });
               GameGGConfig.banner.onResize(res => {
                   GameGGConfig.banner.style.top = wx.getSystemInfoSync().windowHeight - res.height - 20;
                   GameGGConfig.banner.style.left = 667 / 1334 * wx.getSystemInfoSync().windowWidth - res.width / 2;
               });
               GameGGConfig.banner.onLoad(res => {
                   console.log("banner广告加载成功");

                   if (window.showBanner == true) {
                       console.log("banner广告加载成功");
                       window.showBanner = false;
                       GameFIG_this.bannershow(window.showBannerTT.weizhiID, window.showBannerTT.pos);
                   }
               });
               GameGGConfig.banner.onError(err => { });

           } else { }
           GameGGConfig.nowtp++;
           //   this.saveLocalData("GuangGaoID疯狂", { "id": GameGGConfig.nowtp });

       }
       dtgg() { //视频广告

           if (GameGGConfig.SPid != undefined) {
               GameGGConfig.redio = wx.createRewardedVideoAd({
                   adUnitId: GameGGConfig.SPid,
                   success: function (res) {

                   }
               });
               GameGGConfig.redio.onLoad(() => {
                   GameGGConfig.readtf = true;
                   console.log("视频广告加载完毕");
               });

               GameGGConfig.redio.onError(err => {
                   GameGGConfig.readtf = false;
                   GameGGConfig.TVorShare = false;
               });
               GameGGConfig.redio.onClose(res => {
                   // 用户点击了【关闭广告】按钮
                   if (res && res.isEnded || res === undefined) {
                       if (window.success_HanderUse) {
                           window.success_HanderUse.run();
                           window.success_HanderUse = undefined;
                       }
                   } else {
                       if (window.fail_HanderUse) {
                           window.fail_HanderUse.run();
                           window.fail_HanderUse = undefined;
                       }
                   }
               });
           }
       }
       ShareGet() { //分享获取
           var MS = parseInt((Date.parse(new Date()) - Date.parse(GameGGConfig.sharetime))); //获取秒数
           if (MS < 1000) { //0
               GameFIG_this.WXLog(false, null);
           } else if (MS < 3000) { //20
               var r = Math.random();
               if (r <= 0.2) {
                   GameFIG_this.GETshareGift();
               } else {
                   GameFIG_this.WXLog(false, null);
               }
           } else { //100  90  80 
               var r = Math.random();
               if (r <= GameGGConfig.shareBFB) {
                   GameFIG_this.GETshareGift();
               } else {
                   GameFIG_this.WXLog(false, null);
               }
           }
       }

       GETshareGift() { //获取分享礼物
           if (window.success_HanderUse) {
               window.success_HanderUse.run();
               window.success_HanderUse = undefined;
           }

       }
       /**
        * 分享成功 失败窗口
        * @param {*bool} success 是否分享成功
        *  @param {*str} success 分享成功,显示物品名称
        *  @param {*index} success 分享失败标识 方便重新分享
        */
       WXLog(success, str) {
           if (success) {
               wx.showModal({
                   title: '分享成功',
                   content: str,
                   showCancel: false, //隐藏取消
                   confiemText: "谢谢",
                   success(res) {
                       if (res.confirm) {

                       } else if (res.cancel) {

                       } else if (res.fail) {

                       }
                   }
               });
           } else {
               if (window.fail_HanderUse) {
                   window.fail_HanderUse.run();
                   window.fail_HanderUse = undefined;
               }

           }

       }

       TVLog(success, str, index) {
           if (success) {
               wx.showModal({
                   title: '观影完毕',
                   content: str,
                   showCancel: false, //隐藏取消
                   confiemText: "谢谢",
                   success(res) {
                       if (res.confirm) {

                       } else if (res.cancel) {

                       } else if (res.fail) {

                       }
                   }
               });
           } else {
               wx.showModal({
                   title: '观影失败',
                   showCancel: false, //隐藏取消
                   content: str,
                   success(res) {
                       if (res.confirm) {

                       } else if (res.cancel) {


                           // 播放中途退出，不下发游戏奖励
                       } else if (res.fail) {


                           // 播放中途退出，不下发游戏奖励
                       }
                   }
               });
           }

       }
       /**
        * 切换banner
        * @param {*} width 重新加载的宽高
        * @param {*} TFshow 重新加载后是否继续显示
        */
       changgebanner(width, TFshow = false) {
           if (wx && GameGGConfig.TPid != undefined) {
               this.hidebanner();
               window.showBanner = TFshow;
               this.JtGG(width);
           }
       }
       hidebanner() {
           if (wx && GameGGConfig.TPid != undefined) {
               window.showBanner = false;
               GameGGConfig.banner.hide();
           }

       }
       /**
        * 显示banner 
        * @param {*} weizhiID 显示区域位置 0底部居中  1底部左对齐 2底部右对齐 3相对于1334*750的位置比例 例如{x:667,y:750} 为底部居中
        * @param {*} pos 显示区域位置 相对于1334*750的位置比例 例如{x:667,y:750} 为底部居中  仅weizhiID为3有效
        */
       bannershow(weizhiID = 0, pos = { x: 0, y: 0 }) {
           if (wx && GameGGConfig.TPid != undefined) {
               window.showBannerTT = {
                   weizhiID: weizhiID,
                   pos: pos,
               };
               GameGGConfig.banner.show();
               if (weizhiID == 0) {
                   GameGGConfig.banner.style.top = wx.getSystemInfoSync().windowHeight - GameGGConfig.banner.style.realHeight - 20 / GameConfig.InitFBL.height * wx.getSystemInfoSync().windowHeight;
                   GameGGConfig.banner.style.left = 667 / GameConfig.InitFBL.width * wx.getSystemInfoSync().windowWidth - GameGGConfig.banner.style.realWidth / 2;
               } else if (weizhiID == 1) {
                   GameGGConfig.banner.style.top = wx.getSystemInfoSync().windowHeight - GameGGConfig.banner.style.realHeight - 20 / GameConfig.InitFBL.height * wx.getSystemInfoSync().windowHeight;
                   GameGGConfig.banner.style.left = 20 / GameConfig.InitFBL.height * wx.getSystemInfoSync().windowHeight;
               } else if (weizhiID == 2) {
                   GameGGConfig.banner.style.top = wx.getSystemInfoSync().windowHeight - GameGGConfig.banner.style.realHeight - 20 / GameConfig.InitFBL.height * wx.getSystemInfoSync().windowHeight;
                   GameGGConfig.banner.style.left = wx.getSystemInfoSync().windowWidth - (GameGGConfig.banner.style.realWidth + 20 / GameConfig.InitFBL.height * wx.getSystemInfoSync().windowHeight);
               } else if (weizhiID == 3) {
                   GameGGConfig.banner.style.top = pos.y / GameConfig.InitFBL.height * wx.getSystemInfoSync().windowHeight - GameGGConfig.banner.style.realHeight / 2;
                   GameGGConfig.banner.style.left = pos.x / GameConfig.InitFBL.width * wx.getSystemInfoSync().windowWidth - GameGGConfig.banner.style.realWidth / 2;
               }

           }

       }
       /**
        * 打开广告_分享汇总方法
        * @param {*bool} AotoSPFX  true视频 false分享 0 随机
        * @param {*Laya.Handler} success_Hander 成功分享/观看视频时调用
        * @param {*Laya.Handler}fail_Hander 失败分享/观看视频时调用
        */
       GG_all(AotoSPFX = 0, success_Hander, fail_Hander) {
           if (success_Hander) {
               window.success_HanderUse = success_Hander;
           }
           if (fail_Hander) {
               window.fail_HanderUse = fail_Hander;
           }
           if (wx) {
               if (AotoSPFX == 0) {
                   GameGGConfig.TVorShare = !GameGGConfig.TVorShare;
               } else {
                   GameGGConfig.TVorShare = AotoSPFX;
               }
               if (GameGGConfig.TVorShare) { //视频
                   if (GameGGConfig.readtf && GameGGConfig.redio != undefined) {
                       GameGGConfig.redio.show();

                   } else {
                       GameGGConfig.readtf = false;
                       GameGGConfig.TVorShare = false;
                       this.FXget();
                       GameGGConfig.shareNow = true;

                       GameGGConfig.sharetime = new Date();
                   }
               } else { //分享
                   this.FXget();
                   GameGGConfig.shareNow = true;
                   GameGGConfig.sharetime = new Date();
               }
           } else {

               if (success_Hander) {
                   success_Hander.run();
               }
           }


       }
       FXget(obj = null, fn2) { //分享
           if (wx) {
               let fxrand = Math.floor(Math.random() * ((window.shareInfo.length - 1) - (0) + 1) + (0));;
               if (obj) {
                   wx.shareAppMessage({
                       imageUrl: window.shareInfo[fxrand].img, //转发标题
                       title: window.shareInfo[fxrand].title, //转发标题
                       query: "key=1",
                       // query: 'inviter_id=' + window.player.P_id + '&share_id=' + window.shareInfo[fxrand].id,
                   });


               } else {
                   // var fxrand = Math.floor(Math.random() * ((window.shareInfo.length - 1) - (0) + 1) + (0)); //max-min
                   wx.shareAppMessage({
                       imageUrl: window.shareInfo[fxrand].img,//转发标题
                       title: window.shareInfo[fxrand].title, //转发标题
                       query: "key=1",
                       // query: 'inviter_id=' + window.player.P_id + '&share_id=' + window.shareInfo[fxrand].id,
                   });
                   // window.isFeComm = false;
                   // let ourSID = setTimeout(() => {
                   //     window.isFeComm = true
                   //     window.success_HanderUse.run();
                   // }, 3000);
                   // wx.onShow(() => {
                   //     if (!window.isFeComm) {
                   //         window.fail_HanderUse.run();
                   //         clearTimeout(ourSID);
                   //     }
                   // })


               }

           }

       }
       //-----**1    
       GetUpdate() { //获取新版本
           var updateManager = wx.getUpdateManager();
           updateManager.onCheckForUpdate(function (res) {
               // 请求完新版本信息的回调
               console.log("版本更新检测");
               console.log(res);

           });
           updateManager.onUpdateReady(function () {
               wx.showModal({
                   title: '更新提示',
                   content: '有新版本噢',
                   success(res) {
                       if (res.confirm) {
                           // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                           updateManager.applyUpdate();
                       }
                   }
               });
           });

           updateManager.onUpdateFailed(function () {
               // 新版本下载失败
               console.log("更新失败");
               wx.showModal({
                   title: '更新提示',
                   content: '更新失败,请检测网络，并重启小游戏~',
                   success(res) {

                   }
               });
           });


       }

       GetGameInitConfig() { //设置游戏分享按钮 和转发信息
           if (wx) {
               //分享
               // 显示当前页面的转发按钮
               wx.updateShareMenu({
                   withShareTicket: true
               });
               wx.showShareMenu({
                   // 是否使用带 shareTicket 的转发
                   withShareTicket: true
               });
               var fxrand = Math.floor(Math.random() * ((window.shareInfo.length - 1) - (0) + 1) + (0)); //max-min
               // 绑定分享参数
               // wx.onShareTimeline(() => {
               //     return {
               //         title: window.shareInfo[fxrand].title,
               //         imageUrl: window.shareInfo[fxrand].img, // 图片 URL
               //         query: 'a=1&b=2'
               //     }
               // })
               // XZZZ_fx_500x400.jpg
               wx.onShareAppMessage(() => {
                   return {
                       title: window.shareInfo[fxrand].title,
                       imageUrl: window.shareInfo[fxrand].img, // 图片 URL Laya.URL.basePath + 'gamemain/share.png'
                   }
               });
           }
       }
       //游戏导出盒子
       //----------------------------------------------------------
       /**
        * 小游戏跳转接口
        *  @param {*} oppid 传入游戏appid
        *  @param {*} url 传入游戏url
        *  @param {*} locationid 传入游戏locationid    
        *   @param {*} id 传入游戏id         
        *  @param {*} OverFun fun
        *  @param {*} TfOpenBanner 关闭全导后是否继续显示banner
        */
       GoGame(oppid, url = "", locationid = "", id, OverFun, TfOpenBanner = false) {
           if (wx) {
               if (TfOpenBanner != "none") {
                   this.bannerShow_tf = TfOpenBanner;
               }

               if (this.compareVersion("2.2.0") >= 0) {
                   GameFIG_this.boxShangChuan_WX_first(oppid, locationid, id);
                   wx.navigateToMiniProgram({
                       appId: oppid,
                       path: url,
                       extraData: {
                           path: "MGG游戏"
                       },
                       success(res) {
                           GameFIG_this.boxShangChuan_WX(oppid, locationid, id);
                       },
                       fail() {
                           if (OverFun != undefined) {
                               OverFun();
                           }

                       }
                   });
               } else {

               }
           } else {
               if (OverFun != undefined) {
                   OverFun();
               }
           }
       }
       /**
        * 列表滚动
        * @param {*} index 列表ID
        */
       ListRun(index) {
           var Time = window.RunListOpen[index].time;
           var List = window.RunListOpen[index].list;
           var boxid = window.RunListOpen[index].boxid;
           var SCakboxTF = window.RunListOpen[index].SCakboxTF;
           var dangyexians = window.RunListOpen[index].much;
           if (window.RunListOpen[index].Open == false) {
               return;
           }
           var jindu = List.scrollBar.value / List.scrollBar.max;
           if (isNaN(jindu)) {
               jindu = 0;
           }
           if (jindu > 1) {
               jindu = 1;
           } else if (jindu < 0) {
               jindu = 0;
           }
           if (SCakboxTF) {
               if (List.repeatY == 1 || List.repeatX == 1) {
                   var togo = window.boxInfo[boxid].length - dangyexians;

               } else {
                   if (window.RunListOpen[index].repeatXTF) { //左右
                       var togo = parseInt(window.boxInfo[boxid].length) - dangyexians * List.repeatY;
                   } else {
                       var togo = parseInt(window.boxInfo[boxid].length) - dangyexians * List.repeatX;
                   }
               }
               var time = parseInt(togo * jindu) * Time;
               List.tweenTo(0, time, Laya.Handler.create(this, this.ListRun2, [index]));
           } else {

               if (List.repeatY == 1 || List.repeatX == 1) {
                   var togo = window.boxInfo[boxid].length - dangyexians;
                   // var relto = togo;
               } else {
                   if (window.RunListOpen[index].repeatXTF) { //左右
                       var togo = parseInt(window.boxInfo[boxid].length) - dangyexians * List.repeatY;
                       // if (parseInt(window.boxInfo[boxid].length) % List.repeatY == 1) {
                       //     var relto = parseInt(window.boxInfo[boxid].length) ;
                       // }else{
                       //     var relto = parseInt(window.boxInfo[boxid].length) - (List.repeatY - 1);
                       // }

                   } else {
                       var togo = parseInt(window.boxInfo[boxid].length) - dangyexians * List.repeatX;

                       // if (parseInt(window.boxInfo[boxid].length) % List.repeatX == 1) {
                       //     var relto = parseInt(window.boxInfo[boxid].length) ;
                       // }else{
                       //     var relto = parseInt(window.boxInfo[boxid].length) - (List.repeatX - 1);
                       // }
                   }
                   togo++;
               }
               var time = (togo - parseInt(togo * jindu)) * Time;
               List.tweenTo(togo, time, Laya.Handler.create(this, this.ListRun2, [index]));
           }

       }
       ListRun2(index) {
           if (window.RunListOpen[index].SCakboxTF) {
               window.RunListOpen[index].SCakboxTF = false;
           } else {
               window.RunListOpen[index].SCakboxTF = true;
           }
           this.ListRun(index);
       }
       /**失败跳转全导 */
       OverQuanDao2() {
           this.DadaoOpen = true;
           this.GotoWhere(0);
           this.hidebanner();
           window.mythis.Fullguide_ceng.visible = true;
           this.SetOpenCloseRunlist(window.mythis.guanggao_list, true);
           Laya.timer.once(2000, this, function () {
               window.mythis.jixugame.visible = true;
           });
       }
       CloseQuanDao2() {
           this.DadaoOpen = false;
           this.PlaySound(7);
           if (this.bannerShow_tf == true) {
               console.log("重新打开");
               this.bannershow(4);
               this.bannerShow_tf = false;
           }
           window.mythis.jixugame.visible = false;
           window.mythis.Fullguide_ceng.visible = false;
           this.SetOpenCloseRunlist(window.mythis.guanggao_list, false);
       }
       CloseQuanDao() {
           this.PlaySound(7);
           if (this.bannerShow_tf == true && this.DadaoOpen != true) {
               console.log("重新打开");
               this.bannershow(4);
               this.bannerShow_tf = false;
           }
           window.mythis.jixugame_2.visible = false;
           window.mythis.quandao2.visible = false;
           this.SetOpenCloseRunlist(window.mythis.guanggao_list2, false);
       }
       /**失败跳转全导 */
       OverQuanDao() {

           // this.GotoWhere(5);
           // this.hidebanner();
           // window.mythis.quandao2.visible = true;
           // this.SetOpenCloseRunlist(window.mythis.guanggao_list2, true);
           // Laya.timer.once(2000, this, function () {
           //     window.mythis.jixugame_2.visible = true;
           // })
           if (!this.xqdIsOpen) {
               this.xqdIsOpen = true;
               Laya.Scene.open("XQDView.scene", false);
           }

       }
       /**
         * 乱跳
         * @param {*} boxindex boxinfo下标
         */
       GotoWhere(boxindex) {
           console.log("瞎导");
           if (window.boxInfo != undefined) {
               if (window.boxInfo[boxindex] != undefined && window.boxInfo[boxindex] != "" && window.boxInfo[boxindex] != null) {
                   if (window.boxInfo[boxindex].length > 0) {
                       var randid = this.GetRandNub(0, window.boxInfo[boxindex].length - 1);
                       var box = window.boxInfo[boxindex][randid];
                       this.GoGame(box.appid, box.url, box.locationid, box.id, undefined, "none");
                   }
               }
           }
       }
       /**
        * 单个循环导出盒子
        * @param {*} node 节点
        * @param {*} time  多久循环一次 /毫秒
        * @param {*} boxid  盒子id
        * @param {*} ttff  是否父物体设置 false子物体
        * @param {*} TfOpenBanner  关闭导出是否显示banner
        */
       SetOnceBOX(node, time, boxid, ttff = true, TfOpenBanner = false) {
           var a = Math.floor(Math.random() * ((window.boxInfo[boxid].length - 1) - (0) + 1) + (0)); //0-10
           let ggTexture;
           let logo = window.boxInfo[boxid][a].logo;
           if (Array.isArray(logo)) {
               ggTexture = logo[this.GetRandNub(0, logo.length - 1)];
           } else {
               ggTexture = logo;
           }

           if (ttff) {
               node.texture = ggTexture;//window.boxInfo[boxid][a].logo;
           } else {
               node.getChildAt(0).texture = ggTexture;//window.boxInfo[boxid][a].logo;
               node.getChildAt(1).text = window.boxInfo[boxid][a].title;

               // node.getChildAt(1).text = 
           }
           node.offAll();
           this.butTween(node, Laya.Handler.create(this, this.GoGame, [window.boxInfo[boxid][a].appid, window.boxInfo[boxid][a].url, window.boxInfo[boxid][a].locationid, window.boxInfo[boxid][a].id, this.OverQuanDao.bind(this), TfOpenBanner]), false);
           Laya.timer.once(time, this, this.SetOnceBOX, [node, time, boxid, ttff, TfOpenBanner], false);

       }
       /**
       * 开关滚动列表
       * @param {*} list 列表
       * @param {*} openOrColse  开启或者关闭
       */
       SetOpenCloseRunlist(list, openOrColse) {
           if (window.boxInfo == undefined) {
               return
           }
           for (var a = 0; a < window.RunListOpen.length; a++) {
               if (list == window.RunListOpen[a].list) {
                   if (window.boxInfo[window.RunListOpen[a].boxid].length <= window.RunListOpen[a].much) {
                       return
                   } //如果在显示范围内数量不滚动
                   window.RunListOpen[a].Open = openOrColse;
                   if (openOrColse) {
                       this.ListRun(a);
                   }
                   return;
               }
           }
       }
       /**
         * 设置滚动List方法汇总
         * @param {*} List 传入list
         * @param {*} type 类型id默认1   1直接设置节点物体 2设置节点物体子物体（0是图片 1是名字），根据需求更改
         * @param {*} overFun 跳转失败方法
         * @param {*} repeatXTF 传入方向 true 左右 flase 上下
         * @param {*} dangyexians 最多显示多少个
         * @param {*} SCakboxTF 正向反向
         * @param {*} id 广告盒子id
         * @param {*} TfOpenBanner 点击跳转失败后进入全导页面，关闭全导页面是否打开banner
         * @param {*} time 滚动时间
         */
       SetListJS(List, type = 1, overFun, repeatXTF, dangyexians, SCakboxTF, id, TfOpenBanner = false, time = 2500) { //设置滚动list
           if (window.boxInfo != undefined) {
               if (repeatXTF) { //左右
                   List.repeatX = Math.ceil(window.boxInfo[id].length / List.repeatY);
               } else {
                   List.repeatY = Math.ceil(window.boxInfo[id].length / List.repeatX);
               }
               if (List.renderHandler == undefined) {
                   List.scrollBar.hide = true;
                   List.renderHandler = new Laya.Handler(this, this.updateList);
               }
               var Date = [];
               for (var a = 0; a < window.boxInfo[id].length; a++) {
                   Date.push({
                       boxInfo: window.boxInfo[id][a],
                       listID: window.RunListOpen.length,
                       TfOpenBanner: TfOpenBanner,
                       type: type,
                       overFun: overFun,
                   });
               }
               List.array = Date;
               window.RunListOpen.push({
                   list: List,
                   Open: false,
                   much: dangyexians,
                   SCakboxTF: false,
                   boxid: id,
                   repeatXTF: repeatXTF,
                   time: time
               });
               List.on(Laya.Event.MOUSE_UP, this, function (res) {
                   this.SetOpenCloseRunlist(res, true);
               }, [List]);
           }
       }
       updateList(cell, index) {
           let ggTexture;
           let logo = cell.dataSource.boxInfo.logo;
           if (Array.isArray(logo)) {
               ggTexture = logo[this.GetRandNub(0, logo.length - 1)];
           } else {
               ggTexture = logo;
           }

           if (cell.dataSource.type == 2) {
               cell.getChildAt(0).texture = ggTexture;//cell.dataSource.boxInfo.logo;
               cell.getChildAt(1).text = cell.dataSource.boxInfo.title;
           } else if (cell.dataSource.type == 0) {
               cell.texture = ggTexture;//cell.dataSource.boxInfo.logo;
           } else {
               cell.getChildAt(0).texture = ggTexture;//cell.dataSource.boxInfo.logo;
           }
           cell.listID = cell.dataSource.listID;
           this.butTween(cell, Laya.Handler.create(this, this.GoGame, [cell.dataSource.boxInfo.appid, cell.dataSource.boxInfo.url, cell.dataSource.boxInfo.locationid, cell.dataSource.boxInfo.id, cell.dataSource.overFun, cell.dataSource.TfOpenBanner], false), false);

       }
       //读取游戏广告盒子
       SetCanLet() {

           var xhr = new Laya.HttpRequest();
           var date = {
               softid: GameGGConfig.appid,
           };
           date = this.PinJie_Fun(date);
           xhr.http.timeout = 10000; //设置超时时间；
           xhr.once(Laya.Event.COMPLETE, this, getCfgOk);
           xhr.once(Laya.Event.ERROR, this, getCfgError);
           xhr.send(window.serverBox + "/v1.1/api/getGameParam.html", date, "POST", "application/x-www-form-urlencoded");
           function getCfgError(data) { //失败回调
               console.log(data);
           }
           function getCfgOk(res) { //成功回调
               res = JSON.parse(res);
               if (res.result.length > 0) {
                   for (var a = 0; a < res.result.length; a++) {
                       if (res.result[a].name == "xiuche_limit") {
                           if (res.result[a].value != undefined) { //修车
                               window.qingxisuoyin = parseInt(res.result[a].value);
                               if (window.qingxisuoyin == 0) {
                                   window.CanQiangXiu = false;
                               } else {
                                   window.CanQiangXiu = true;
                               }
                           }
                       } else if (res.result[a].name == "zadan_limit") {//宝箱砸蛋banner限制
                           if (parseInt(res.result[a].value) == 1) { //开
                               window.baoxiangCanShow = true;
                           } else {
                               window.baoxiangCanShow = false;
                           }
                       } else if (res.result[a].name == "scene_limit") {//场景限制值
                           var index = 0;
                           var changjinxianzhi = [""];
                           for (var b = 0; b < res.result[a].value.length; b++) {
                               if (res.result[a].value.substr(b, 1) == ",") {
                                   index++;
                                   changjinxianzhi[index] = "";
                                   continue;
                               }
                               changjinxianzhi[index] += res.result[a].value.substr(b, 1);

                           }
                           window.IScomeFrom = false;//是否从指定场景进入的
                           for (var c = 0; c < changjinxianzhi.length; c++) {
                               if (wx) {
                                   var IScomeFromID = wx.getLaunchOptionsSync().scene.toString();
                               } else {
                                   var IScomeFromID = "9999";
                               }
                               if (IScomeFromID == changjinxianzhi[c]) {
                                   window.IScomeFrom = true;
                                   break;
                               }
                           }
                       } else if (res.result[a].name == "tili_limit") {//体力次数
                           window.tiliTotalNum = Number(res.result[a].value);
                           if (window.tiliTotalNum <= 0) {
                               window.isLingquTiLi = false;
                           } else {
                               window.isLingquTiLi = true;

                           }
                       }
                   }
                   // this.GetboxAll();
               }
               this.GetboxAll();
           }
       }

       //初始化所有广告位
       GetboxAll() {
           let newList;
           let htURL = 'data/advertising';
           var xhr = new Laya.HttpRequest();
           var date = {

           };
           xhr.http.timeout = 10000; //设置超时时间；
           xhr.once(Laya.Event.COMPLETE, this, getCfgOk);
           xhr.once(Laya.Event.ERROR, this, getCfgError);
           var url2 = 'https://www.menguoli.com/' + htURL + '/';
           xhr.send(url2, date, "GET", "json");
           function getCfgOk(res) {
               console.log("===========success");
               console.log("加载广告成功");
               let dataArr = res.results;
               let tempArr = [];

               for (let i = 0; i < dataArr.length; i++) {
                   let obj = dataArr[i];
                   let tmp = {
                       advid: i,
                       appid: obj.appid,
                       content: "",
                       curimage: null, effected: "", efftype: "0", id: "34825" + i, locationid: "418" + i,
                       logo: obj.logo,
                       softid: "70" + i, sort: "1", title: obj.title, url: ""
                   };
                   tempArr.push(tmp);
               };
               newList = tempArr;
               window.boxInfo = [];
               for (let index = 0; index < 5; index++) {
                   window.boxInfo.push(newList);
               }
               window.isGGOver = false;
               window.totalNum = window.boxInfo.length;
               window.ggNum = 0;
               for (let index = 0; index < window.boxInfo.length; index++) {
                   this.GGAddLoad();
               }

           }
           function getCfgError(res) {
               console.log("===========errrrr");
               console.log("加载广告失败");
           }


       }
       //初始化所有广告位
       GetboxAll0() {
           window.boxinfo_id = [{

               id: 465
           }, //小全导 0
           {
               id: 464
           }, //大全导 1
           {
               id: 463
           },//成功 失败 2
           {
               id: 462
           }, //首页左右弹窗 3
           {
               id: 461
           }, //弹窗 4
           {
               id: 460
           }//好友都在玩轮播 5
           ];



           // window.boxInfo = [];
           // window.boxInfo[0] = new Array();
           // window.boxInfo[1] = new Array();
           // window.boxInfo[2] = new Array();
           // window.boxInfo[3] = new Array();
           // window.boxInfo[4] = new Array();
           // window.boxInfo[5] = new Array();

           window.isGGOver = false;
           window.totalNum = window.boxinfo_id.length;
           window.ggNum = 0;

           for (var a = 0; a < window.boxinfo_id.length; a++) {
               this.boxGetConfig2(window.boxinfo_id[a].id, a);
           }
       }
       GetboxAll111() {
           let newList = [
               { advid: 368, appid: "wxcb2080af76540be7", content: "", curimage: null, effected: "", efftype: "0", id: "34825", locationid: "418", logo: "logo/qiangdandan.jpg", softid: "70", sort: "1", title: "快抢蛋蛋", url: "" },
               { advid: 369, appid: "wx637e0c7c27974fa5", content: "", curimage: null, effected: "", efftype: "0", id: "34826", locationid: "419", logo: "logo/konglong.png", softid: "71", sort: "1", title: "恐龙大乱斗", url: "" },
               { advid: 370, appid: "wxc673556ea68a4924", content: "", curimage: null, effected: "", efftype: "0", id: "34827", locationid: "420", logo: "logo/juntuan.jpg", softid: "72", sort: "1", title: "萌果军团", url: "" },
               { advid: 371, appid: "wx041df19a8de64f95", content: "", curimage: null, effected: "", efftype: "0", id: "34828", locationid: "421", logo: "logo/mengdong.jpg", softid: "73", sort: "1", title: "萌动", url: "" },
               { advid: 372, appid: "wxa4f81e107b0d2c25", content: "", curimage: null, effected: "", efftype: "0", id: "34829", locationid: "422", logo: "logo/yiyi.jpg", softid: "74", sort: "1", title: "萌上忆忆", url: "" },
               { advid: 373, appid: "wx782088da8509d45b", content: "", curimage: null, effected: "", efftype: "0", id: "34830", locationid: "423", logo: "logo/xuanzhuan.jpg", softid: "75", sort: "1", title: "萌萌旋转", url: "" },
               { advid: 374, appid: "wx1f689beb3861ed96", content: "", curimage: null, effected: "", efftype: "0", id: "34831", locationid: "424", logo: "logo/huahua.jpg", softid: "76", sort: "1", title: "萌游爱画画", url: "" },
               { advid: 375, appid: "wx8311ca8af8673ab2", content: "", curimage: null, effected: "", efftype: "0", id: "34832", locationid: "425", logo: "logo/menghaijing.jpg", softid: "77", sort: "1", title: "萌海经", url: "" },
               { advid: 370, appid: "wxc673556ea68a4924", content: "", curimage: null, effected: "", efftype: "0", id: "34827", locationid: "420", logo: "logo/xiaochu.png", softid: "72", sort: "1", title: "萌上爱消除", url: "" },
               { advid: 369, appid: "wx637e0c7c27974fa5", content: "", curimage: null, effected: "", efftype: "0", id: "34828", locationid: "421", logo: "logo/konglong.png", softid: "71", sort: "1", title: "恐龙大乱斗", url: "" },
               { advid: 372, appid: "wxa4f81e107b0d2c25", content: "", curimage: null, effected: "", efftype: "0", id: "34829", locationid: "422", logo: "logo/yiyi.jpg", softid: "74", sort: "1", title: "萌上忆忆", url: "" },
               { advid: 373, appid: "wx782088da8509d45b", content: "", curimage: null, effected: "", efftype: "0", id: "34830", locationid: "423", logo: "logo/xuanzhuan.jpg", softid: "75", sort: "1", title: "萌萌旋转", url: "" },
               { advid: 370, appid: "wxc673556ea68a4924", content: "", curimage: null, effected: "", efftype: "0", id: "34831", locationid: "424", logo: "logo/xiaochu.png", softid: "72", sort: "1", title: "萌上爱消除", url: "" },
               { advid: 375, appid: "wx8311ca8af8673ab2", content: "", curimage: null, effected: "", efftype: "0", id: "34832", locationid: "425", logo: "logo/menghaijing.jpg", softid: "77", sort: "1", title: "萌海经", url: "" }
           ];
           window.boxInfo = [];
           for (let index = 0; index < 5; index++) {
               window.boxInfo.push(newList);
           }


           window.isGGOver = false;
           window.totalNum = window.boxInfo.length;
           window.ggNum = 0;
           for (let index = 0; index < window.boxInfo.length; index++) {
               this.GGAddLoad();
           }

       }


       GGAddLoad() {
           window.ggNum++;
           window.isGGOver = window.ggNum >= window.totalNum;
       }
       /**
       * 获取对应广告Id boxinfo
       * @param {*} id 广告Id
       * @param {*} boxindex  下标
       */
       boxGetConfig2(id, boxindex) {
           var xhr = new Laya.HttpRequest();
           var date = {
               softid: GameGGConfig.appid,
               locationid: id
           };
           date = this.PinJie_Fun(date);
           xhr.http.timeout = 10000; //设置超时时间；
           xhr.once(Laya.Event.COMPLETE, this, getCfgOk);
           xhr.once(Laya.Event.ERROR, this, getCfgError);
           xhr.send(window.serverBox + "/v1.1/api/getAdv.html", date, "POST", "application/x-www-form-urlencoded");

           function getCfgError(data) { //失败回调

           }

           function getCfgOk(res) { //成功回调
               window.boxInfo[boxindex] = JSON.parse(res).result;
               if (this.BoxSetList["key" + boxindex.toString()] != undefined) {
                   this.BoxSetList["key" + boxindex.toString()].run();
                   delete this.BoxSetList["key" + boxindex.toString()];
               }
               GameFIG_this.GGAddLoad();
           }
       }
       /**特殊设置box */
       SetBoxOneOne(node, boxid, TfOpenBanner = false) {
           this.Randshuzhu(window.boxInfo[boxid]);
           var length = node.numChildren;
           if (window.boxInfo[boxid].length < length) {
               length = window.boxInfo[boxid].length;
           }
           for (var a = 0; a < length; a++) {
               let ggTexture;
               let logo = window.boxInfo[boxid][a].logo;
               if (Array.isArray(logo)) {
                   ggTexture = logo[this.GetRandNub(0, logo.length - 1)];
               } else {
                   ggTexture = logo;
               }
               node.getChildAt(a).texture = ggTexture;//window.boxInfo[boxid][a].logo;
               this.butTween(node.getChildAt(a), Laya.Handler.create(this, this.GoGame, [window.boxInfo[boxid][a].appid, window.boxInfo[boxid][a].path, window.boxInfo[boxid][a].locationid, window.boxInfo[boxid][a].id, this.OverQuanDao.bind(this), TfOpenBanner]), false);
           }
       }

       /**
      * 外部设置广告
      * @param {Laya.Handler} SetHander 设置函数
      * @param {*} boxindex 盒子广告ID 
      */
       SetGameBox(SetHander, boxindex) {
           if (window.boxInfo[boxindex] != undefined && window.boxInfo[boxindex] != "" && window.boxInfo[boxindex] != null) {
               SetHander.run();
           } else {
               this.BoxSetList["key" + boxindex.toString()] = SetHander;
           }
       }

       //设置对应box
       Setboxall(boxindex) {
           switch (boxindex) {

               case 0: //全导
                   this.SetListJS(window.mythis.guanggao_list, 2, this.OverQuanDao.bind(this), false, 2, false, boxindex, "none", 1500); //主界面List
                   break;
               case 1: //失败 
                   this.SetListJS(window.mythis.fail_list, 1, this.OverQuanDao.bind(this), true, 6, false, boxindex, true);
                   break;
               case 2: //成功
                   this.SetListJS(window.mythis.success_list, 1, this.OverQuanDao.bind(this), true, 6, false, boxindex, true); //主界面List
                   break;
               case 3: //选择关卡 游戏中 道具页浮
                   this.SetOnceBOX(window.mythis.GG1, 5000, boxindex, false, true);
                   this.SetOnceBOX(window.mythis.GG2, 5000, boxindex, false, true);
                   this.SetOnceBOX(window.mythis.GG3, 5000, boxindex, false, true);
                   this.SetOnceBOX(window.mythis.GG4, 5000, boxindex, false, true);

                   this.SetOnceBOX(window.mythis.zt_gg1, 5000, boxindex, false, true);
                   this.SetOnceBOX(window.mythis.zt_gg2, 5000, boxindex, false, true);
                   this.SetOnceBOX(window.mythis.zt_gg3, 5000, boxindex, false, true);
                   this.SetOnceBOX(window.mythis.zt_gg4, 5000, boxindex, false, true);

                   this.SetOnceBOX(window.mythis.ZjGG1, 5000, boxindex, true, false);
                   this.SetOnceBOX(window.mythis.ZjGG2, 5000, boxindex, true, false);
                   // this.SetGameBox(this.daochu_list, boxindex, 4, 3, '无其他操作');
                   break;
               case 4: //选择关卡下面轮
                   this.SetListJS(window.mythis.ZjM_list, 1, this.OverQuanDao.bind(this), true, 5, false, boxindex, false);
                   this.SetOpenCloseRunlist(window.mythis.ZjM_list, true);
                   break;
               case 5: //小全导
                   this.SetListJS(window.mythis.guanggao_list2, 2, undefined, true, 5, false, boxindex, "none", 1500); //主界面List
                   break;
           }
       }



       /**
        * json转字符串拼接 上传数据专用
        * @param {*} date 传入Json类型data{a:b,c:d} 
        * @param retrue--拼接字符串  "a=b&c=d"
        */
       PinJie_Fun(date) {
           var newDate = "";
           for (var index in date) {
               newDate += index + "=" + date[index] + "&";
           }
           newDate = newDate.substr(0, newDate.length - 1);
           return newDate;
       }
       /**
        * 游戏盒子数据上传 微信线上
        * @param {*} appid 广告appid
        * @param {*} locationid 广告位id
        * @param {*} id 广告id
        */
       boxShangChuan_WX(appid, locationid, id) {
           var xhr = new Laya.HttpRequest();
           var date = {
               softid: GameGGConfig.appid,
               uid: GameFIG_this.Player.playerConfig.openid,
               advid: appid,
               locationid: locationid,
               id: id
           };
           date = GameFIG_this.PinJie_Fun(date);
           xhr.http.timeout = 10000; //设置超时时间；
           xhr.once(Laya.Event.COMPLETE, GameFIG_this, getCfgOk);
           xhr.once(Laya.Event.ERROR, GameFIG_this, getCfgError);
           xhr.send(window.serverBox + "/v1.1/api/userclick.html", date, "POST", "application/x-www-form-urlencoded");

           function getCfgError(data) { //失败回调

           }

           function getCfgOk(res) { //成功回调
               console.log("数据上报成功");
           }


       }
       /**
        * 游戏盒子数据上传 确认前 微信线上
        * @param {*} appid 广告appid
        * @param {*} locationid 当前广告位id
        * @param {*} id  当前广告id
        */
       boxShangChuan_WX_first(appid, locationid, id) {
           var xhr = new Laya.HttpRequest();
           var date = {
               softid: GameGGConfig.appid,
               uid: GameFIG_this.Player.playerConfig.openid,
               advid: appid,
               locationid: locationid,
               id: id
           };
           date = GameFIG_this.PinJie_Fun(date);
           xhr.http.timeout = 10000; //设置超时时间；
           xhr.once(Laya.Event.COMPLETE, GameFIG_this, getCfgOk);
           xhr.once(Laya.Event.ERROR, GameFIG_this, getCfgError);
           xhr.send(window.serverBox + "/v1.1/api/userpreclick.html", date, "POST", "application/x-www-form-urlencoded");

           function getCfgError(data) { //失败回调

           }

           function getCfgOk(res) { //成功回调
               console.log("数据上报成功");
           }


       }
       /**
        * 两时间差,retrue 秒
        * @param {*Date} time1 
        * @param {*Date} time2 
        */
       TimeCha(time1, time2) {
           if (time1 == undefined || time2 == undefined) {
               return 0;
           }
           var time = parseInt((Date.parse(time1) - Date.parse(time2)) / 1000);
           if (time < 0) {
               time *= -1;
           }
           return time;
       }
       /**
        * 玩家停留
        */
       BUY_people_StopMsg() {
           // window.P_key = '?key=68bafba4ce';
           var xhr = new Laya.HttpRequest();
           var date = {
               appid: GameGGConfig.appid,
               openid: window.P_buyPeople_Openid,
               posttime: Math.floor(new Date().getTime() / 1000),
               time: GameFIG_this.TimeCha(new Date(), window.P_RunTime_time)
           };

           date = GameFIG_this.PinJie_Fun(date);
           xhr.http.timeout = 10000; //设置超时时间；
           xhr.once(Laya.Event.COMPLETE, GameFIG_this, getCfgOk);
           xhr.once(Laya.Event.ERROR, GameFIG_this, getCfgError);
           xhr.send(window.serverBUY + "/v1.1/api/Activity/stay.html", date, "POST", "application/x-www-form-urlencoded");

           function getCfgError(data) { //失败回调

           }

           function getCfgOk(res) { //成功回调

           }



       }

       /**
        * 授权数据
        */
       BUY_people_shouQuan() {
           // window.P_key = '?key=68bafba4ce';
           if (window.P_buyPeople_Openid == undefined) {
               window.P_buyPeople_Openid = "";
           }
           var xhr = new Laya.HttpRequest();
           var date = {
               appid: GameGGConfig.appid,
               openid: window.P_buyPeople_Openid,
               posttime: Math.floor(new Date().getTime() / 1000),
           };
           date = GameFIG_this.PinJie_Fun(date);
           xhr.http.timeout = 10000; //设置超时时间；
           xhr.once(Laya.Event.COMPLETE, this, getCfgOk);
           xhr.once(Laya.Event.ERROR, this, getCfgError);
           xhr.send(window.serverBUY + "/v1.1/api/Activity/auth.html", date, "POST", "application/x-www-form-urlencoded");

           function getCfgError(data) { //失败回调

           }

           function getCfgOk(res) { //成功回调

           }
       }
       /**
        * 首次从别的游戏进入
        */
       BUY_people_init() {
           var xhr = new Laya.HttpRequest();
           var date = {
               appid: GameGGConfig.appid,
               posttime: Math.floor(new Date().getTime() / 1000),
               auth: 0,
               wxopenid: GameFIG_this.Player.playerConfig.openid,
           };
           if (window.P_key != undefined) {
               if (window.P_key.key != undefined) {
                   date["key"] = window.P_key.key;
               }
           }
           if (window.P_GotoFromAppid != undefined) {
               date["fromapp"] = window.P_GotoFromAppid;
           }
           date = GameFIG_this.PinJie_Fun(date);
           xhr.http.timeout = 10000; //设置超时时间；
           xhr.once(Laya.Event.COMPLETE, GameFIG_this, getCfgOk);
           xhr.once(Laya.Event.ERROR, GameFIG_this, getCfgError);
           xhr.send(window.serverBUY + "/v1.1/api/Activity/uclick.html", date, "POST", "application/x-www-form-urlencoded");

           function getCfgError(data) { //失败回调

           }

           function getCfgOk(res) { //成功回调
               if (JSON.parse(res).Result) {
                   if (JSON.parse(res).Result.OpenId == undefined) {
                       window.P_buyPeople_Openid = "";
                   } else {
                       window.P_buyPeople_Openid = JSON.parse(res).Result.OpenId;
                   }
               }
               GameFIG_this.saveLocalData("P_buyPeople_Openid", {
                   id: window.P_buyPeople_Openid
               });
           }
       }
       //--------------------------------------------------


       //---其他工具
       /**
       * 设置图片边缘发光滤镜
       * @param {*} node 节点
       * @param {*} color 颜色 “#fffff”
       * @param {*} width 宽度默认5
       * @ ---尽量不要每帧调用 耗费性能
       */
       static SetFilterGlow(node, color, width = 5) {
           var glowFilter = new Laya.GlowFilter(color, width, 0, 0);
           //设置滤镜集合为发光滤镜
           node.filters = [glowFilter];
       }
       /**
       * 设置图片颜色滤镜 
       * @ ---尽量不要每帧调用 耗费性能
       */
       static SetColorFilterRnd() {
           var colorMatrix = [];
           for (var a = 0; a < 20; a++) {
               colorMatrix.push(GameGIF.GetRandNub(0, 1));
           }
           var redFilter = new Laya.ColorFilter(colorMatrix);
           return redFilter;
       }
       /**
           * 微信数据上报 监听数据量 比如ID:"游戏结束获取金币" nub:100  
           * @param {string } ID 监控ID
           * @param {number } nub 上报数值
           */
       WxReportMonitor(ID = "游戏结束获取金币", nub = 1) {
           if (wx) {
               wx.reportMonitor(ID, nub);
           }

       }
       /**
        * 设置微信游戏圈
        * @param {Number} x x 左上角X Laya比例
        * @param {Number} y y 左上角Y Laya比例
        * @param {Number} w 宽  Laya比例
        * @param {Number} h 高 Laya比例
        * @param {string} image 背景图Url
        * @param {string} icon   green绿色的图标 white白色的图标 dark有黑色圆角背景的白色图标 light有白色圆角背景的绿色图标
        * @param return 微信游戏圈按钮 .hide()隐藏 .show()显示 .onTap(fun)监听点击 .offTap(fun)取消监听电脑
        * */
       WxCreatGameQuan(x = 0, y = 0, w = 0, h = 0, image = "", icon = "green") {
           if (wx) {
               return wx.createGameClubButton({
                   type: "image",
                   icon: 'green',
                   image: "",
                   style: {
                       left: x / GameConfig.InitFBL.width * wx.getSystemInfoSync().windowWidth,
                       top: y / GameConfig.InitFBL.height * wx.getSystemInfoSync().windowHeight,
                       width: w / GameConfig.InitFBL.width * wx.getSystemInfoSync().windowWidth,
                       height: h / GameConfig.InitFBL.height * wx.getSystemInfoSync().windowHeight
                   }
               })
           }

       }
       /**
        * 微信订阅授权弹窗 订阅ID
        * @param {string[]} tmplIds 
        */
       WxDingYueTongzhi(tmplIds = [""]) {
           if (wx) {
               wx.requestSubscribeMessage({
                   tmplIds: tmplIds,
                   success(res) {
                       console.log("消息订阅成功回调", res);

                   },
                   fail(res) {
                       console.log("消息订阅失败回调", res);
                   }
               });
           }

       }
       /**
        * 微信授权接口
        * @param {Number} ShouQuanID 授权ID 0用户信息 1用户地理位置 2用户微信运动 3用户保存照片
        * @param {Laya.Handler} okHnader 成功回调
        * @param {Laya.Handler} fail_Hander 失败回调
        */
       wxShouQuan(ShouQuanID, okHnader, fail_Hander) {
           if (wx) {
               var ShouQuanArr = [
                   "scope.userInfo",
                   "scope.userLocation",
                   "scope.werun",
                   "scope.writePhotosAlbum"
               ];
               // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
               wx.getSetting({
                   success(res) {
                       if (!res.authSetting[ShouQuanArr[ShouQuanID]]) {
                           wx.authorize({
                               scope: ShouQuanArr[ShouQuanID],
                               success() {
                                   okHnader.run();
                               },
                               fail() {
                                   fail_Hander.run();
                               }
                           });
                       } else {
                           okHnader.run();
                       }
                   }
               });
           } else {
               fail_Hander.run();
           }
       }
       /**
        * 保存图片到本机相册接口
        * @param {String} filePath 本地路径，不支持网络路径
        * @param {Laya.Handler} okHnader 成功回调
        * @param {Laya.Handler} fail_Hander 失败回调
        */
       WXSaveImage(filePath, okHnader, fail_Hander) {
           if (wx) {
               wx.saveImageToPhotosAlbum({
                   filePath: filePath,
                   success() {
                       okHnader.run();
                   },
                   fail() {
                       fail_Hander.run();
                   }
               });
           } else {
               fail_Hander.run();
           }
       }
   }
   // export default class GameFIG_MGG extends GameFIG {

   //     constructor() {
   //         super();

   //     }
   //     /**单例获取 */
   //     static Get() {
   //         if (GameFIG_this == undefined) {
   //             GameFIG_this = new GameFIG_MGG();
   //         }
   //         return GameFIG_this;
   //     }
   //     /**
   //       *  广告入口  请务必在主脚本第一时间调用
   //       * @param {Laya.Handler} LoginHander  登录成功回调
   //       * @param {Laya.Handler} InitHander  初始信息成功回调 附带返回参数
   //       */
   //     Main_Use(LoginHander, InitHander) {
   //         // LoginHander.run();

   //         // return;
   //         window.begintime = Math.floor(new Date().getTime() / 1000);//游戏开始时间
   //         var hander = undefined;
   //         if (wx) {//走服务器登录流程---登录微信--获取真实code---获取玩家注册信息--
   //             hander = Laya.Handler.create(this, function (success, data) {
   //                 GameFIG_this.Player.playerConfig = data;
   //                 success.run();
   //             }, [LoginHander])
   //         } else {
   //             if (GameFIG_this.fetchLocalData(GameConfig.GameName + GameConfig.banbenID)) {
   //                 GameFIG_this.Player.playerConfig = GameFIG_this.fetchLocalData(GameConfig.GameName + GameConfig.banbenID);
   //                 LoginHander.run();
   //             } else {
   //                 LoginHander.run();
   //             }

   //         }
   //         this.Login(hander);//游动西服务器登录逻辑接口 适当修改
   //         this.SetCanLet();//游动西游戏盒子接口  适当关闭
   //         this.GameBegin();
   //         this.getServerConfig(InitHander);
   //     }
   //     /**获取真实id */
   //     getcode(code) {
   //         wx.request({
   //             method: "POST",
   //             url: window.serverUrlPre + "/wx_login/",
   //             header: {
   //                 'content-type': 'application/json',
   //             },
   //             data: {
   //                 "name": GameConfig.GameName,
   //                 "code": code,
   //             },
   //             dataType: "json",
   //             success: function (res) {

   //                 var resdate = res.data;
   //                 GameFIG_this.Player.playerConfig.openid = resdate.user.openid;
   //                 GameFIG_this.Player.sessid = resdate.user.session_key;
   //                 GameFIG_this.Player.jwt = "Bearer " + resdate.jwt;
   //                 window.FistrUpdate = false;
   //                 GameFIG_this.getplayer(); //获取用户信息

   //                 var Allmsg = wx.getLaunchOptionsSync();
   //                 console.log(Allmsg);
   //                 if (GameFIG_this.fetchLocalData("P_buyPeople_Openid") != undefined) {
   //                     window.P_buyPeople_Openid = GameFIG_this.fetchLocalData("P_buyPeople_Openid").id;
   //                 }
   //                 if (Allmsg.query != undefined && Allmsg.query != null & Allmsg.query != "") {
   //                     window.P_key = Allmsg.query;
   //                     window.P_GotoFromAppid = Allmsg.referrerInfo.appId;
   //                     GameFIG_this.BUY_people_init();

   //                 }
   //             },

   //             fail: function () {
   //                 GameFIG_this.LoadSuccess_Fun.runWith(GameFIG_this.Player.playerConfig);
   //             }

   //         })

   //     }
   //     /**获取用户注册信息 */
   //     getplayer() {
   //         wx.request({
   //             method: "POST",
   //             url: window.serverUrlPre + "/gameInfo/",
   //             header: {
   //                 'content-type': 'application/json',
   //                 "Authorization": GameFIG_this.Player.jwt,
   //             },
   //             data: {
   //                 "name": GameConfig.GameName,
   //             },
   //             success: function (res) {
   //                 var resdate = res.data;
   //                 if (window.FistrUpdate == false) {
   //                     if (resdate.Sgin == GameConfig.banbenID) {
   //                         console.log("已注册");
   //                         GameFIG_this.Player.playerConfig = resdate;
   //                         if (GameFIG_this.LoadSuccess_Fun != undefined) {
   //                             GameFIG_this.LoadSuccess_Fun.runWith(resdate);
   //                         }
   //                     } else { //未注册
   //                         console.log("未注册");
   //                         GameFIG_this.UpdatePlayerMsg();
   //                         if (GameFIG_this.LoadSuccess_Fun != undefined) {
   //                             GameFIG_this.LoadSuccess_Fun.runWith(GameFIG_this.Player.playerConfig);
   //                         }
   //                     }
   //                     window.FistrUpdate = true;


   //                 }

   //             },

   //             fail: function () { }

   //         })
   //     }
   //     /**
   //      * 更新玩家数据至服务器 需要sessid
   //      */
   //     UpdatePlayerMsg() {

   //         var data2 = JSON.stringify(GameFIG_this.Player.playerConfig);
   //         var header = {
   //             'content-type': 'application/json',
   //             "Authorization": GameFIG_this.Player.jwt
   //         };
   //         if (wx)
   //             wx.request({
   //                 url: window.serverUrlPre + "/gameInfo/",
   //                 method: "PUT",
   //                 header: header,
   //                 data: {
   //                     "gameInfo_value": data2,
   //                     "name": GameConfig.GameName,
   //                 },
   //                 success(res) {
   //                     console.log("玩家数据上传成功");
   //                 },
   //                 complete(res) {

   //                 }
   //             })
   //         GameFIG_this.saveLocalData(GameConfig.GameName + GameConfig.banbenID, GameFIG_this.Player.playerConfig);


   //     }
   //     /**获取游戏网络配置信息 */
   //     getServerConfig(InitHander) {
   //         var data = {}
   //         var xhr = new Laya.HttpRequest();
   //         xhr.http.timeout = 10000; //设置超时时间；
   //         xhr.once(Laya.Event.COMPLETE, this, getCfgOk);
   //         xhr.once(Laya.Event.ERROR, this, getCfgError);
   //         xhr.send(window.serverUrlPre + "data/apps/", "", "GET", "application/x-www-form-urlencoded");

   //         function getCfgError(data) { //失败回调
   //             console.log(data);
   //         }

   //         function getCfgOk(res) { //成功回调
   //             var resdate = JSON.parse(res).result;
   //             if (resdate.share.length > 0) {
   //                 window.shareInfo = resdate.share;
   //                 this.GetGameInitConfig();
   //             }
   //             window.Config = resdate.config;
   //             InitHander.runWith(res);

   //         }


   //     }
   //     /**
   //      * 获取游戏排行榜_MGG
   //      * @param {string} cod 获取需要排序的玩家信息字段
   //      * @param {string} As_ds as正序 ds反序
   //      * @param {Number} num 获取数量
   //      * @param {Laya.Handler} success 成功回调 返回参数info 用户信息数组
   //      */
   //     GetPhb_MGG(cod = "MD", As_ds = "as", num = 100, successHander) {
   //         var header = {
   //             'content-type': 'application/x-www-form-urlencoded',
   //             "Authorization": GameFIG_this.Player.jwt
   //         };
   //         if (wx)
   //             wx.request({
   //                 url: window.serverUrlPre + "/rank.html",
   //                 method: "POST",
   //                 header: header,
   //                 data: {
   //                     "name": GameConfig.GameName,
   //                     "cod": cod,
   //                     "As_ds": As_ds,
   //                     "num": num,
   //                 },
   //                 success(res) {
   //                     console.log("获取排行榜成功");
   //                     successHander.runWith(res.info);
   //                 },
   //                 complete(res) {

   //                 }
   //             })

   //     }
   //     /**
   //      * 获取签到信息
   //      * @param {Laya.Handler} okHnader 成功回调 
   //      * @param {Laya.Handler} faliHander  失败回调
   //      */
   //     GetQD_MGG(okHnader, faliHander) {
   //         var header = {
   //             'content-type': 'application/x-www-form-urlencoded',
   //             "Authorization": GameFIG_this.Player.jwt
   //         };
   //         if (wx) {
   //             wx.request({
   //                 url: window.serverUrlPre + "/sign/",
   //                 method: "POST",
   //                 header: header,
   //                 data: {
   //                     "name": GameConfig.GameName,
   //                 },
   //                 success(res) {
   //                     console.log("获取排行榜成功");
   //                     okHnader.runWith(res.time);
   //                 },
   //                 complete(res) {
   //                     faliHander.run();
   //                 }
   //             })
   //         } else {
   //             faliHander.run();
   //         }

   //     }
   //     /**
   //      * 通过文本获取声音文件
   //      * @param {*} name 文本名字
   //      * @param {*} text 文本内容
   //      * @param {Laya.Handler} okHnader 成功回调 返回参数 voice_url
   //      * @param {Laya.Handler} faliHander 失败回调 
   //      */
   //     GetYXbyText(name, text = "", okHnader, faliHander) {
   //         var header = {
   //             'content-type': 'application/x-www-form-urlencoded',
   //             "Authorization": GameFIG_this.Player.jwt
   //         };
   //         if (wx) {
   //             wx.request({
   //                 url: window.serverUrlPre + "/sign/",
   //                 method: "POST",
   //                 header: header,
   //                 data: {
   //                     "name": name,
   //                     "text": text,
   //                     //"human":human 可选
   //                 },
   //                 success(res) {
   //                     console.log("获取音乐文件成功");
   //                     okHnader.runWith(res.voice_url);
   //                 },
   //                 complete(res) {
   //                     faliHander.run();
   //                 }
   //             })
   //         } else {
   //             faliHander.run();
   //         }

   //     }
   //     /**
   //      * 学习完成上传
   //      * @param {*} studyID 知识ID 
   //      */
   //     UpdateStudy(studyID) {
   //         var header = {
   //             'content-type': 'application/x-www-form-urlencoded',
   //             "Authorization": GameFIG_this.Player.jwt
   //         };
   //         if (wx)
   //             wx.request({
   //                 url: window.serverUrlPre + "/knowlage/",
   //                 method: "POST",
   //                 header: header,
   //                 data: {
   //                     "name": GameConfig.GameName,
   //                     "id": studyID
   //                 },
   //                 success(res) {
   //                     console.log("知识学习上传成功");

   //                 },
   //                 complete(res) {
   //                     console.log("知识学习上传失败", res);
   //                 }
   //             })
   //     }
   //     /**
   //      * 获取知识
   //      * @param {Boolean} isnew  是否新知识 否则返回所有已学习知识
   //      *  @param {Laya.Hander} okHnader  成功回调 回调res knowlage==null是已经学习完所有 无法获取新知识
   //      * @param {Laya.Hander} faliHander  失败回调
   //      */
   //     GetStudu(isnew, okHnader, faliHander) {
   //         var header = {
   //             'content-type': 'application/x-www-form-urlencoded',
   //             "Authorization": GameFIG_this.Player.jwt
   //         };
   //         var data;
   //         if (isnew) {
   //             data = {
   //                 "name": GameConfig.GameName,
   //             }
   //         } else {
   //             data = {
   //                 "name": GameConfig.GameName,
   //                 "over": "true"
   //             }
   //         }
   //         if (wx) {
   //             wx.request({
   //                 url: window.serverUrlPre + "/knowlage.html",
   //                 method: "POST",
   //                 header: header,
   //                 data: data,
   //                 success(res) {
   //                     console.log("知识获取成功");
   //                     okHnader.runWith(res);
   //                 },
   //                 fail(res) {
   //                     console.log("知识获取成功", res);
   //                     faliHander.runWith(res);
   //                 }
   //             })
   //         } else {
   //             faliHander.runWith();
   //         }

   //     }

   //     /**
   //      * 爱分享接口
   //      * @param {*} img 图片 字符串形 
   //      * @param {*} text 知识详细介绍
   //      * @param {*} level 知识等级
   //      * @param {*} title 标题
   //      * @param {Laya.Handler} okHnader 成功回调
   //      *  @param {Laya.Handler} failHnader 失败回调
   //      */
   //     LoveFenXiang(img, text, level = 0, title, okHnader, failHnader) {
   //         var header = {
   //             'content-type': 'application/x-www-form-urlencoded',
   //             "Authorization": GameFIG_this.Player.jwt,
   //             "img": img,
   //             "text": text,
   //             "level": level,
   //             "title": title
   //         };
   //         var data;
   //         if (isnew) {
   //             data = {
   //                 "name": GameConfig.GameName,
   //             }
   //         } else {
   //             data = {
   //                 "img": GameConfig.GameName,
   //                 "text": "true",
   //                 "level": ""
   //             }
   //         }
   //         if (wx) {
   //             wx.request({
   //                 url: window.serverUrlPre + "/knowlage/",
   //                 method: "POST",
   //                 header: header,
   //                 data: data,
   //                 success(res) {
   //                     console.log("知识分享成功");
   //                     okHnader.run();
   //                 },
   //                 complete(res) {
   //                     console.log("知识分享失败", res);
   //                     failHnader.run();
   //                 }
   //             })
   //         } else {
   //             failHnader.run();
   //         }


   //     }


   // }

   if (false) {
       var FIG = new GameFIG();
   } else {
       var FIG = GameFIG.Get();

   }

   class DQDView extends Laya.Scene {
       constructor() {
           super();

       }

       onEnable() {
           this.DQDList.vScrollBarSkin = "";
           this.UIMMP();
           this.Addbut();

       }

       UIMMP() {
           this.height = Laya.stage.height;
           // this.DQDList.height = 1230 / 1334 * Laya.stage.height;
           this.nodeUI = [
               { node: this.DQDJiXu, y: 1241 }
           ];
           // this.DQDList.pivot(this.DQDList.width / 2, this.DQDList.height / 2);


           for (let i = 0; i < this.nodeUI.length; i++) {
               this.nodeUI[i].node.y = this.nodeUI[i].y / 1334 * Laya.stage.height;
           }

           FIG.SetGameBox(Laya.Handler.create(this, function () {
               FIG.SetListJS(this.DQDList, 2, FIG.OverQuanDao.bind(FIG), false, 3, false, 1, "none", 1500);
               FIG.SetOpenCloseRunlist(this.DQDList, true);
           }), 1);
       }


       Addbut() {
           FIG.butTween(this.DQDJiXu, Laya.Handler.create(this, this.OnClickJiXuBtn, [], false));

       }

       OnClickJiXuBtn() {
           this.CloseDQD();
       }

       CloseDQD() {
           if (this.closeHandler) {
               this.closeHandler.run();
           }
           this.close();
       }

       onOpened(res) {
           this.closeHandler = res.Handler;
       }

       onClosed() {
           FIG.SetOpenCloseRunlist(this.DQDList, false);
       }

   }

   class EnemyPengZhuang extends Laya.Script {
       constructor() {
           super();

       }
       onStart() {
           this.rig = this.owner.getComponent(Laya.RigidBody);
           this.time = 500;
           this.num = 0;
           this.donghua0 = window.GameUI_this.loadDongHua(4);//受到玩家伙伴攻击的特效
           this.donghua0.on(Laya.Event.COMPLETE, this, function () {
               this.donghua0.visible = false;
           });
           if (this.owner.MSG.tag == "enemy") {
               this.EnemyScale();
           }
           this.isjitui = false;//是否被击退
           this.owner.isDestory = false; //是否死亡

           this.attackTeXiao = window.GameUI_this.loadDongHua(6);//受到玩家攻击的动画

       }
       onTriggerEnter(other) {
           if (this.owner.isDestory) { return }
           if (window.GameUI_this.isStop) { return; }//游戏暂停关闭碰撞检测
           if (other.owner == null) {
               // console.log(other.owner)
               return;
           }

           if (other.owner.MSG == undefined) {
               return;
           }
           if (other.owner.MSG.tag == "wall" && this.owner.MSG.tag != "gold" && this.owner.MSG.tag != "boss") {//碰到墙
               if (this.owner.MSG.NoFirst) {//是否为第一次撞墙
                   //转向
                   window.GameUI_this.Turn(this.owner, other.owner.MSG.normal);

               }
               // this.owner.MSG.NoFirst = true;
           }
           if (other.owner.MSG.tag == "knife0") {//受到外圈刀伤害
               if (this.owner.MSG.tag == "enemy") {

                   // this.time = 100;
                   var speed = { x: this.owner.forward.x / 2, y: this.owner.forward.y / 2 };
                   this.rig.setVelocity(speed);
               }

               this.attackTeXiao.visible = true;
               this.attackTeXiao.play(0, true);
               this.attackTeXiao.pos(this.owner.x, this.owner.y);//设置攻击特效的位置
               //玩家到敌人之间的向量
               var vec = {
                   x: window.GameUI_this.curPlayer.x - this.owner.x,
                   y: window.GameUI_this.curPlayer.y - this.owner.y
               };
               var offest = 90 - window.GameUI_this.GetAngle(vec, { x: 1, y: 0 });//攻击特效偏转角度
               if (vec.y > 0) {
                   offest *= -1;
               }
               this.attackTeXiao.rotation = offest;//攻击特效旋转
               // if (!this.isjitui) {
               //     if (this.owner.MSG.tag == "enemy") {
               //         this.JiTui(0.2);//击退
               //         this.isjitui = true;
               //         Laya.timer.once(500, this, function () {
               //             this.isjitui = false;
               //         })
               //     }
               // }
               if (this.owner.MSG.tag == "enemy") {
                   Laya.Tween.clearAll(this.owner.getChildAt(0));
                   this.DamageAni1();//受伤tween动画
               }

               this.isAttackRange = true;
               Laya.timer.loop(1000 / window.player.outerKnife_speed, this, this.damage, [this.owner, other.owner.MSG.Attack, other.owner.MSG], false);
           }


           if (other.owner.MSG.tag == "knife1") {//受到内圈刀伤害
               // this.isAttackRange = true;
               // Laya.timer.loop(1000 / window.player.lnnerKnife_speed, this.owner, this.damage, [this.owner, other.owner.MSG.Attack, other.owner.MSG], false)
           }


           if (other.owner.MSG.tag == "skill") {//受到技能伤害

               this.donghua0.visible = true;
               this.donghua0.pos(this.owner.x - 10, this.owner.y - 30);
               this.donghua0.play(0, false);


               this.isAttackRange = true;
               this.damage(this.owner, other.owner.MSG.Attack, other.owner.MSG);
               // other.owner.getComponent(Laya.RigidBody).destroy();
               // other.owner.getComponent(Laya.BoxCollider).destroy();
               for (let index = 0; index < window.curLevelItem.length; index++) {
                   if (other.owner == window.curLevelItem[index]) {
                       window.curLevelItem.splice(index, 1);
                   }

               }
               other.owner.removeSelf();
               other.owner.pos(100000, 100000);
               // Laya.Pool.recover("skill",other.owner);

           }
       }

       //受伤
       damage(enemy, attack, other) {
           if (window.GameUI_this.isStop) { return; }
           if (this.isAttackRange) {//在攻击范围内
               //    GameFIG 
               if (other.tag == "knife0" || other.tag == "knife1") {
                   window.GameUI_this.PlayDamageSound(7);
               }
               // let pos = this.GetJiTuiPos(this.owner, window.GameUI_this.curPlayer, 0.1);

               this.num++;
               if (this.num % 30 == 0) {
                   this.JiTui(0.2);
               }

               // enemy.pos(pos.x,pos.y)
               this.attackTeXiao.pos(this.owner.x, this.owner.y);//设置攻击特效的位置
               if (this.owner.MSG.hp > 0) {//如果血量大于零就受到伤害
                   window.GameUI_this.EnemyDamage(enemy, attack);
               } else {//死亡

                   this.isAttackRange = false;//离开攻击范围
                   Laya.timer.clear(enemy, this.damage);
                   Laya.Tween.clearAll(this.owner.getChildAt(0));
               }
           }
       }

       onTriggerExit(other) {
           if (window.GameUI_this.isStop) { return };
           if (other.owner == undefined || other.owner.MSG == undefined) {
               return;
           }
           else if (other.owner.MSG.tag == "knife0"/*||other.owner.MSG.tag =="knife1"*/) {
               // console.log("likai")
               this.attackTeXiao.visible = false;
               this.attackTeXiao.stop();
               if (this.owner.MSG.tag == "enemy") {
                   this.time = 500;
                   Laya.Tween.clearAll(this.owner.getChildAt(0));
                   Laya.Tween.clearAll(this.owner);
                   this.EnemyScale();//恢复初始状态
                   this.rig.setVelocity(this.owner.forward);

               }
               this.isAttackRange = false;//离开攻击范围
               Laya.timer.clear(this, this.damage, other.owner.MSG);
           }
           if (other.owner.MSG.tag == "wall") {
               this.owner.MSG.NoFirst = true;
           }
       }
       DamageAni0() {
           if (this.owner != null) {
               Laya.Tween.to(this.owner.getChildAt(0), { scaleX: 1.2, scaleY: 1 }, 100, Laya.Ease.strongIn, Laya.Handler.create(this, this.DamageAni1));
               // Laya.Tween.to(this.owner,{x:this.owner.x*2-targetPos.x,y:this.owner.y*2-targetPos.y},500,Laya.Ease.linearIn,Laya.Handler.create(this,this.DamageAni1));
           }
       }
       DamageAni1() {
           if (this.owner != null) {
               // Laya.Tween.to(this.owner,{x:targetPos.x,y:targetPos.y},500,Laya.Ease.linearOut,Laya.Handler.create(this,this.DamageAni1));
               Laya.Tween.to(this.owner.getChildAt(0), { scaleX: 1, scaleY: 1.2 }, 100, Laya.Ease.strongOut, Laya.Handler.create(this, this.DamageAni0));
           }

       }

       //击退
       JiTui(power) {
           var targetPos = this.GetJiTuiPos(this.owner, window.GameUI_this.curPlayer, power);
           Laya.Tween.to(this.owner, { x: targetPos.x, y: targetPos.y }, 200, Laya.Ease.strongOut, null, null, false);
       }
       //获取击退后的位置
       GetJiTuiPos(enemy, center, offest) {
           var pos = {
               x: (enemy.x - center.x) * offest + enemy.x,
               y: (enemy.y - center.y) * offest + enemy.y
           };
           return pos;
       }

       //敌人动画
       EnemyScale() {
           if (this.owner != null) {
               Laya.Tween.clearAll(this.owner.getChildAt(0));
               Laya.Tween.to(this.owner.getChildAt(0), { scaleY: 1.1, scaleX: 1 }, this.time, Laya.Ease.linearOut, Laya.Handler.create(this, this.EnemySml), null, true);
           }
       }
       EnemySml() {
           if (this.owner != null) {
               Laya.Tween.clearAll(this.owner.getChildAt(0));
               Laya.Tween.to(this.owner.getChildAt(0), { scaleY: 1, scaleX: 1.1 }, this.time, Laya.Ease.linearOut, Laya.Handler.create(this, this.EnemyScale), null, true);
           }

       }
   }

   var wx$1 = Laya.Browser.window.wx;//微信api
   var GameGGConfig$1 = {
       TPid: [
           "adunit-f960ad94e1c0b65e",
           "adunit-f136beaa7773b07d",
           "adunit-27fcdb9903174767",
           "adunit-85e987e82938461a",
           "adunit-125b89f815a7f1c3",
       ],
       SPid: "adunit-2e66ea3d94d2635a",
       GezhiID: "adunit-3c2fb921a7a049d8",
       nowtp: 0,//当前图片广告
       readtf: false,//广告是否加载成功
       TVorShare: true,//true是视频
       sharetime: null,//分享时间
       shareBFB: 90,//分享百分比
       shareNow: false,//当前是否正在分享
       banner: null,//广告组件
       redio: null,//视频组件
       gezhi: null,//格子组件
       GameQuan: null,//游戏圈组件
   };
   var GameFIG$1;
   //游戏广告脚本 请勿实例多脚本------  
   // 1：请先设置Main_use 的window.shareInfo 分享信息表
   // 2: 在外部new GameGG()---> 在游戏刚进入时 OnEnable 调用 GameGG .Main_Use();
   //    此时脚本自动完成设置页面分享， 监听微信小游戏 退出 wx.onhide 进入wx.onShow
   //----可调用函数
   //1:bannershow 开启图片广告
   //2:changgebanner 关闭图片广告并刷新
   //3:hidebanner  关闭图片广告
   //4:GG_all  分享/视频 接口  获取奖励
   //5:FXget 单纯分享 

   //-----

   class GameGG extends Laya.Script {
       constructor() {
           super();
       }
       createGameQUan() {
           if (wx$1) {
               GameGGConfig$1.GameQuan = wx$1.createGameClubButton({
                   type: "image",
                   text: "游戏圈",
                   icon: 'light',
                   //  image:"other/gg.png",
                   style: {
                       borderRadius: 20,
                       left: (76 - 50) / 750 * wx$1.getSystemInfoSync().windowWidth,
                       top: (200 - 53) / 1334 * wx$1.getSystemInfoSync().windowHeight,
                       width: 100 / 750 * wx$1.getSystemInfoSync().windowWidth,
                       height: 100 / 750 * wx$1.getSystemInfoSync().windowWidth,
                       textAlign: "center"
                   }
               });
           }

       }
       QuanShow() {
           if (GameGGConfig$1.GameQuan) {
               GameGGConfig$1.GameQuan.show();
           }

       }
       QuanHide() {
           if (GameGGConfig$1.GameQuan) {
               GameGGConfig$1.GameQuan.hide();
           }
       }
       compareVersion(v2) {
           var v1 = wx$1.getSystemInfoSync().SDKVersion;
           v1 = v1.split('.');
           v2 = v2.split('.');
           var len = Math.max(v1.length, v2.length);

           while (v1.length < len) {
               v1.push('0');
           }
           while (v2.length < len) {
               v2.push('0');
           }

           for (let i = 0; i < len; i++) {
               const num1 = parseInt(v1[i]);
               const num2 = parseInt(v2[i]);

               if (num1 > num2) {
                   return 1;
               } else if (num1 < num2) {
                   return -1;
               }
           }

           return 0;
       }
       /**
        * 微信自带提示框
        * @param {*} msg 提示信息 
        * @param {*} time 显示的时间  默认2000毫秒
        * @param {*} TFMask 是否开启按钮mask 防止点击穿透 默认false
        */
       TiShiKuang(msg, time = 2000, TFMask = false) {
           if (wx$1 != undefined) {
               wx$1.showToast({
                   title: msg,
                   icon: 'none',
                   duration: time,
                   mask: TFMask
               });
           } else {
               alert(msg);
           }

       }
       /**
        * 
        * @param {*} biaoti 标题
        * @param {*} msg 内容
        * @param {Laya.Handler} success_Hander 成功回调 
        * @param {Laya.Handler} cancel_Hander 失败/取消 回调
        */
       JiaoHukuang(biaoti, msg, success_Hander, cancel_Hander) {
           if (wx$1) {
               wx$1.showModal({
                   title: biaoti,
                   content: msg,
                   showCancel: true,//隐藏取消
                   success(res) {
                       if (res.confirm) {//点了确定
                           if (success_Hander) {
                               success_Hander.run();
                           }

                       } else if (res.cancel) {//点了取消
                           if (cancel_Hander) {
                               cancel_Hander.run();
                           }
                       } else if (res.fail) {//其他错误
                           if (cancel_Hander) {
                               cancel_Hander.run();
                           }
                       }
                   }
               });
           }
       }
       //程序入口
       Main_Use() {
           this.createGameQUan();
           window.shareInfo = [
               { img: "share/01.jpg", title: "贪吃蛇小游戏" },
               { img: "share/02.jpg", title: "全新武器等你来玩" }
           ];
           GameFIG$1 = window.mythis.GetGameFiG();//获取工具类
           window.GameGG_this = this;//
           if (wx$1) {
               this.GetUpdate();//更新检测 
               this.GetGameInitConfig();
               wx$1.onShow(function (res) {//微信进入监听
                   console.log(res);
                   console.log("回到游戏界面");
                   if (GameGGConfig$1.shareNow == true) {
                       GameGGConfig$1.shareNow = false;
                       window.GameGG_this.ShareGet();
                   }
                   GameFIG$1.PlayMusic(0);
               });
               wx$1.onHide(function (res) {//微信退出后台监听
                   console.log(res);
                   console.log("退出游戏");
                   window.otherUse_this.SavePlayerMSG();
               });
           }
       }
       initGG() {//初始化广告
           GameGGConfig$1.nowtp = Math.floor(Math.random() * ((GameGGConfig$1.TPid.length - 1) - (0) + 1) + (0)); //max-min
           this.JtGG();//初始化所有bander广告
           this.dtgg(); //视频广告
           this.GEZHIGG();//格子广告
       }
       GEZHIGG() {
           if (GameGGConfig$1.GezhiID != undefined && window.GameGG_this.compareVersion('2.9.2') >= 0) {
               // 创建格子广告实例，提前初始化
               GameGGConfig$1.gezhi = wx$1.createGridAd({
                   adUnitId: GameGGConfig$1.GezhiID,
                   adTheme: 'white',
                   gridCount: 8,
                   style: {
                       left: wx$1.getSystemInfoSync().windowWidth / 2 - 330 / 2,
                       top: wx$1.getSystemInfoSync().windowHeight / 2 - 200 / 2,
                       width: 330,
                       // opacity: 0.8
                   }
               });
               GameGGConfig$1.gezhi.onResize(
                   function (res) {
                       console.log(res);
                       console.log("重新设置格子");
                       GameGGConfig$1.gezhi.style.left = wx$1.getSystemInfoSync().windowWidth / 2 - res.width / 2;
                       GameGGConfig$1.gezhi.style.top = wx$1.getSystemInfoSync().windowHeight / 2 - res.height / 2;
                   }
               );
               GameGGConfig$1.gezhi.onLoad(
                   function (res) {
                       console.log("格子广告加载成功");
                   }
               );
               GameGGConfig$1.gezhi.onError(
                   function (res) {
                       GameGGConfig$1.gezhi = null;
                       console.log("格子加载失败", res);
                   }
               );
               // 在适合的场景显示格子广告

           }
       }
       GeZhiDang() {
           this.HideGezhi();
           Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.GeZhiDang);
       }
       ShowGezhi() {
           if (GameGGConfig$1.gezhi != null) {
               GameGGConfig$1.gezhi.show();
               Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.GeZhiDang);
           } else {
               this.TiShiKuang("暂无广告", 1000);
           }
       }
       HideGezhi() {
           if (GameGGConfig$1.gezhi != null) {
               GameGGConfig$1.gezhi.hide();
           }
       }
       JtGG() { //图片广告
           if (GameGGConfig$1.TPid == undefined) { return; }
           if (GameGGConfig$1.banner) {
               this.hidebanner();
               GameGGConfig$1.banner.destroy();
           }
           if (GameGGConfig$1.nowtp > GameGGConfig$1.TPid.length - 1) { GameGGConfig$1.nowtp = 0; }
           if (GameGGConfig$1.TPid != undefined && window.GameGG_this.compareVersion('2.0.4') >= 0) {//id不为空时
               GameGGConfig$1.banner = wx$1.createBannerAd({
                   adUnitId: GameGGConfig$1.TPid[GameGGConfig$1.nowtp],
                   style: {
                       left: 15,
                       top: 0,
                       width: 300,
                       adIntervals:30
                   }
               });
               GameGGConfig$1.banner.onResize(res => {
                   GameGGConfig$1.banner.style.top = wx$1.getSystemInfoSync().windowHeight - res.height - 20;
                   GameGGConfig$1.banner.style.left = 667 / 1334 * wx$1.getSystemInfoSync().windowWidth - res.width / 2;
               });
               GameGGConfig$1.banner.onLoad(res => {

               });
               GameGGConfig$1.banner.onError(err => {
               });

           } else {
           }
           GameGGConfig$1.nowtp++;
           //   this.saveLocalData("GuangGaoID疯狂", { "id": GameGGConfig.nowtp });

       }
       dtgg() { //视频广告

           if (GameGGConfig$1.SPid != undefined) {
               GameGGConfig$1.redio = wx$1.createRewardedVideoAd({
                   adUnitId: GameGGConfig$1.SPid,
                   success: function (res) {

                   }
               });
               GameGGConfig$1.redio.onLoad(() => {
                   GameGGConfig$1.readtf = true;
                   console.log("视频广告加载完毕");
               });

               GameGGConfig$1.redio.onError(err => {
                   console.log("失败加载错误");
                   GameGGConfig$1.readtf = false;
                   GameGGConfig$1.TVorShare = false;
               });
               GameGGConfig$1.redio.onClose(res => {
                   // 用户点击了【关闭广告】按钮
                   if (res && res.isEnded || res === undefined) {
                       if (window.success_HanderUse) {
                           window.success_HanderUse.run();
                           window.success_HanderUse = undefined;
                       }
                   } else {
                       if (window.fail_HanderUse) {
                           window.fail_HanderUse.run();
                           window.fail_HanderUse = undefined;
                       }
                   }
               });
           }


       }
       ShareGet() {//分享获取
           var MS = parseInt((Date.parse(new Date()) - Date.parse(GameGGConfig$1.sharetime)));//获取秒数

           if (MS < 1000) { //0
               window.GameGG_this.WXLog(false, null);
           } else if (MS < 7000) {//20
               var r = Math.random();
               if (r <= 0.3) {
                   window.GameGG_this.GETshareGift();
               } else {
                   window.GameGG_this.WXLog(false, null);
               }
           } else {//100  90  80 
               var r = Math.random();
               if (r <= GameGGConfig$1.shareBFB) {
                   window.GameGG_this.GETshareGift();
               } else {
                   window.GameGG_this.WXLog(false, null);
               }
           }
       }
       GETshareGift() {//获取分享礼物
           if (window.success_HanderUse) {
               window.success_HanderUse.run();
               window.success_HanderUse = undefined;
           }

       }
       changgebanner() {
           if (wx$1 && GameGGConfig$1.TPid != undefined) {
               this.JtGG();
           }
       }
       hidebanner() {
           if (wx$1 && GameGGConfig$1.TPid != undefined) {
               GameGGConfig$1.banner.hide();
           }

       }
       bannershow() {
           if (wx$1 && GameGGConfig$1.TPid != undefined) {
               GameGGConfig$1.banner.show();
           }

       }
       /**
        * 打开广告_分享汇总方法
        * @param {*bool} AotoSPFX  true视频 false分享 0 随机
        * @param {*Laya.Handler} success_Hander 成功分享/观看视频时调用
        * @param {*Laya.Handler}fail_Hander 失败分享/观看视频时调用
       */
       GG_all(AotoSPFX = 0, success_Hander, fail_Hander) {
           if (AotoSPFX == 0) {
               GameGGConfig$1.TVorShare = !GameGGConfig$1.TVorShare;
           } else {
               GameGGConfig$1.TVorShare = AotoSPFX;
           }
           if (GameGGConfig$1.TVorShare) {//视频
               if (GameGGConfig$1.readtf && GameGGConfig$1.redio != undefined) {
                   GameGGConfig$1.redio.show();
                   console.log("播放视频");
               } else {
                   GameGGConfig$1.readtf = false;
                   GameGGConfig$1.TVorShare = false;
                   this.FXget();
                   GameGGConfig$1.shareNow = true;

                   GameGGConfig$1.sharetime = new Date();
               }
           } else {//分享
               this.FXget();
               GameGGConfig$1.shareNow = true;
               GameGGConfig$1.sharetime = new Date();
           }

           if (success_Hander) {
               window.success_HanderUse = success_Hander;
           }
           if (fail_Hander) {
               window.fail_HanderUse = fail_Hander;
           }
       }
       /**
        * 分享成功 失败窗口
        * @param {*bool} success 是否分享成功
        *  @param {*str} success 分享成功,显示物品名称
        *  @param {*index} success 分享失败标识 方便重新分享
        */
       WXLog(success, str) {
           if (success) {
               wx$1.showModal({
                   title: '分享成功',
                   content: str,
                   showCancel: false,//隐藏取消
                   confiemText: "谢谢",
                   success(res) {
                       if (res.confirm) {

                       } else if (res.cancel) {

                       } else if (res.fail) {

                       }
                   }
               });
           } else {
               if (window.fail_HanderUse) {
                   window.fail_HanderUse.run();
                   window.fail_HanderUse = undefined;
               }

           }

       }
       FXget() {//分享
           if (wx$1) {
               var fxrand = Math.floor(Math.random() * ((window.shareInfo.length - 1) - (0) + 1) + (0)); //max-min
               wx$1.shareAppMessage({
                   imageUrl: window.shareInfo[fxrand].img, //转发标题
                   title: window.shareInfo[fxrand].title, //转发标题
                   //   query: 'inviter_id=' + window.player.P_id + '&share_id=' + window.shareInfo[fxrand].id,
               });
           }

       }
       TVLog(success, str, index) {
           if (success) {
               wx$1.showModal({
                   title: '观影完毕',
                   content: str,
                   showCancel: false,//隐藏取消
                   confiemText: "谢谢",
                   success(res) {
                       if (res.confirm) {

                       } else if (res.cancel) {

                       } else if (res.fail) {

                       }
                   }
               });
           } else {
               wx$1.showModal({
                   title: '观影失败',
                   showCancel: false,//隐藏取消
                   content: str,
                   success(res) {
                       if (res.confirm) {

                       } else if (res.cancel) {


                           // 播放中途退出，不下发游戏奖励
                       } else if (res.fail) {


                           // 播放中途退出，不下发游戏奖励
                       }
                   }
               });
           }

       }
       //-----**1    
       GetUpdate() {//获取新版本
           var updateManager = wx$1.getUpdateManager();
           updateManager.onCheckForUpdate(function (res) {
               // 请求完新版本信息的回调
               console.log("版本更新检测");
               console.log(res);

           });
           updateManager.onUpdateReady(function () {
               wx$1.showModal({
                   title: '更新提示',
                   content: '有新版本噢',
                   success(res) {
                       if (res.confirm) {
                           // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                           updateManager.applyUpdate();
                       }
                   }
               });
           });

           updateManager.onUpdateFailed(function () {
               // 新版本下载失败
               console.log("更新失败");
               wx$1.showModal({
                   title: '更新提示',
                   content: '更新失败,请检测网络，并重启小游戏~',
                   success(res) {

                   }
               });
           });


       }
       GetGameInitConfig() {
           if (wx$1 != undefined) {
               //分享
               // 显示当前页面的转发按钮
               wx$1.updateShareMenu({
                   withShareTicket: true
               });
               wx$1.showShareMenu({
                   // 是否使用带 shareTicket 的转发
                   withShareTicket: true
               });
               var fxrand = Math.floor(Math.random() * ((window.shareInfo.length - 1) - (0) + 1) + (0)); //max-min
               wx$1.onShareAppMessage(() => ({
                   title: window.shareInfo[fxrand].title,
                   imageUrl: window.shareInfo[fxrand].img, // 图片 URL Laya.URL.basePath + 'gamemain/share.png'
                   success: function (res) {
                   },
                   fail: function (res) {
                   }
               }));
               this.initGG();
           }
       }

   }

   window.FIG = GameFIG.Get();//new GameFIG();

   var GG = new GameGG();
   var wx$2 = Laya.Browser.window.wx;
   // var WXorLaya = true;//false是在laya运行  true微信运行
   window.P_oppid;//
   window.P_oppid = 0;
   var knifeObjArr0 = [];
   var knifeObjArr1 = [];
   window.jinbiArr = [];//出现在场景中的金币
   var isHeChengMax = false;//合成最高等级
   class OtherUse extends Laya.Script {
       constructor() {
           super();

       }

       onEnable() {

       }
       Main() {
           if (wx$2) {
               wx$2.onShow((res) => {
                   if (window.isGameQuit) {
                       window.GameUI_this.PlayMusic(14);
                   }
               });
           }
           Date.prototype.Format = function (fmt) { //author: meizz 
               var o = {
                   "M+": this.getMonth() + 1, //月份 
                   "d+": this.getDate(), //日 
                   "h+": this.getHours(), //小时 
                   "m+": this.getMinutes(), //分 
                   "s+": this.getSeconds(), //秒 
                   "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                   "S": this.getMilliseconds() //毫秒 
               };
               if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
               for (var k in o)
                   if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
               return fmt;
           };
           // 初始化
           // if (window.FIG.fetchLocalData("玩家信息")) {
           //     window.player = window.FIG.fetchLocalData("玩家信息");
           // }
           // if (window.FIG.fetchLocalData("当前关卡")) {
           //     window.curLevelInfo = window.FIG.fetchLocalData("当前关卡");
           // }
           if (!window.player.isVal) {
               Laya.SoundManager.setSoundVolume(0);
               Laya.SoundManager.setMusicVolume(0);//关闭声音
           } else {
               Laya.SoundManager.setSoundVolume(1);
               Laya.SoundManager.setMusicVolume(1);//打开声音
           }
           this.ZJMcore = window.player.curCore;
           window.GameUI_this.ZJM_suo.visible = false;
           window.GameUI_this.ZJM_jiesuo.visible = false;
           this.wxZD(true);
           this.WXPHB();//
           //层级id
           this.heroLock = true;
           this.viewID = [
               window.GameUI_this.zjm_ceng,//0 主界面
               window.GameUI_this.Setting_Ceng,//1 设置层
               window.GameUI_this.PaiHang_Ceng,//2 好友排行层
               window.GameUI_this.JinBiBuJi_Ceng,//3 金币补给层
               window.GameUI_this.QianDao_Ceng,//4 签到层
               window.GameUI_this.LiXian_Ceng,//5 离线收益层
               window.GameUI_this.GetNewHero_Ceng,//6 解锁新英雄层
               window.GameUI_this.GetNewEquip_Ceng,//7 解锁新装备层
               window.GameUI_this.Win_Ceng,//8游戏胜利层
               window.GameUI_this.ZhuLi_Ceng,//9 好友助力层
               window.GameUI_this.GameOver_Ceng,//10 游戏结束层
               window.GameUI_this.JieSuan_Ceng,//11 结算层
               window.GameUI_this.FuHuo_Ceng,//12 复活层
               window.GameUI_this.game_ceng,//13 战斗层
           ];
           this.InitPlayer();
           this.Update_ZJM();//刷新主界面
           this.AddBtn();//添加按钮事件
           this.QDHBTween();
           let gameThis = window.GameUI_this;
           if (window.player.energy < 100) {
               this.setYaobai(gameThis.tili_buji);
           }

           if (!this.TFdate(new Date().Format("yyyy-MM-dd"), new Date(window.player.qd.lastTime).Format("yyyy-MM-dd"))) {
               this.setYaobai(gameThis.qiandao);
           }

           var lixiantime = new Date().getTime() - window.player.lastOut;
           var fen = Math.floor(lixiantime / 60 / 1000);
           if (fen >= 60 * 8) {
               fen = 60 * 8;
           }
           var gold = 10 * fen;
           var gerlixian = this.tranNum(gold);
           if (gerlixian.num > 0) {
               this.setYaobai(gameThis.lixianshouyi);
           }
           /**只打开主界面*/
           // for (let i = 1; i < this.viewID.length; i++) {
           //     this.viewID[i].visible = false;
           // }
       }
       //签到界面解锁伙伴的tween
       QDHBTween() {
           Laya.Tween.to(window.GameUI_this.qiandaoHuoBan, { y: window.GameUI_this.qiandaoHuoBan.y == 267 ? 287 : 267 }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this, this.QDHBTween));
       }
       //掉金币
       jinbidonghua(num, pos, targetPos, fun = null) {
           var url = "XZDS/ZJM_Ceng/JinBi0.png";
           window.GameUI_this.PlaySound(16);
           for (let i = 0; i < num; i++) {
               var jinbi = Laya.Pool.getItemByClass("jinbi", Laya.Sprite);
               window.jinbiArr.push(jinbi);
               jinbi.loadImage(url, Laya.Handler.create(this, function () {
                   Laya.stage.addChild(jinbi);
                   jinbi.pivot(jinbi.width / 2, jinbi.height / 2);
                   jinbi.pos(pos.x, pos.y);
                   this.rotateTween(jinbi);

                   var fangxiang = window.GameUI_this.GetRandomDic(0, 361);

                   Laya.Tween.to(jinbi, { x: jinbi.x + 100 * fangxiang.x, y: jinbi.y + 100 * fangxiang.y }, 600, Laya.Ease.expoOut, Laya.Handler.create(this, this.tod, [jinbi, targetPos, fun]), null, false);
               }, [jinbi, pos, targetPos, fun]));

           }
       }
       /**设置游戏中左右中心摇摆 */
       setYaobai(spr, offest = 0) {
           let ind = 1;
           let aos = 1;
           let setID = setInterval(() => {
               if (!spr) {
                   clearInterval(setID);
               }
               spr.rotation = ind;
               //spr.scaleY = ind;
               if (ind > 8) {
                   aos = -1;
               }
               if (ind < -8) {
                   aos = 1;
               }
               ind += aos * 1;
           }, 30 + offest);
           spr.setID = setID;
       }
       tod(a, targetPos, fun) {
           var rantime = window.GameUI_this.GetRandom(400, 901);
           Laya.Tween.to(a, { x: targetPos.x, y: targetPos.y }, rantime, Laya.Ease.quartIn, Laya.Handler.create(this, function () {
               Laya.Tween.clearAll(a);
               a.scaleX = 1;
               var index = window.jinbiArr.indexOf(a);
               window.jinbiArr.splice(index, 1);
               a.pos(-10000, -10000);
               a.removeSelf();
               Laya.Pool.recover("jinbi", a);
               if (fun != null) {
                   fun();
               }
           }), null, false);
       }
       //金币旋转
       rotateTween(a) {
           Laya.Tween.to(a, { scaleX: a.scaleX == 1 ? 0 : 1 }, 500, Laya.Ease.linearIn,
               Laya.Handler.create(this, this.rotateTween, [a], false), null, false);
       }

       AddBtn() {
           window.FIG.butTween(window.GameUI_this.jinbi_buji, Laya.Handler.create(this, this.click_goldBuJi, [], false));//金币补给
           window.FIG.butTween(window.GameUI_this.tili_buji, Laya.Handler.create(this, this.click_tili_buji, [], false));//体力补给
           window.FIG.butTween(window.GameUI_this.qiandao, Laya.Handler.create(this, this.click_qiandao, [], false));//七日登录
           window.FIG.butTween(window.GameUI_this.setting_back, Laya.Handler.create(this, this.click_set, [], false));//设置
           window.FIG.butTween(window.GameUI_this.haoyou_paihang, Laya.Handler.create(this, this.click_paihang, [], false));//好友排行
           window.FIG.butTween(window.GameUI_this.Buy, Laya.Handler.create(this, this.click_BuyBtn, [], false));//购买装备按钮,随机获得一件装备
           window.FIG.butTween(window.GameUI_this.left, Laya.Handler.create(this, this.click_qiehuan, [0], false));//切换角色left
           window.FIG.butTween(window.GameUI_this.right, Laya.Handler.create(this, this.click_qiehuan, [1], false));//切换角色right
           window.FIG.butTween(window.GameUI_this.lixianshouyi, Laya.Handler.create(this, this.click_lixian, [], false));//离线收益

           window.FIG.butTween(window.GameUI_this.jingbibujiQuit, Laya.Handler.create(this, this.click_Quit, [3], false));//关闭金币补给界面
           window.FIG.butTween(window.GameUI_this.volume, Laya.Handler.create(this, this.click_volume, [], false));//音量
           window.FIG.butTween(window.GameUI_this.zhengdong, Laya.Handler.create(this, this.click_ZD, [], false));//震动
           window.FIG.butTween(window.GameUI_this.setting_cengQuit, Laya.Handler.create(this, this.click_Quit, [1], false));//关闭设置界面
           window.FIG.butTween(window.GameUI_this.GetNewEquipQuit, Laya.Handler.create(this, this.click_Quit, [7, this.GetNewHero, this], false));//关闭解锁新武器的界面
           window.FIG.butTween(window.GameUI_this.tiaoguo, Laya.Handler.create(this, this.click_Quit, [7, this.GetNewHero, this], false));//关闭解锁新武器的界面
           window.FIG.butTween(window.GameUI_this.qiandaoQuit, Laya.Handler.create(this, this.click_Quit, [4], false));//关闭签到界面
           window.FIG.butTween(window.GameUI_this.PaiHangQuit, Laya.Handler.create(this, this.closeLoginPanel, [], false));//关闭好友排行界面

           window.FIG.butTween(window.GameUI_this.linquback, Laya.Handler.create(this, this.click_ZJMJinBiLinQu, [], false));//金币补给 观看视屏领取


           window.FIG.butTween(window.GameUI_this.GameOverLingQu, Laya.Handler.create(this, this.click_JinBiLinQu, [false, 10], false));//gameover领取按钮

           window.FIG.butTween(window.GameUI_this.JieSuanLingQu, Laya.Handler.create(this, this.click_JinBiLinQu, [false, 11], false));//结算领取按钮
           window.FIG.butTween(window.GameUI_this.SanBeiLingQu, Laya.Handler.create(this, this.click_JinBiLinQu, [true, 11, null, 3], false));//结算三倍领取按钮
           window.FIG.butTween(window.GameUI_this.shibeiAnNiu, Laya.Handler.create(this, this.click_JinBiLinQu, [true, 11, null, 10], false));//结算十倍领取按钮
           window.FIG.butTween(window.GameUI_this.lingqushouyi, Laya.Handler.create(this, this.click_lixianlinqu, [0], false));//离线金币普通领取
           window.FIG.butTween(window.GameUI_this.doubleLingqu, Laya.Handler.create(this, this.click_lixianlinqu, [1], false));//离线金币双倍领取

           window.FIG.butTween(window.GameUI_this.sure, Laya.Handler.create(this, this.click_Quit, [6], false));//关闭解锁新英雄界面
           window.FIG.butTween(window.GameUI_this.lixianQuit, Laya.Handler.create(this, this.click_Quit, [5], false));//关闭解锁新英雄界面
           window.FIG.butTween(window.GameUI_this.xuanyaoyixia, Laya.Handler.create(this, this.click_XuanYao, [5], false));//炫耀一下

           window.FIG.butTween(window.GameUI_this.FuHuoAnNiu, Laya.Handler.create(this, this.click_FuHuo, [], false));//复活
           window.FIG.butTween(window.GameUI_this.paihangLeft, Laya.Handler.create(this, this.wxkfsjy, [-1], false));//排行榜上一页
           window.FIG.butTween(window.GameUI_this.paihangRight, Laya.Handler.create(this, this.wxkfsjy, [1], false));//排行榜下一页
           window.FIG.butTween(window.GameUI_this.gamestart, Laya.Handler.create(this, this.GameStarta, [], false));//开始游戏

           window.FIG.butTween(window.GameUI_this.paihangFenxiang, Laya.Handler.create(this, this.click_fenxiangpaihang, [], false));//分享好友
           window.FIG.butTween(window.GameUI_this.gengduo_game, Laya.Handler.create(this, this.click_GeDuoGame, [], false));//更多游戏
           window.FIG.butTween(window.GameUI_this.onePas, Laya.Handler.create(this, this.OneBondSyntha, [], false));//一键合成


           this.curLevelbackTween();//打开关卡显示背景动画
           // window.GameUI_this.gamestart.on(Laya.Event.MOUSE_DOWN,this,this.GameStart);//开始游戏
           this.AddLiXianTiLi();//离线恢复体力
           this.AddTiLi();
       }
       //开始游戏
       GameStarta() {
           if (this.gamess) {
               return;
           }

           if (!this.heroLock) {//未解锁
               window.FIG.TiShiKuang("当前英雄未解锁");
               return;
           }

           this.gamess = true;
           Laya.timer.once(1000, this, () => {
               this.gamess = false;
           }, [], false);
           if (window.player.energy >= 5) {
               window.player.energy -= 5;//玩家体力减少
               if (!this.isOpenAddTiLi) {
                   this.AddTiLi();//增加体力
               }
               window.isGameQuit = true;
               window.GameUI_this.PlayMusic(14);//播放背景音乐
               this.RefreshTiLi();
               window.GameUI_this.GetRanLevelRoad();//随机加载地图
               // Laya.Tween.to(window.GameUI_this.floor, { y: -380 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
               //     window.GameUI_this.floor.y = 373 / 1334 * Laya.stage.height;
               // }))
               // Laya.Tween.to(window.GameUI_this.slotsBack, { y: 1700 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
               //     this.ViewToView(0, 13, true, false);//跳转到战斗界面
               //     window.GameUI_this.slotsBack.y = 1080 / 1334 * Laya.stage.height;
               //     window.GameUI_this.GameStart();
               // }))
               this.ViewToView(0, 13, true, false);//跳转到战斗界面
               window.GameUI_this.slotsBack.y = 1080 / 1334 * Laya.stage.height;
               window.GameUI_this.GameStart();
           } else {
               window.FIG.TiShiKuang("体力不足");
           }
           // window.FIG.butTween(window.GameUI_this.gamestart, this, this.GameStarta);//开始游戏
       }
       //更多游戏
       click_GeDuoGame() {
           if (window.openQD) {
               Laya.Scene.open("XQDView.scene", false, null);
           }
       }
       //离线时体力恢复
       AddLiXianTiLi() {
           if (window.player.tilitimestart != 0 && window.player.energy < 100) {
               var lixiantime = new Date().getTime() - window.player.tilitimestart;
               window.player.tilitimestart = 0;
               window.player.energy += Math.floor(lixiantime / 120000);
               if (window.player.energy > 100) {
                   window.player.energy = 100;
               }
               this.RefreshTiLi();
           }
       }
       //增加体力
       AddTiLi() {
           window.player.tilitimestart = new Date().getTime();
           window.GameUI_this.AddTiLiTime.visible = true;
           this.tilitime = 120;
           Laya.timer.loop(1000, this, this.refreshTime);
           this.isOpenAddTiLi = true;

       }
       //刷新时间显示
       refreshTime() {
           if (window.player.energy < 100) {
               window.GameUI_this.AddTiLiTime.text = this.timeFormat(this.tilitime);
               if (this.tilitime == 0) {
                   this.tilitime = 120;
                   window.player.tilitimestart = new Date().getTime();//刷新时间
                   window.player.energy += 1;
                   this.RefreshTiLi();
               }
           } else {
               window.player.tilitimestart = 0;
               window.GameUI_this.AddTiLiTime.visible = false;
               Laya.timer.clear(this, this.refreshTime);
               this.isOpenAddTiLi = false;
           }
           this.tilitime--;
       }
       //时间转换
       timeFormat(TotalSeconds) {
           var h = Math.floor(TotalSeconds / 3600);//时
           var m = Math.floor((TotalSeconds - h * 3600) / 60);//分
           var s = TotalSeconds % 60;//秒
           if (m < 10) {
               m = "0" + m;
           }
           if (s < 10) {
               s = "0" + s;
           }
           return m + ":" + s;

       }
       //关卡图标显示背景动画
       curLevelbackTween() {
           var scale = window.GameUI_this.item3back.scaleX == 1 ? 1.1 : 1;
           Laya.Tween.to(window.GameUI_this.item3back, { scaleX: scale, scaleY: scale }, 250, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
               this.curLevelbackTween();
           }), null, false);
       }
       //分享排行
       click_fenxiangpaihang() {
           window.FIG.GG_all(false, Laya.Handler.create(this, function () {
               window.FIG.TiShiKuang("分享成功");
           }));
       }
       //炫耀一下
       click_XuanYao() {
           window.FIG.GG_all(false, Laya.Handler.create(this, function () {
               window.FIG.TiShiKuang("炫耀成功");
           }));
       }
       //离线界面领取
       click_lixianlinqu(type) {
           let gameThis = window.GameUI_this;
           if (type == 0) {//普通领取
               window.player.gold += this.zaixianGold;
               if (gameThis.lixianshouyi.setID) {
                   clearInterval(gameThis.lixianshouyi.setID);
                   gameThis.lixianshouyi.rotation = 0;
                   gameThis.lixianshouyi.setID = null;
               }
               window.player.lastOut = new Date().getTime();//重置
           } else {//双倍领取 观看视屏
               window.FIG.GG_all(false, Laya.Handler.create(this, function () {
                   window.FIG.TiShiKuang("领取成功");
                   window.player.gold += 2 * this.zaixianGold;
                   window.player.lastOut = new Date().getTime();//重置
                   if (gameThis.lixianshouyi.setID) {
                       clearInterval(gameThis.lixianshouyi.setID);
                       gameThis.lixianshouyi.rotation = 0;
                       gameThis.lixianshouyi.setID = null;
                   }
               }), Laya.Handler.create(this, () => {
                   window.FIG.TiShiKuang("分享失败");
               }));
           }
           window.GameUI_this.PlaySound(6);
           this.zaixianGold = 0;
           window.GameUI_this.lixianjinbi.text = "0";
           this.RefreshJinBi();
       }
       //zjm离线收益
       click_lixian() {
           this.Setlixian();
           this.ViewToView(0, 5, false, true);
           this.showpanel(window.GameUI_this.lixianBack);
           window.GameUI_this.lingqushouyi.visible = false;
           Laya.timer.once(2000, this, function () {
               window.GameUI_this.lingqushouyi.visible = true;
               Laya.Tween.from(window.GameUI_this.lingqushouyi, { alpha: 0 }, 3000, Laya.Ease.linearIn);
           }, [], false);

       }
       showpanel(panel) {
           panel.pivot(panel.width / 2, panel.height / 2);
           Laya.Tween.from(panel, { scaleY: 0 }, 200, Laya.Ease.backOut);
       }
       //设置离线收益
       Setlixian() {
           var lixiantime = new Date().getTime() - window.player.lastOut;
           var fen = Math.floor(lixiantime / 60 / 1000);
           if (fen >= 60 * 8) {
               fen = 60 * 8;
           }
           var gold = 10 * fen;
           this.zaixianGold = gold;
           var gerlixian = this.tranNum(this.zaixianGold);

           window.GameUI_this.lixianjinbi.text = gerlixian.nub + gerlixian.danwei;
           let gameThis = window.GameUI_this;
           if (gerlixian.nub > 0 && !gameThis.lixianshouyi.setID) {
               this.setYaobai(gameThis.lixianshouyi);

           }

           // var gerlixian2 = this.tranNum(this.getAllshouyi() * fen * 2);
           // window.mythis.li.getChildAt(0).getChildAt(1).text = gerlixian2.nub + gerlixian2.danwei;
           // var nowTime = new Date().getTime();
           // window.mythis.time.text = this.TimeZ(nowTime - playerMSG.lastOut);
       }
       /**
        * 
        * @param {*} number 整数
        */
       tranNum(number) {
           var CH = 0;
           var dandan = "";
           if (number < 1000) {//
               CH = number;
           } else if (number < 1000 * 1000) {//k
               CH = parseInt((number / 1000) * 100) / 100;
               dandan = "K";
           } else if (number < 1000 * 1000 * 1000) {//M
               CH = parseInt((number / (1000 * 1000)) * 100) / 100;
               dandan = "M";
           } else if (number < 1000 * 1000 * 1000 * 1000) {//G
               CH = parseInt((number / (1000 * 1000 * 1000)) * 100) / 100;
               dandan = "G";
           } else if (number < 1000 * 1000 * 1000 * 1000 * 1000) {//aa
               CH = parseInt((number / (1000 * 1000 * 1000 * 1000)) * 100) / 100;
               dandan = "aa";
           } else if (number < 1000 * 1000 * 1000 * 1000 * 1000 * 1000) {//bb
               CH = parseInt((number / (1000 * 1000 * 1000 * 1000 * 1000)) * 100) / 100;
               dandan = "bb";
           } else if (number < 1000 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000) {//bb
               CH = parseInt((number / (1000 * 1000 * 1000 * 1000 * 1000 * 1000)) * 100) / 100;
               dandan = "ab";
           }
           return { nub: CH, danwei: dandan };
       }
       click_ZJMJinBiLinQu() {//主界面金币领取
           //观看视屏
           window.FIG.GG_all(true, Laya.Handler.create(this, function () {
               window.FIG.TiShiKuang("领取成功");
               window.player.gold += this.bujigold;
               this.bujigold = 0;
               window.GameUI_this.shouyi.text = "0";
               window.GameUI_this.PlaySound(6);
               this.RefreshJinBi();
           }), Laya.Handler.create(this, () => {
               window.FIG.TiShiKuang("观看失败");
           }));


           // GG.JiaoHukuang("金币不足","是否看视频",Laya.Handler.create(this,function () {
           //     GG.GG_all(true,Laya.Handler.create(this,function() {
           //         window.player.gold += this.bujigold;
           //         this.bujigold = 0;
           //         window.GameUI_this.shouyi.text = "000";
           //         this.RefreshJinBi();
           //     }),Laya.Handler.create(this,function () {
           //         GG.TiShiKuang("观看失败",2000,false);
           //     }))
           // }),Laya.Handler.create(this,function () {
           //     GG.TiShiKuang("未观看",3000,false);
           // }))

       }
       //签到界面点击领取
       click_lingqu(btn, num) {
           if (!this.TFdate(new Date().Format("yyyy-MM-dd"), new Date(window.player.qd.lastTime).Format("yyyy-MM-dd"))) {
               this.sign_ok(btn, num);
               let gameThis = window.GameUI_this;
               if (gameThis.qiandao.setID) {
                   clearInterval(gameThis.qiandao.setID);
                   gameThis.qiandao.rotation = 0;
                   gameThis.qiandao.setID = null;
               }
           } else {
               console.log("同一天");
           }
       }
       //签到成功
       sign_ok(btn, num) {
           if (num <= 7) {
               window.player.qd.lastTime = new Date();

               var yilingqu = window.GameUI_this.yilingqu.getChildByName("yilingqu" + num);
               yilingqu.visible = true;
               if (num != 3 && num != 7) {
                   window.player.gold += 5000;//金币增加
                   window.player.energy += 20;//体力增加

                   this.RefreshJinBi();
                   this.RefreshTiLi();
               } else if (num == 3) {
                   window.player.biaoqingJieSuo = true;//  解锁表情  
               } else {
                   window.player.jieSuoHuoBan = true;//解锁伙伴协战
                   window.GameUI_this.huoban.visible = true;
                   this.Update_ZJM();
                   window.GameUI_this.qiandao.pos(-1000, -1000);//七日签到结束
                   window.GameUI_this.qiandao.visible = false;
                   window.GameUI_this.jinbi_buji.visible = true;//打开金币补给按钮
               }
               btn.offAll();
               window.player.qd.DQ++;
               this.RefreshQianDaoPanel();//刷新签到界面
               // this.SavePlayerMSG();
               this.SavePlayerMSG();
           }
       }
       //添加伙伴动画
       AddHuoBanDongHua() {
           Laya.Tween.to(window.GameUI_this.huoban, { y: window.GameUI_this.huoban.y == 500 ? 520 : 500 }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this, this.AddHuoBanDongHua));
       }
       TFdate(D1, D2) {//判断是否同一天
           if (D1 == undefined || D2 == undefined) {
               return false;//第一次
           }
           if (D1 == D2) {
               return true;
           } else {
               return false;
           }
       }
       //刷新签到界面
       RefreshQianDaoPanel() {
           for (let index = 0; index < 7; index++) {
               var yilingqu = window.GameUI_this.yilingqu.getChildByName("yilingqu" + (1 + index));
               if (index < window.player.qd.DQ) {
                   yilingqu.visible = true;
               } else {
                   yilingqu.visible = false;
                   if (index != window.player.qd.DQ) {
                       let lingquBtn = window.GameUI_this.qiandaolingqu.getChildByName("lingqu" + (1 + index));
                       if (index == 2) {
                           lingquBtn.getChildAt(0).getChildAt(2).disabled = true;
                       } else if (index == 6) {
                           lingquBtn.getChildAt(0).getChildAt(2).disabled = true;
                       } else {
                           lingquBtn.disabled = true;
                       }
                   } else {
                       let arr = ["OneDay", "TwoDay", "", "FourDay", "FiveDay", "SixDay", ""];
                       for (let j = 0; j < arr.length; j++) {
                           if (arr[j] != "") {
                               window.GameUI_this[arr[j]].getChildAt(0).visible = false;
                           }
                       }
                       if (arr[index] != "") {
                           window.GameUI_this[arr[index]].getChildAt(0).visible = true;
                       }
                   }
               }
           }

           if (window.player.qd.DQ > 6) { return };
           var lingqu = window.GameUI_this.qiandaolingqu.getChildByName("lingqu" + (window.player.qd.DQ + 1));//打开按钮点击事件
           if (!this.TFdate(new Date().Format("yyyy-MM-dd"), new Date(window.player.qd.lastTime).Format("yyyy-MM-dd"))) {//不是同一天

               if (window.player.qd.DQ == 2) {
                   lingqu.getChildAt(0).getChildAt(2).disabled = false;
               } else if (window.player.qd.DQ == 6) {
                   lingqu.getChildAt(0).getChildAt(2).disabled = false;
               } else {
                   lingqu.disabled = false;
               }
               window.FIG.butTween(lingqu, Laya.Handler.create(this, this.click_lingqu, [lingqu, window.player.qd.DQ + 1], false));
           } else {
               if (window.player.qd.DQ == 2) {
                   lingqu.getChildAt(0).getChildAt(2).disabled = true;
               } else if (window.player.qd.DQ == 6) {
                   lingqu.getChildAt(0).getChildAt(2).disabled = true;
               } else {
                   lingqu.disabled = true;
               }
               console.log("同一天");
           }



       }
       //点击复活
       click_FuHuo() {
           this.showVideoTime = true;//观看视频
           window.FIG.GG_all(false, Laya.Handler.create(this, function () {
               this.fuhuoFun();
           }), Laya.Handler.create(this, function () {//观看失败
               this.showVideoTime = false;
           }));
       }
       fuhuoFun() {
           Laya.timer.clear(this, this.showdaojishi);
           Laya.timer.clear(this, this.daojishiAni);//关闭倒计时的动画
           if (window.GameUI_this.huoBan != null) {
               window.GameUI_this.huoBanRig.setVelocity(window.GameUI_this.huoBan.forward);
           }

           this.ViewToView(12, 13, true, false);//回到游戏界面
           window.GameUI_this.isStop = false;//继续游戏;
           window.GameUI_this.stopTime = 0;
           window.GameUI_this.jindu.resume();//恢复怪物生成进度条
           // window.GameUI_this.curPlayer.x = window.GameUI_this.curPlayerX ;//玩家回到死亡位置
           // window.GameUI_this.curPlayer.y = window.GameUI_this.curPlayerY;
           window.GameUI_this.curPlayer.visible = true;
           var bhz = new Laya.Sprite();
           window.GameUI_this.curPlayer.addChild(bhz);//给玩家添加保护罩
           // bhz.texture = "XZDS/Ani/gjtx/bhz0.png";
           bhz.loadImage("XZDS/Ani/gjtx/bhz0.png", Laya.Handler.create(this, function () {
               bhz.pivot(bhz.width / 2, bhz.height / 2);
           }));
           bhz.pos(window.GameUI_this.curPlayer.pivotX, window.GameUI_this.curPlayer.pivotY);
           window.GameUI_this.isInvincible = true;//开启无敌
           window.player.lnnerKnife_speed *= 3;
           window.player.outerKnife_speed *= 3;
           Laya.timer.once(3000, this, function () {
               window.player.lnnerKnife_speed /= 3;
               window.player.outerKnife_speed /= 3;
               this.BhzSanSuo(bhz);
           }, [], false);
           Laya.timer.once(5000, this, function () {//五秒后关闭无敌状态
               if (bhz) {
                   bhz.destroy();
               }

               Laya.Tween.clearAll(bhz);
               window.GameUI_this.isInvincible = false;//是否开启无敌
               window.GameUI_this.isStop = false;
           }, [], false);
           window.GameUI_this.playerControl();//恢复玩家控制
       }
       //保护罩动画
       BhzSanSuo(bhz) {
           Laya.Tween.to(bhz, { alpha: bhz.alpha == 1 ? 0 : 1 }, 300, Laya.Ease.linearNone, Laya.Handler.create(this, this.BhzSanSuo, [bhz]), null, false);
       }
       //复活倒计时
       FuHuoDaoJiShi() {
           this.showVideoTime = false;//是否正在观看视频
           window.GameUI_this.daojishi.text = 5;//倒计时五秒
           // for (let index = 0; index < 5; index++) {
           //     Laya.timer.once(1000*index,this,this.daojishi,[index,callback],false);
           // }
           Laya.timer.loop(1000, this, this.showdaojishi);
           Laya.timer.frameLoop(1, this, this.daojishiAni);

       }
       // 倒计时动画
       daojishiAni() {
           window.GameUI_this.DaoJiShiBack.rotation += 1;
       }
       //显示倒计时
       showdaojishi() {
           if (this.showVideoTime) { return }
           window.GameUI_this.PlaySound(11);
           window.GameUI_this.daojishi.text--;
           if (window.GameUI_this.daojishi.text == 0) {
               let Handler = Laya.Handler.create(this, () => {
                   this.ViewToView(12, 10, true, false);//打开gameover面板
                   this.tanchuangdonghua(window.GameUI_this.GameOverBack);
                   this.RefreshGameOverPanel();//刷新显示
               });
               if (window.openQD) {
                   Laya.Scene.open("DQDView.scene", false, { Handler: Handler });
               } else {
                   Handler.run();
               }

               Laya.timer.clear(this, this.showdaojishi);
               Laya.timer.clear(this, this.daojishiAni);//关闭倒计时的动画
               window.GameUI_this.GameOver();//游戏结束

           }
       }
       WXPHB() {//更新微信排行榜
           if (!wx$2) { return }
           wx$2.setUserCloudStorage({
               KVDataList: [{ "key": "score", "value": window.player.curLevel + "" }],
               success: res => {
                   console.log(res);
                   // // 让子域更新当前用户的最高分，因为主域无法得到getUserCloadStorage;
                   // let openDataContext = wx.getOpenDataContext();
                   // openDataContext.postMessage({
                   //     type: 'updateMaxScore',
                   // });
                   console.log("更新微信数据成功");
               },
               fail: res => {
                   console.log(res);
               }
           });
       }
       //0 进入排行版首页  1获取下一页  -1获取上一页
       wxkfsjy(tf) {//打开微信开放数据域

           window.GameUI_this.wxopenyu.visible = true;
           window.GameUI_this.wxopenyu.active = true;
           if (wx$2) {//微信
               var openDataContext = wx$2.getOpenDataContext();
               if (tf == 0) {
                   openDataContext.postMessage({
                       type: 'getonce',//获取第一页
                       opid: window.P_oppid
                   });
               } else if (tf == 1) {
                   openDataContext.postMessage({
                       type: 'getnext',//获取下一页
                       opid: window.P_oppid
                   });
               } else if (tf == -1) {
                   openDataContext.postMessage({
                       type: "getlast",//获取上一页
                       opid: window.P_oppid
                   });
               }
           }
       }
       //0 进入排行版首页  1获取下一页  -1获取上一页
       wxkfsjy1(tf) {//打开微信开放数据域
           setTimeout(() => {
               window.GameUI_this.wxopenyu.width = window.GameUI_this.wxopenyu.width;
           }, 500);
           window.GameUI_this.wxopenyu.postMsg({ xx: "shgjahsg" });
           window.GameUI_this.wxopenyu.visible = true;
           window.GameUI_this.wxopenyu.active = true;
           window.GameUI_this.wxopenyu.pos(0, 0);
           if (wx$2) {//微信
               var openDataContext = wx$2.getOpenDataContext();
               if (tf == 0) {
                   openDataContext.postMessage({
                       type: 'getonce',//获取第一页
                       opid: window.P_oppid
                   });
               } else if (tf == 1) {
                   openDataContext.postMessage({
                       type: 'getnext',//获取下一页
                       opid: window.P_oppid
                   });
               } else if (tf == -1) {
                   openDataContext.postMessage({
                       type: "getlast",//获取上一页
                       opid: window.P_oppid
                   });
               }
           }
       }
       //弹窗
       tanchuangdonghua(panl, fun = null, caller = this) {
           panl.pivot(panl.width / 2, panl.height / 2);
           panl.scaleY = 0;
           Laya.Tween.to(panl, { scaleY: 1 }, 800, Laya.Ease.backOut, Laya.Handler.create(caller, function () {
               if (fun != null) {
                   fun();
               }
           }), null, false);
       }
       //刷新GameOver面板显示
       RefreshGameOverPanel() {
           window.GameUI_this.gameoverLevel.value = window.player.curLevel + 1;//显示当前关卡
           window.GameUI_this.GameOverJinBi.text = window.GameUI_this.curLevelgold;//显示当前金币
       }
       /**
        * 金币领取 并跳转到主界面
        * @param {*} isWatchTheVideo 是否观看视屏
        * @param {*} viewID 当前界面的id 跳转到主界面
        * @param {*} callback 回调方法
        * @param {*} beishu 领取倍数
        */
       click_JinBiLinQu(isWatchTheVideo, viewID = null, callback = null, beishu = 1) {
           window.GameUI_this.game_ceng.visible = false;
           if (isWatchTheVideo) {
               //看完视频再领取
               window.FIG.GG_all(true, Laya.Handler.create(this, function () {
                   window.player.gold += beishu * window.GameUI_this.curLevelgold;//领取金币
                   window.FIG.TiShiKuang("分享成功");
                   this.RefreshJinBi();//刷新金币显示
               }), Laya.Handler.create(this, function () {//观看失败跳出
                   window.FIG.TiShiKuang("分享失败");
               }));


           } else {
               window.player.gold += window.GameUI_this.curLevelgold;//领取金币
           }
           // window.GameUI_this.PlayMusic(0);//播放背景音乐
           window.GameUI_this.PlaySound(6);
           window.GameUI_this.curLevelgold = 0;//清空金币临时存储
           this.RefreshJinBi();//刷新金币显示
           if (callback != null) {
               callback();
           }
           if (viewID != null) {
               this.ViewToView(viewID, 0, true, false);//跳转到主界面
           }
           this.closeRotate();
           window.GameUI_this.back.x = window.GameUI_this.oldbaPos.x;
           window.GameUI_this.back.y = window.GameUI_this.oldbaPos.y;
           // this.jinbidonghua(10,{x:375,y:655},{x:66,y:66})
           if (window.openQD) {
               Laya.Scene.open("XQDView.scene", false);
           }

       }
       /**
        * 切换角色
        * @param {*} direction 0左  1右
        */
       click_qiehuan(direction) {
           if (direction == 1) {
               if (this.ZJMcore == window.skin.core_skin.length - 1) {
                   this.ZJMcore = 0;
               } else {
                   this.ZJMcore++;
               }

               // if (window.player.curCore == window.player.maxCore) {
               //     window.player.curCore = 0;
               // }else{
               //     window.player.curCore += 1;
               // }
           } else {
               if (this.ZJMcore == 0) {
                   this.ZJMcore = window.skin.core_skin.length - 1;
               } else {
                   this.ZJMcore--;
               }
               // if (window.player.curCore == 0) {
               //     window.player.curCore = window.player.maxCore;
               // }else{
               //     window.player.curCore -= 1;
               // }
           }
           if (window.player.maxCore >= this.ZJMcore) {
               window.player.curCore = this.ZJMcore;
           } else {
               window.player.curCore = window.player.maxCore;
           }
           this.RefreshJieSuo();
           this.RefreshPlayer();//刷新角色显示
       }
       //刷新解锁标志
       RefreshJieSuo() {
           if (window.player.curCore < this.ZJMcore) {
               window.GameUI_this.ZJM_suo.visible = true;
               window.GameUI_this.ZJM_jiesuo.visible = true;
               window.GameUI_this.ZJM_jiesuo.text = (this.ZJMcore * 2) + "级解锁";
               this.heroLock = false;
           } else {
               this.heroLock = true;
               window.GameUI_this.ZJM_suo.visible = false;
               window.GameUI_this.ZJM_jiesuo.visible = false;
           }
       }

       //金币补给
       click_goldBuJi() {
           // window.GameUI_this.PlaySound(1);
           var id = window.GameUI_this.Buy.getChildAt(2).text * 1 - 1;
           this.bujigold = this.BuywupingQian(id);//
           window.GameUI_this.shouyi.text = this.GetJinBiStr(this.bujigold);
           this.ViewToView(0, 3, false, true);
           this.showpanel(window.GameUI_this.jinbibuji_back);
       }
       //体力补给
       click_tili_buji() {
           if (window.player.energy < 100) {
               window.FIG.GG_all(true, Laya.Handler.create(this, function () {
                   window.player.energy = 100;
                   this.RefreshTiLi();
                   this.SavePlayerMSG();
                   let gameThis = window.GameUI_this;
                   if (gameThis.tili_buji.setID) {
                       clearInterval(gameThis.tili_buji.setID);
                       gameThis.tili_buji.rotation = 0;
                       gameThis.tili_buji.setID = null;
                   }
               }), Laya.Handler.create(this, () => {
                   window.FIG.TiShiKuang("领取失败");
               }));
           } else {
               window.FIG.TiShiKuang("体力已满", 3000, false);
               let gameThis = window.GameUI_this;
               if (gameThis.tili_buji.setID) {
                   clearInterval(gameThis.tili_buji.setID);
                   gameThis.tili_buji.rotation = 0;
                   gameThis.tili_buji.setID = null;

               }
           }
       }
       //签到
       click_qiandao() {
           this.ViewToView(0, 4, false, true);
           this.RefreshQianDaoPanel();//刷新签到界面
           this.showpanel(window.GameUI_this.qiandaoBack);
       }
       //设置
       click_set() {
           window.GameUI_this.volume.getChildAt(0).visible = window.player.isVal;
           window.GameUI_this.volume.getChildAt(1).visible = !window.player.isVal;
           window.GameUI_this.zhengdong.getChildAt(0).visible = window.player.isZD;
           window.GameUI_this.zhengdong.getChildAt(1).visible = !window.player.isZD;

           this.ViewToView(0, 1, false, true);
           this.showpanel(window.GameUI_this.setting_cengBack);
       }

       //好友排行
       click_paihang() {
           window.FIG.GetUserInfo();
           this.ViewToView(0, 2, false, true);
           this.showpanel(window.GameUI_this.PaiHangBack);
           this.wxkfsjy(0);
       }
       /**
       * 点击购买装备按钮
       * @param {*} tf 0金币 1看视频 
       */
       click_BuyBtn(tf = 0) {
           for (var i = 0; i < window.player.bag.length; i++) {//
               if (window.player.bag[i] == null) {//判断玩家背包是否已满
                   if (tf == 0) {//jb
                       var id = window.GameUI_this.Buy.getChildAt(2).text * 1 - 1;//获得当前装备id
                       // //改变按钮上的显示
                       // window.GameUI_this.Buy.getChildAt(2).value = id;
                       // window.GameUI_this.Buy.getChildAt(3).value = this.GetJinBiStr(window.arsenal[id].buyPrice);
                       if (window.player.gold >= this.BuywupingQian(id)) {//够买
                           this.GouBuyOK(id, tf, i);
                       } else {//不够
                           this.click_goldBuJi();
                           console.log("钱不够");
                       }
                       return;
                   } else if (tf == 1) {
                       if (1) {//成功观看
                           this.GouBuyOK(id, tf, i);
                       } else {//不够
                           console.log("为观看广告");
                       }
                       return;

                   } else if (tf == 2) {
                       if (playerMSG.ZS >= sheshelist[id].zs) {//够买
                           this.GouBuyOK(id, tf, i);
                       } else {//不够
                           console.log("砖石不够");
                       }
                       return;
                   }
               }
           }
       }
       //显示游戏胜利
       ShowVictory() {
           this.ViewToView(13, 8, false, true);
           Laya.Tween.from(window.GameUI_this.xing, { x: Laya.stage.width / 2, y: Laya.stage.height / 2 }, 1000, Laya.Ease.linearIn, null, null, false);
           Laya.timer.frameLoop(1, this, this.rotateAni, [window.GameUI_this.SG]);
           this.RefreshVictory();//刷新游戏胜利界面
           window.GameUI_this.guanqia.value = window.curLevelInfo.grade;
           Laya.timer.once(2000, this, function () {
               this.closeRotate();
               this.ViewToView(8, 11, true, true);
               this.tanchuangdonghua(window.GameUI_this.JieSuanBack);
               if (window.curLevelInfo.grade % 10 == 0) {//当前关为boss关
                   Laya.timer.loop(1, window.GameUI_this.jinbiback, this.rotateAni, [window.GameUI_this.jinbiback]);
                   Laya.timer.loop(1, window.GameUI_this.anniuback, this.rotateAni, [window.GameUI_this.anniuback], false);//背景旋转
               }
           }, [], false);

       }
       //关闭旋转
       closeRotate() {
           Laya.timer.clearAll(window.GameUI_this.jinbiback);
           Laya.timer.clearAll(window.GameUI_this.anniuback);//背景旋转
           Laya.timer.clear(this, this.rotateAni);
       }
       //物体旋转
       rotateAni(obj) {
           obj.rotation += 1;
       }
       //刷新游戏胜利界面
       RefreshVictory() {
           if (window.curLevelInfo.grade % 10 != 0) {//当前关卡为普通关卡
               window.GameUI_this.SanBeiLingQu.visible = true;//切换三倍领取按钮
               window.GameUI_this.shibei.visible = false;
           } else {
               window.GameUI_this.SanBeiLingQu.visible = false;
               window.GameUI_this.shibei.visible = true;//切换到十倍领取按钮
           }
           window.GameUI_this.lastLevel.text = window.curLevelInfo.grade - 1 > 0 ? window.curLevelInfo.grade - 1 : 0;   //上一关
           window.GameUI_this.curLevel.text = window.curLevelInfo.grade;   //当前关
           window.GameUI_this.nextLevel.text = window.curLevelInfo.grade + 1;   //下一关

           window.GameUI_this.JieSuanshowjinbi.text = this.GetJinBiStr(window.GameUI_this.curLevelgold);//显示获得的金币 
       }
       //刷新角色的武器显示
       RefreshEquip() {
           for (let index = 0; index < knifeObjArr0.length; index++) {
               knifeObjArr0[index].texture = window.skin.outerKnife_skin[window.player.outerKnife];
           }
           for (let index = 0; index < knifeObjArr1.length; index++) {
               knifeObjArr1[index].texture = window.skin.outerKnife_skin[window.player.lnnerKnife];

           }
       }
       //刷新角色显示
       RefreshPlayer() {
           window.GameUI_this.playerCore.texture = window.skin.core_skin[this.ZJMcore];
           window.GameUI_this.playerCore.autoSize = true;
           var wh = {
               w: window.GameUI_this.playerCore.width,
               h: window.GameUI_this.playerCore.height
           };
           window.GameUI_this.playerCore.autoSize = false;
           window.GameUI_this.playerCore.width = wh.w;
           window.GameUI_this.playerCore.height = wh.h;
           window.GameUI_this.playerCore.pivot(wh.w / 2, wh.h / 2);
           window.GameUI_this.playerCore.x = window.GameUI_this.ZJM_player.pivotX;
           window.GameUI_this.playerCore.y = window.GameUI_this.ZJM_player.pivotY;
           if (this.ZJMcore == 5) {
               window.GameUI_this.playerCore.x = window.GameUI_this.ZJM_player.pivotX - 15;
           }
           if (window.player.biaoqingJieSuo) {
               var ran = window.GameUI_this.GetRandom(0, window.skin.biaoqing.length);//随机一个表情
               window.GameUI_this.biaoqing0.texture = window.skin.biaoqing[ran];
           }

       }
       //刷新武器等级显示 显示最高等级武器
       RefreshDengJi() {
           window.GameUI_this.dengji_back.getChildAt(1).text = window.player.EquipMaxId + 1;
       }
       //刷新zjm关卡显示
       RefreshLevel() {
           var curLevel = window.player.curLevel;
           for (let index = 1; index < 6; index++) {
               var num = (curLevel - 2 + index) > 0 ? (curLevel - 2 + index) : 0;//显示的关卡
               if (num % 10 == 0 && num != 0) {//boss关
                   window.GameUI_this.top.getChildAt(index).getChildAt(0).visible = false;
                   window.GameUI_this.top.getChildAt(index).getChildAt(1).visible = true;
               } else {
                   window.GameUI_this.top.getChildAt(index).getChildAt(0).visible = true;
                   window.GameUI_this.top.getChildAt(index).getChildAt(1).visible = false;
                   window.GameUI_this.top.getChildAt(index).getChildAt(0).text = num;
               }
           }

       }
       //初始化界面上的主角显示
       InitPlayer() {
           window.GameUI_this.ZJM_player.width = 238;
           window.GameUI_this.ZJM_player.height = 234;
           window.GameUI_this.ZJM_player.pivotX = window.GameUI_this.ZJM_player.width / 2;//设置玩家锚点
           window.GameUI_this.ZJM_player.pivotY = window.GameUI_this.ZJM_player.width / 2;

           // window.GameUI_this.playerCore.texture = window.skin.core_skin[window.player.curCore];
           window.GameUI_this.playerCore.loadImage(window.skin.core_skin[window.player.curCore], Laya.Handler.create(this, function () {
               window.GameUI_this.playerCore.autoSize = true;
               var wh = {
                   w: window.GameUI_this.playerCore.width,
                   h: window.GameUI_this.playerCore.height
               };
               window.GameUI_this.playerCore.autoSize = false;
               window.GameUI_this.playerCore.width = wh.w;
               window.GameUI_this.playerCore.height = wh.h;
               window.GameUI_this.playerCore.pivot(wh.w / 2, wh.h / 2);//设置玩家锚点
               window.GameUI_this.playerCore.x = window.GameUI_this.ZJM_player.pivotX;
               window.GameUI_this.playerCore.y = window.GameUI_this.ZJM_player.pivotY;
           }));
           var knifes0 = window.GameUI_this.ZJM_player.getChildAt(0);
           var knifes1 = window.GameUI_this.ZJM_player.getChildAt(1);

           knifes0.width = 300;
           knifes0.height = 300;
           knifes0.pivot(150, 150);
           knifes0.x = window.GameUI_this.ZJM_player.width / 2;
           knifes0.y = window.GameUI_this.ZJM_player.height / 2;

           knifes1.width = 500;
           knifes1.height = 500;
           knifes1.pivot(250, 250);
           knifes1.x = window.GameUI_this.ZJM_player.width / 2;
           knifes1.y = window.GameUI_this.ZJM_player.height / 2;
           for (let i = 0; i < 6; i++) {
               var knife = new Laya.Sprite();
               knifes0.addChild(knife);
               knife.texture = window.skin.outerKnife_skin[window.player.outerKnife];
               knife.pivot(knife.width / 2, knife.height / 2);
               knifeObjArr0.push(knife);
           }
           window.GameUI_this.RefreshPos(knifeObjArr0, 150);
           Laya.timer.frameLoop(1, this, function () {
               knifes0.rotation += 2;
           });
           for (let i = 0; i < 6; i++) {
               var knife = new Laya.Sprite();
               knifes1.addChild(knife);
               knife.texture = window.skin.lnnerKnife_skin[window.player.lnnerKnife];
               knife.pivot(knife.width / 2, knife.height / 2);
               knifeObjArr1.push(knife);
           }
           window.GameUI_this.RefreshPos(knifeObjArr1, 250);
           Laya.timer.frameLoop(1, this, function () {
               knifes1.rotation -= 2;
           });

           // var biaoqing = window.GameUI_this.ZJM_player.getChildAt(2);
           // biaoqing.texture = window.skin.biaoqing[0];
           // biaoqing.width = 29;
           // biaoqing.height = 26;
           // biaoqing.pivotX = biaoqing.width  / 2;//
           // biaoqing.pivotY = biaoqing.width  / 2;
           // biaoqing.x = 15;
           // biaoqing.y = 13;
       }
       //改变购买按钮上的显示
       RefreshBuy() {
           var id = window.GameUI_this.GetRandom(0, window.player.EquipMaxId + 1);//随机获得一件已解锁的装备
           //改变按钮上的显示
           window.GameUI_this.Buy.getChildAt(2).text = id + 1;
           window.GameUI_this.Buy.getChildAt(3).text = this.GetJinBiStr(window.arsenal[id].buyPrice);
       }
       //刷新玩家金币显示
       RefreshJinBi() {
           window.GameUI_this.jinbi_back.getChildAt(1).text = this.GetJinBiStr(window.player.gold);
           this.SavePlayerMSG();
       }
       //刷新玩家体力显示
       RefreshTiLi() {
           // window.GameUI_this.PlaySound(6);
           window.GameUI_this.tili_back.getChildAt(1).text = window.player.energy;
           this.SavePlayerMSG();
           let gameThis = window.GameUI_this;
           if (window.player.energy < 100 && !gameThis.tili_buji.setID) {
               this.setYaobai(gameThis.tili_buji);
           }
           if (window.player.energy >= 100 && gameThis.tili_buji.setID) {
               clearInterval(gameThis.tili_buji.setID);
               gameThis.tili_buji.rotation = 0;
               gameThis.tili_buji.setID = null;
           }

       }
       //获取金币的显示value
       GetJinBiStr(num) {
           var retVal = num;
           var jinbi = this.tranNum(num);
           retVal = jinbi.nub + jinbi.danwei;
           return retVal;
       }
       //解锁新英雄
       GetNewHero(caller) {
           if ((window.player.outerKnife + 1) % 2 != 0) {//武器每升2级解锁一个英雄
               return;
           }
           if (window.player.maxCore != (window.skin.core_skin.length - 1)) {
               window.GameUI_this.PlaySound(4);
               window.player.maxCore += 1;
               window.player.curCore = window.player.maxCore;
               caller.ZJMcore = window.player.maxCore;
               caller.RefreshJieSuo();
               caller.RefreshPlayer();
               caller.SavePlayerMSG();
           }

           window.GameUI_this.HeroBack.scaleY = 0;
           caller.ViewToView(0, 6, false, false);
           Laya.Tween.to(window.GameUI_this.HeroBack, { scaleY: 1 }, 200, Laya.Ease.backOut, Laya.Handler.create(this, function () {
               window.GameUI_this.NewHero.texture = window.skin.core_skin[window.player.maxCore];
               window.GameUI_this.NewHero.autoSize = true;
               var wh = {
                   w: window.GameUI_this.NewHero.width,
                   h: window.GameUI_this.NewHero.height
               };
               window.GameUI_this.NewHero.autoSize = false;
               window.GameUI_this.NewHero.width = wh.w;
               window.GameUI_this.NewHero.height = wh.h;
               window.GameUI_this.NewHero.pivot(wh.w / 2, wh.h / 2);
               if (window.player.maxCore == 5) {//解锁最后一个hero 调整位置
                   window.GameUI_this.NewHero.pos(361, 315);
               } else {
                   window.GameUI_this.NewHero.pos(375, 327);
               }
           }));
           window.GameUI_this.SaveInfo();
       }
       /**
        * 购物物品的真实价格
        * @param {*} index 物品id
        */
       BuywupingQian(index) {
           return window.arsenal[index].buyPrice;
       }
       //购买成功
       GouBuyOK(id, type, i) {


           if (type == 0) {//金币购买
               window.player.gold -= this.BuywupingQian(id);//玩家金币减少
               window.player.bag[i] = id;//玩家背包添加装备数据
               this.RefreshSlot(i);//刷新当前格子
               this.RefreshJinBi();//刷新金币界面
               this.RefreshBuy();//刷新购买按钮
           } else if (type == 1) {//视频

           } else if (type == 2) {//2砖石
               //playerMSG.ZS -= sheshelist[id].zs;
           }
           this.SavePlayerMSG();
       }
       //关闭排行榜
       closeLoginPanel() {
           window.GameUI_this.wxopenyu.visible = false;
           window.GameUI_this.wxopenyu.active = false;
           this.click_Quit(2);
       }
       //关闭界面
       click_Quit(ceng, fun = null, caller) {
           this.ViewToView(ceng, 0, true, false);
           if (fun != null) {
               fun(caller);
           }
           this.closeRotate();
       }
       //音量
       click_volume() {
           window.player.isVal = !window.player.isVal;
           if (window.GameUI_this.volume.getChildAt(0).visible == true) {
               window.GameUI_this.volume.getChildAt(0).visible = false;
               window.GameUI_this.volume.getChildAt(1).visible = true;
               Laya.SoundManager.setSoundVolume(0);
               Laya.SoundManager.setMusicVolume(0);//关闭声音
           } else {
               window.GameUI_this.volume.getChildAt(0).visible = true;
               window.GameUI_this.volume.getChildAt(1).visible = false;
               Laya.SoundManager.setSoundVolume(1);
               Laya.SoundManager.setMusicVolume(1); //打开声音
           }
           this.SavePlayerMSG();
       }
       //震动
       click_ZD() {
           window.player.isZD = !window.player.isZD;
           if (window.GameUI_this.zhengdong.getChildAt(0).visible == true) {
               window.GameUI_this.zhengdong.getChildAt(0).visible = false;
               window.GameUI_this.zhengdong.getChildAt(1).visible = true;


           } else {
               window.GameUI_this.zhengdong.getChildAt(0).visible = true;
               window.GameUI_this.zhengdong.getChildAt(1).visible = false;

           }
           this.SavePlayerMSG();
       }

       //刷新主界面
       Update_ZJM() {
           this.InitBag();//初始化背包
           this.RefreshJinBi();//刷新金币显示
           this.RefreshTiLi();//刷新体力显示
           this.RefreshBuy();//刷新购买按钮上的显示
           this.RefreshLevel();//刷新关卡显示
           this.RefreshDengJi();//刷新等级显示
           if (window.player.jieSuoHuoBan) {
               window.GameUI_this.huoban.visible = true;
               this.AddHuoBanDongHua();
           } else {
               window.GameUI_this.huoban.visible = false;

           }
       }
       /**
        * 初始化背包
        */
       InitBag() {
           for (let i = 0; i < window.player.bag.length; i++) {
               var curSlot = window.GameUI_this.slots.getChildByName("slot" + i);
               curSlot.getChildAt(1).visible = false;
               curSlot.MSG = {
                   index: i,//格子索引
                   equipID: window.player.bag[i]//装备ID
               };
           }
           this.RefreshBag();
       }

       /**
        * 刷新背包
        */
       RefreshBag() {
           window.GameUI_this.SaveInfo();

           for (let index = 0; index < window.player.bag.length; index++) {
               this.RefreshSlot(index);
           }
       }
       /**
        * 交换物品格子上的数据
        * @param {*} curSlotIndex 当前选中的格子索引
        * @param {*} otherSlotIndex 需要交换的格子索引
        */
       ExchangeItem(curSlotIndex, otherSlotIndex) {
           //交换数据
           window.GameUI_this.SaveInfo();
           var temp = window.player.bag[curSlotIndex];
           window.player.bag[curSlotIndex] = window.player.bag[otherSlotIndex];
           window.player.bag[otherSlotIndex] = temp;
           this.RefreshSlot(curSlotIndex);//刷新
           this.RefreshSlot(otherSlotIndex);//刷新
           this.SavePlayerMSG();
       }

       OneBondSyntha() {
           window.FIG.GG_all(false, Laya.Handler.create(this, function () {
               window.FIG.TiShiKuang("分享成功");
               this.OneBondSynth();
           }), Laya.Handler.create(this, () => {
               window.FIG.TiShiKuang("分享失败");
           }));
       }
       OneBondSynth() {
           let bag = window.player.bag;
           let isOver = this.Merge(bag);
           if (!isOver && isHeChengMax) {
               this.OneBondSynth();
           }
           bag.sort((a, b) => { return b - a });
           this.InitBag();

           window.player.outerKnife = window.player.bag[0];
           window.player.lnnerKnife = window.player.bag[0];
           window.player.EquipMaxId = window.player.bag[0];
           this.RefreshDengJi();
           this.RefreshEquip();
           // this.RefreshBag();
       }

       Merge(arr) {
           arr.sort();
           let len = arr.length - 1;
           let isOver = true;
           for (let i = 0; i < len; i++) {
               let level = arr[i];
               let nextItem = arr[i + 1];
               if (nextItem == null) break;
               if (level == nextItem && level < window.skin.lnnerKnife_skin.length - 1) {//可合成
                   arr[i + 1] = null;
                   arr[i] += 1;
                   i++;
                   isOver = false;
               }
           }
           return isOver;
       }

       /**
        * 刷新格子
        * @param {*} index 格子索引
        */
       RefreshSlot(index) {
           var slot = window.GameUI_this.slots.getChildByName("slot" + index);//获取页面中的背包格子
           slot.MSG.equipID = window.player.bag[index];//给装备栏添加装备信息
           var curItem = window.GameUI_this.slots.getChildByName("equip" + index);//获取格子上的装备
           curItem.offAll();//移除物品身上的所有事件
           if (slot.MSG.equipID != null) {//当前格子有物品

               // curItem.getChildAt(0).texture = window.skin.outerKnife_skin[window.player.bag[index]];//添加装备图片
               curItem.getChildAt(0).loadImage(window.skin.outerKnife_skin[window.player.bag[index]], Laya.Handler.create(this, function () {
                   curItem.getChildAt(0).autoSize = true;
                   var width = curItem.getChildAt(0).width;
                   var height = curItem.getChildAt(0).height;
                   curItem.getChildAt(0).autoSize = false;
                   curItem.getChildAt(0).pivotX = width / 2;
                   curItem.getChildAt(0).pivotY = height / 2;
                   curItem.getChildAt(0).pos(curItem.pivotX, curItem.pivotY);
                   // curItem.x = width/2;
                   // curItem.y= height/2;
                   curItem.getChildAt(0).width = width;
                   curItem.getChildAt(0).height = height;
                   let lv = curItem.getChildAt(1);
                   lv.visible = true;
                   lv.pos(curItem.pivotX, 120);
                   let tex = lv.getChildAt(0);
                   tex.text = "LV" + (slot.MSG.equipID + 1);
               }));



               curItem.on(Laya.Event.MOUSE_DOWN, this, this.ClickItemCallBack, [curItem, index]);//添加事件
           }
           else {//当前格子上没有物品
               curItem.getChildAt(1).visible = false;
               curItem.getChildAt(0).texture = "";
           }
           this.BtnScale();
           this.SavePlayerMSG();
       }
       /**
        * 点击物品的回调
        * @param {*} curItem 点击的装备
        * @param {*} index 装备所在格子索引
        */
       ClickItemCallBack(curItem, index) {
           // console.log("======")
           // console.log(index)

           Laya.Tween.to(window.GameUI_this.delet, { scaleX: 1.2, scaleY: 1.2 }, 300);
           if (window.player.bag[index] != null) {//当前格子有装备
               window.GameUI_this.PlaySound(15);
               curItem.zOrder = 9999;
               var slot = window.GameUI_this.slots.getChildByName("slot" + index);//找到装备图片
               slot.getChildAt(1).visible = true;
               for (let i = 0; i < window.player.bag.length; i++) {
                   var sloti = window.GameUI_this.slots.getChildByName("slot" + i);//找到装备图片
                   if (slot.MSG.equipID == sloti.MSG.equipID) {
                       sloti.getChildAt(1).visible = true;
                   }
               }
               this.oldPos = {
                   x: curItem.x,
                   y: curItem.y
               };
               //鼠标按下相对于item的偏移
               this.offest = {
                   x: curItem.x - window.GameUI_this.slots.mouseX,//Laya.stage.mouseX,
                   y: curItem.y - window.GameUI_this.slots.mouseY
               };
               Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.ItemFollow, [curItem]);
               Laya.stage.on(Laya.Event.MOUSE_UP, this, this.MouseOutCallBack, [curItem, index]);
           }

       }
       /**
        * 跟随鼠标移动
        * @param {*} item 移动的物品
        */
       ItemFollow(item) {
           item.x = window.GameUI_this.slots.mouseX + this.offest.x;
           item.y = window.GameUI_this.slots.mouseY + this.offest.y;

       }

       /**
        *  鼠标抬起回调
        * @param {*} selectItem 鼠标按下时选中的装备
        * @param {*} index 装备格子索引
        */
       MouseOutCallBack(selectItem, index) {
           Laya.Tween.to(window.GameUI_this.delet, { scaleX: 1, scaleY: 1 }, 300);
           selectItem.zOrder = 0;
           selectItem.off(Laya.Event.MOUSE_DOWN, this, this.ClickItemCallBack, [selectItem, index]);
           Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.ItemFollow);
           Laya.stage.off(Laya.Event.MOUSE_UP, this, this.MouseOutCallBack);
           window.GameUI_this.PlaySound(15);
           var selectSlot = window.GameUI_this.slots.getChildByName("slot" + index);//找到之前选择的格子
           var boo = false;
           for (let i = 0; i < window.player.bag.length; i++) {
               var curEquip = window.GameUI_this.slots.getChildByName("equip" + i);//找到装备
               var curSlot = window.GameUI_this.slots.getChildByName("slot" + i);//找到当前的格子 
               if (selectItem == curEquip) {//是同一件装备
                   continue;
               }
               if (this.RectangleCol(curEquip.x, curEquip.y, curEquip.width, curEquip.height, selectItem.x, selectItem.y, selectItem.width, selectItem.height)) {
                   boo = true;
                   if (selectSlot.MSG.equipID == curSlot.MSG.equipID && window.player.bag[i] < window.skin.lnnerKnife_skin.length - 1) {//格子上的装备id相同
                       //合成
                       if (window.player.bag[i] != 29) {//是否全部解锁
                           window.player.bag[i] += 1;//修改背包上的数据
                           window.GameUI_this.PlaySound(13);
                           window.player.bag[index] = null;
                           this.HeChengAni(selectItem, curEquip, Laya.Handler.create(this, (i, index) => {
                               this.RefreshSlot(i);//刷新格子
                               this.RefreshSlot(index);
                               if (window.player.bag[i] > window.player.EquipMaxId) {//是否为新解锁的装备
                                   window.player.EquipMaxId = window.player.bag[i];//修改已解锁的最高等级装备
                                   //修改当前装备
                                   window.player.outerKnife = window.player.bag[i];
                                   window.player.lnnerKnife = window.player.bag[i];
                                   //弹出界面
                                   Laya.timer.frameLoop(1, this, this.rotateAni, [window.GameUI_this.newEquipXG]);
                                   this.ViewToView(0, 7, false, true);
                                   window.GameUI_this.PlaySound(5);
                                   window.GameUI_this.newEquipLevel.text = window.player.bag[i] + 1;//显示新武器等级
                                   // window.GameUI_this.newEquip.texture = window.skin.outerKnife_skin[window.player.bag[i]];//显示装备图片
                                   window.GameUI_this.newEquip.loadImage(window.skin.outerKnife_skin[window.player.bag[i]], Laya.Handler.create(this, function () {
                                       window.GameUI_this.newEquip.pivot(window.GameUI_this.newEquip.width / 2, window.GameUI_this.newEquip.height / 2);
                                       window.GameUI_this.newEquip.x = 276;
                                       window.GameUI_this.newEquip.y = 277;
                                   }));
                                   this.RefreshDengJi();
                                   this.RefreshEquip();
                                   // selectItem.x = this.oldPos.x;  //复位
                                   // selectItem.y = this.oldPos.y;
                               }
                               selectItem.x = this.oldPos.x;  //复位
                               selectItem.y = this.oldPos.y;
                           }, [i, index]));
                       }
                       break;
                   } else {
                       this.ExchangeItem(i, index);//交换物品
                       selectItem.x = this.oldPos.x;  //复位
                       selectItem.y = this.oldPos.y;
                       break;
                   }

               }
           }
           for (let i = 0; i < window.player.bag.length; i++) {
               var sloti = window.GameUI_this.slots.getChildByName("slot" + i);//找到装备图片
               sloti.getChildAt(1).visible = false;
           }
           var delet = window.GameUI_this.delet;
           //出售装备
           if (!boo) {//防止同时碰到
               if (this.RectangleCol(delet.x, delet.y, delet.width, delet.height, selectItem.x, selectItem.y, selectItem.width, selectItem.height)) {
                   var id = window.player.bag[index];
                   window.player.bag[index] = null;
                   this.RefreshSlot(index);//刷新格子
                   window.player.gold += window.arsenal[id].sellPrice;//玩家金币增加
                   this.RefreshJinBi(); //刷新金币显示
               }
               selectItem.x = this.oldPos.x;  //复位
               selectItem.y = this.oldPos.y;
           }

           // selectItem.x = this.oldPos.x;  //复位
           // selectItem.y = this.oldPos.y;
       }

       BtnScale() {
           let bag = window.player.bag;
           let index = 0;
           for (let i = 0; i < bag.length; i++) {
               if (bag[i] != null) {
                   index++;
               }
           }
           if (index >= 8) {
               this.scaleTo = 0.8;
               this.scaleCome = 1;
               this.Time = 500;
               if (!this.TimeLine) {
                   let btn = window.GameUI_this.onePas;
                   this.TimeLine = Laya.TimeLine
                       .to(btn, { scaleX: this.scaleTo, scaleY: this.scaleTo }, this.Time)
                       .to(btn, { scaleX: this.scaleCome, scaleY: this.scaleCome }, this.Time);
                   this.TimeLine.play(0, true);
               }
               this.TimeLine.resume();
           } else {
               if (this.TimeLine) {
                   this.TimeLine.pause();
               }
           }
       }

       HeChengAni(obj0, obj1, Handler1, Handler2) {
           let obj1Pos = {
               x: null,
               y: null
           };
           obj1Pos.x = obj1.x;
           obj1Pos.y = obj1.y;
           obj0.x = obj1Pos.x - 50;
           obj0.y = obj1Pos.y;
           obj1.x = obj1Pos.x + 50;
           obj1.y = obj1Pos.y;
           window.GameUI_this.mouseEnabled = false;
           Laya.Tween.to(obj0, { x: obj1Pos.x, alpha: 0.2 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
               obj0.alpha = 1;
               if (Handler1) {
                   Handler1.run();
               }
               window.GameUI_this.mouseEnabled = true;
           }));
           Laya.Tween.to(obj1, { x: obj1Pos.x, alpha: 0.2 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
               obj1.alpha = 1;
               if (Handler2) {
                   Handler2.run();
               }
           }));
       }
       //保存数据
       SavePlayerMSG() {
           window.GameUI_this.SaveInfo();
           window.FIG.saveLocalData("玩家信息", window.player);
           window.FIG.saveLocalData("当前关卡", window.curLevelInfo);

       }
       //检测碰撞
       RectangleCol(x1, y1, w1, h1, x2, y2, w2, h2) {
           var re = false;
           var maxX, maxY, minX, minY;
           maxX = x1 + w1 >= x2 + w2 ? x1 + w1 : x2 + w2;
           maxY = y1 + h1 >= y2 + h2 ? y1 + h1 : y2 + h2;
           minX = x1 <= x2 ? x1 : x2;
           minY = y1 <= y2 ? y1 : y2;
           if (maxX - minX <= w1 + w2 && maxY - minY <= h1 + h2) {
               re = true;
           }
           return re;
       }

       /**
        * 打开页面
        * @param {*} whereid 从何id
        * @param {*} toid 去哪儿id
        * @param {*} isclose 是否关闭当前页面
        * @param {*} openOrCloseBcke 关闭或者开启背景
        */
       ViewToView(whereid, toid, isclose = true, openOrCloseBcke = false, func = null) {
           window.GameUI_this.PlaySound(3);
           if (isclose == true) {
               this.viewID[whereid].visible = false;

           }
           this.viewID[whereid].zOrder = -100;
           this.viewID[toid].visible = true;
           this.viewID[toid].zOrder = 100;
           if (openOrCloseBcke) {
               window.GameUI_this.back_back.visible = true;
               window.GameUI_this.back_back.zOrder = 1;
               window.GameUI_this.back_back.on(Laya.Event.CLICK, this, function () { });
           } else {
               window.GameUI_this.back_back.visible = false;

               // window.GameUI_this.visible = false;
               // window.GameUI_this.offAll();
           }
           if (func != null) {
               func();
           }
       }
       /**
       * 微信震动
       * @param {*} TF true,短 false 长
       */
       wxZD(TF) {
           if (window.GameUI_this.wx && window.player.isZD) {
               if (TF) {
                   window.GameUI_this.wx.vibrateShort();
               } else {
                   window.GameUI_this.wx.vibrateLong();
               }
           }
       }
   }

   class ItemPengZhuang extends Laya.Script {
       constructor() {
           super();

       }
       onEnable() {

       }


       onTriggerEnter(other) {
           if (other.owner == null || other.owner.MSG == undefined) {
               return;
           }

           if (other.owner.MSG.tag == "wall") {//碰到墙
               if (this.owner.MSG.NoFirst != null && !this.owner.MSG.NoFirst) {
                   this.owner.MSG.NoFirst = true;
                   return;
               }
               if (this.owner.MSG.NoFirst) {
                   var rig = this.owner.getComponent(Laya.RigidBody);
                   rig.setVelocity(GameUI_this.GetReflectVec(this.owner.forward, other.owner.MSG.normal));//改变速度方向
                   this.owner.forward = GameUI_this.GetReflectVec(this.owner.forward, other.owner.MSG.normal);
               }

           } else if (other.owner.MSG.tag == "knife0") {
               let Handler = Laya.Handler.create(window.GameUI_this, window.GameUI_this.Victory);
               Handler.run();
               if (window.openQD) {
                   Laya.Scene.open("DQDView.scene", false, {});
               }
           }

       }

   }

   class PengZhuang extends Laya.Script {

       constructor() {
           super();

       }

       onEnable() {
           this.isBaoZuo = false;
       }

       onDisable() {
       }
       //玩家的碰撞
       onTriggerEnter(other) {
           if (!window.GameUI_this.isStop && !window.GameUI_this.isInvincible) {//游戏没有暂停并且玩家不是无敌状态
               if (other.owner.MSG == undefined) { return; }
               if (other.owner.MSG.tag == "baozou") {
                   if (!this.isBaoZuo) {//玩家不是暴走状态时 进入暴走状态
                       this.isBaoZuo = true;
                       window.player.lnnerKnife_speed *= 2;//
                       window.player.outerKnife_speed *= 2;
                       this.owner.timerOnce(5000, this, function () {//五秒后恢复
                           window.player.lnnerKnife_speed /= 2;
                           window.player.outerKnife_speed /= 2;
                           this.isBaoZuo = false;//解除暴走状态
                       });
                   }
                   other.owner.destroy();
                   return;
               }
               if (other.owner.MSG.tag == "enemy" || other.owner.MSG.tag == "boss" || other.owner.MSG.tag == "zidan") {//碰到敌人
                   window.GameUI_this.EnterFuHuo();//进入复活时间
               } else if (other.owner.MSG.tag == "xing") {
                   // let Handler = Laya.Handler.create(window.GameUI_this, window.GameUI_this.Victory);
                   // Handler.run();
                   // if (window.openQD) {
                   //     Laya.Scene.open("DQDView.scene", false, {})
                   // }

                   // window.GameUI_this.Victory();//游戏胜利
               }

           }
       }
   }

   window.GameUI_this;//全局变量
   var otheruse = new OtherUse();;
   var wx$3 = Laya.Browser.window.wx;
   window.isGameQuit = false;

   window.openQD = false;

   //当前玩家
   window.player = {
       newbieGuide: { hechengZD: false, tongguanZD: false },
       curCore: 0,//玩家核心 0 1 2 
       maxCore: 0,//核心已解锁的最高等级
       grade: 0,//玩家等级
       // unLockSkinNum: [1, 1, 1],//玩家已解锁的皮肤数量 0玩家核心的皮肤数量 1玩家内圈刀的皮肤数量 2玩家外圈刀的皮肤数量
       isVal: true,//是否打开音量
       isZD: true,//是否震动
       gold: 2000,//玩家金币
       energy: 100,//玩家体力
       tilitimestart: 0,//上次玩家体力恢复的时间
       qd: { DQ: 0, lastTime: undefined },//记录签到时间
       lastOut: new Date().getTime(),
       jieSuoHuoBan: false,//是否解锁伙伴
       biaoqingJieSuo: false,//是否解锁表情
       lnnerKnife: 0,//玩家当前的主武器id
       outerKnife: 0,//玩家当前的副武器id

       lnnerKnife_Num: 3,//内圈刀的数量
       outerKnife_Num: 6,//外圈刀的数量

       lnnerKnife_speed: 10,//内圈刀旋转速度
       outerKnife_speed: -10,//外圈刀的旋转速度

       knife_radius: 200,//初始的飞刀旋转半径
       lnner_radius: 100,//内圈刀的旋转半径
       curLevel: 0,//当前关卡
       EquipMaxId: 0,//已解锁装备的最大等级
       bag: [0, 0, 0, 0, 0, null, null, 0, null, null, null, null],//玩家背包 存放物品id
   };

   var music = [
       {
           name: "背景音乐",//0
           url: "Other4M/res/yingxiao/zjmbg.mp3",
       },
       {
           name: "按钮音效",//1
           url: "XZDS/item/yingxiao/btn1.mp3",
       },
       {
           name: "警告音效",//2
           url: "XZDS/item/yingxiao/jingao0.mp3",
       },
       {
           name: "打开ui界面音效",//3
           url: "XZDS/item/yingxiao/down.mp3",
       },
       {
           name: "获得新英雄音效",//4
           url: "XZDS/item/yingxiao/hecheng.mp3",
       },
       {
           name: "获得新武器的音效",//5
           url: "XZDS/item/yingxiao/hecheng.mp3",
       },

       {
           name: "金币领取音效",//6
           url: "XZDS/item/yingxiao/gold.mp3",
       },
       {
           name: "玩家攻击音效",//7 ......
           url: "XZDS/item/yingxiao/buy.mp3",
       },
       {
           name: "敌人死亡音效",//8 ......
           url: "XZDS/item/yingxiao/btn1.mp3",
       },
       {
           name: "boss攻击音效",//9
           url: "XZDS/item/yingxiao/jiguang.mp3",
       },
       {
           name: "boss吐怪物音效",//10
           url: "XZDS/item/yingxiao/down2.mp3",
       },
       {
           name: "复活倒计时音效",//11
           url: "XZDS/item/yingxiao/btn0.mp3",
       },
       {
           name: "胜利音效",//12
           url: "XZDS/item/yingxiao/win.mp3",
       },
       {
           name: "合成音效",//13
           url: "XZDS/item/yingxiao/combine.mp3",
       },
       {
           name: "游戏音乐",//14
           url: "Other4M/res/yingxiao/bgm.mp3",
       },
       {
           name: "select音效",//15
           url: "XZDS/item/yingxiao/buy2.mp3",
       },
       {
           name: "金币掉落",//16
           url: "XZDS/item/yingxiao/coin.mp3",
       }
   ];
   //武器信息
   window.knifeInfo = {
       id: 0,//武器ID
       buff: 0,//武器buff
       texture: "",//皮肤路径
       grade: 0,//武器等级
       sellPrice: 0,//出售价格
       buyPrice: 0,//购买价格
       Attack: 40,//攻击力
   };
   window.chuchangURL = [
       "XZDS/Ani/chuchang/cctx1.atlas",
       "XZDS/Ani/chuchang/cctx2.atlas",
       "XZDS/Ani/chuchang/cctx3.atlas",
       "XZDS/Ani/chuchang/cctx4.atlas",
       "XZDS/Ani/chuchang/cctx5.atlas",
       "XZDS/Ani/chuchang/cctx6.atlas"
   ];
   //存储所有的武器信息
   window.arsenal = [];//索引表示武器id

   var curEquip = [null, null];

   //敌人信息
   window.enemyInfo = {
       id: 0,//敌人id
       type: 0,//敌人类型0  1  2  3 
       hp: 0,//敌人血量
       goldNum: 0,//敌人身上的金钱数量
       item: 0,//0 无  1 飞刀  2 药瓶
       // skill: 0,//敌人技能 0 1 2
       speed: 0,//移动速度
       // state: 1//敌人状态  不同状态颜色不同
   };

   var bossId = [0, 5, 7, 8];//bossID

   //当前关卡信息
   window.curLevelInfo = {
       grade: 0,//关卡等级
       type: 0,//关卡类型  普通关卡0  金币关卡1  Boss关卡2
       enemyType: [0, 1, 2],//当前关卡的敌人类型
       // enemyCreatPoint: [],//怪物生成点
       enemyNum: 50,//出现的敌人数量
       // enemyHp: { min: 0, max: 0 },//当前关卡的敌人血量范围
       // background: 0,//当前关卡背景
       wave: 7//敌人波数
   };

   //存放所有的皮肤url 索引表示id
   window.skin = {
       core_skin: [],//玩家核心的所有皮肤
       lnnerKnife_skin: [],//内圈刀的所有皮肤
       outerKnife_skin: [],//外圈刀的所有皮肤
       enemy_skin: [], //敌人皮肤 
       back0_skin: [],//关卡背景
       back1_skin: [],//关卡边框
       biaoqing: [],//玩家表情
       bullet_skin: []//子弹
   };

   //物体类型
   window.Type = {
       core: 0,//玩家
       enemy: 1,//敌人
       item: 2//物品
   };


   var outerKnifeObj = [];//存放玩家在游戏中的外圈刀物体
   var lnnerKnifeObj = [];//存放玩家在游戏中的内圈刀物体

   // this.outerKnifeParent;//外圈刀的父物体
   // this.lnnerKnifeParent;//内圈刀的父物体

   window.curLevelEnemys = [];//当前关卡存活的敌人
   window.curLevelItem = [];//当前关卡出现的道具

   var dhPath = [
       "Other4M/res/swdh/ci.atlas",
       "Other4M/res/swdh/qiu1.atlas",
       "Other4M/res/swdh/qiu2.atlas",
       "Other4M/res/swdh/qiu3.atlas",
       "Other4M/res/swdh/quan.atlas",
       "Other4M/res/swdh/yun.atlas",
       "Other4M/res/swdh/shoujiAni.atlas",//攻击效果6
       "Other4M/res/swdh/shoujitexiao.atlas"//攻击效果7
   ];
   class GameUI extends Laya.Scene {

       constructor() {
           super();
           window.GameUI_this = this;
           this.lastPos = new Laya.Point();
           this.nextPos = new Laya.Point();
       }

       onEnable() {
           let otherInfo = window.FIG.Player.playerConfig.otherInfo;
           if (otherInfo && otherInfo.player) {
               window.player = otherInfo.player;
           }

           if (otherInfo && otherInfo.level) {
               window.curLevelInfo = otherInfo.level;
           }


       }
       SaveInfo() {
           window.FIG.Player.playerConfig.otherInfo = { player: window.player, level: window.curLevelInfo };

       }
       Start() {

           // window.GameUI_this.zjmBG.texture = "Other4M/res/background/back0/bj_0.png";
           this.LoadEquip();//加载武器信息
           this.AddURL();//添加皮肤路径
           this.InitWallMSG();//注册墙的信息
           this.loadAllBoss();//加载所有的boss
           this.UIMMP();
           // this.PlayMusic(0);//播放背景音乐
           otheruse.Main();
           this.isSound = true;

           if (!window.player.newbieGuide.hechengZD) {
               this.newbieGuide();
               window.player.newbieGuide.hechengZD = true;
           }

       }
       //自适应
       UIMMP() {
           this.zjm_ceng.height = Laya.stage.height;
           this.height = Laya.stage.height;
           this.qiang4.y = Laya.stage.height;
           this.qiang1.height = Laya.stage.height;
           this.qiang2.height = Laya.stage.height;
           var zhishiyinarray = [
               { node: this.ZJM_player, y: 380 },
               { node: this.biaoqing0, y: 388 },
               { node: this.jinbi_back, y: 65 },
               { node: this.tili_back, y: 65 },
               { node: this.top, y: 170 },
               { node: this.setting_back, y: 227 },
               { node: this.gengduo_game, y: 380 },
               { node: this.haoyou_paihang, y: 606 },
               { node: this.center, y: 392.5 },
               { node: this.jinbi_buji, y: 307 },
               { node: this.tili_buji, y: 479 },
               { node: this.qiandao, y: 301 },
               { node: this.gamestart, y: 656 },
               { node: this.huoban, y: 500 },
               { node: this.lixianshouyi, y: 668 },
               // { node: this.floor, y: 373 },
               // { node: this.ZJM_player, y: 373 },
               // {node:this.slots,y:1031},
               { node: this.slotsBack, y: 1080 },
               // { node: this.onePas, y: 1277 },
               // {node:this.Buy,y:1268},


               { node: this.setting_cengBack, y: 455 },
               { node: this.PaiHangBack, y: 659 },
               { node: this.jinbibuji_back, y: 536 },
               { node: this.qiandaoBack, y: 603 },
               { node: this.lixianBack, y: 537 },
               { node: this.HeroBack, y: 932 },
               { node: this.sure, y: 1064 },
               { node: this.GetNewEquipBack, y: 290 },
               // {node:this.newEquip,y:567},
               // { node: this.back, y: 1334 },
               { node: this.game_phyCeng, y: 0 },
               { node: this.xingback, y: 100 },
               { node: this.xing, y: 100 },
               { node: this.wincen, y: 333 },
               { node: this.gameovercen, y: 328 },
               { node: this.GameOverBack, y: 774 },
               { node: this.JieSuanBack, y: 784 },
               { node: this.JieSuanTop, y: 351.5 },
               { node: this.FuHuoAnNiu, y: 898 },
               { node: this.DaoJiShiBack, y: 631 },
               { node: this.daojishiItems, y: 623 },
               { node: this.qiang4, y: 1334 },
               { node: this.qiang4, y: 1334 }
           ];
           // this.wxopenyu.height = Laya.stage.height;
           this.back_back.height = Laya.stage.height;
           // this.game_frame.height = Laya.stage.height;
           // this.game_back1.height = Laya.stage.height;
           this.back.y = Laya.stage.height;
           // this.zjmBG.height = Laya.stage.height;
           for (let index = 0; index < zhishiyinarray.length; index++) {
               zhishiyinarray[index].node.y = zhishiyinarray[index].y / 1334 * Laya.stage.height;
           }
       }
       /**
        * 开始游戏
        */
       GameStart() {
           this.isGameOver = false;//游戏是否结束
           this.isInvincible = false;//关闭无敌
           this.curLevelgold = 0;//当前关卡已获得的金币
           this.isStop = false;//游戏开始

           this.isTongGuan = false;
           // this.GetRanLevelRoad();//随机加载一张地图
           // this.GetCurBG();//得到当前地图并移动;
           this.LoadPlayer();//加载玩家
           if (this.tween0) {
               this.tween0.clear();
           }
           if (this.tween1) {
               this.tween1.clear();
           }
           if (this.tween2) {
               this.tween2.clear();
           }


           this.back.x = 0;
           this.back.y = Laya.stage.height - (this.game_frame.height - 3975);
           Laya.timer.once(1000, this, function () {//一秒后生成敌人
               this.CreatEnemy();//生成敌人
               this.BackMove();
           }, [], false);
           // this.BackMove();
           this.clearShowData();

       }
       /**地图移动 */
       BackMove(lujin) {
           this.back.x = 0;
           // this.game_ceng.y = Laya.stage.height - 1334;
           // this.back.y = Laya.stage.height;
           // this.back.y = Laya.stage.height - (this.game_frame.height - 3975);
           if (this.oldbaPos == undefined) {
               this.oldbaPos = new Laya.Point();
           }
           this.oldbaPos.x = this.back.x;
           this.oldbaPos.y = this.back.y;
           // this.back.y = 2591 - (Laya.stage.height - 1334)
           // console.log(Math.abs(2591 - Laya.stage.height + 1334 - this.back.y) * 10)
           console.log(Laya.stage.height);
           // 
           this.tween0 = Laya.Tween.to(this.back, { y: 2591 - Laya.stage.height + 1334 }, Math.abs(2591 - Laya.stage.height + 1334 - this.back.y) * 10, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
               this.tween1 = Laya.Tween.to(this.back, { x: 750 - 2668 }, Math.abs(750 - 2668 - this.back.x) * 10, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                   this.tween2 = Laya.Tween.to(this.back, { y: 3959 - Laya.stage.height + 1334 }, Math.abs(3959 - Laya.stage.height + 1334 - this.back.y) * 10, Laya.Ease.linearNone, Laya.Handler.create(this, () => {
                       console.log("成功");
                   }));
               }));
           }));
       }
       //注册墙的信息
       InitWallMSG() {
           this.qiang1.MSG = {
               tag: "wall",
               normal: { x: 1, y: 0 }
           };
           this.qiang2.MSG = {
               tag: "wall",
               normal: { x: -1, y: 0 }
           };
           this.qiang3.MSG = {
               tag: "wall",
               normal: { x: 0, y: 1 }
           };
           this.qiang4.MSG = {
               tag: "wall",
               normal: { x: 0, y: -1 }
           };
       }
       //添加皮肤路径
       AddURL() {
           for (let index = 0; index < 6; index++) {
               window.skin.core_skin[index] = "XZDS/res/player/core0/ZJ_" + index + ".png";//玩家url

           }
           for (let index = 0; index < 8; index++) {
               window.skin.biaoqing[index] = "XZDS/res/player/biaoqiang/bq_" + index + ".png";//玩家表情

           }
           for (let index = 0; index < 9; index++) {
               window.skin.outerKnife_skin[index] = "XZDS/res/equips/wq_" + index + ".png";//外层武器url

           }
           for (let index = 0; index < 9; index++) {
               window.skin.lnnerKnife_skin[index] = "XZDS/res/equips/wq_" + index + ".png";//内层武器url

           }
           for (let index = 0; index < 17; index++) {
               window.skin.enemy_skin[index] = "XZDS/res/enemys/gw_" + index + ".png";//敌人url

           }
           for (let index = 0; index < 4; index++) {
               window.skin.back0_skin[index] = "Other4M1/XZDS/res/background/back0/bj_" + index + ".png";//关卡背景url

           }
           for (let index = 0; index < 9; index++) {
               window.skin.back1_skin[index] = "Other4M/XZDS/res/background/back1/CJ_" + index + ".png";//关卡边框url

           }
           for (let index = 0; index < 7; index++) {
               window.skin.bullet_skin[index] = "XZDS/Ani/gjtx/gj_" + index + ".png";//子弹

           }
       }

       //加载所有的武器信息
       LoadEquip() {
           for (let index = 0; index < 28; index++) {
               var equip = {
                   id: index,//武器ID
                   texture: "",//皮肤路径
                   grade: index + 1,//武器等级
                   sellPrice: (index + 1) * 100,//出售价格
                   buyPrice: (index + 1) * 200,//购买价格
                   Attack: (index + 1) * 20,//攻击力
               };
               window.arsenal.push(equip);
           }
       }
       //随机加载一张地图
       GetRanLevelRoad() {
           var backIndex0 = this.GetRandom(0, window.skin.back0_skin.length);
           var backIndex1 = this.GetRandom(0, window.skin.back1_skin.length);
           // for (let index = 0; index < 3; index++) {
           // this.game_back1.texture = window.skin.back0_skin[backIndex0];
           this.game_back1.loadImage(window.skin.back0_skin[backIndex0], Laya.Handler.create(this, () => {
               // this.game_frame.height = this.game_frame.height / 1334 * Laya.stage.height;
               if (!this.loadover0) {
                   this.loadover0 = true;
                   this.game_back1.width = 2668;
                   this.game_back1.height = 3975;
                   this.game_back1.height = this.game_back1.height / 1334 * Laya.stage.height;
               }

               // this.BackMove();
           }));
           // }
           // this.game_back.texture = window.skin.back0_skin[backIndex0];
           // this.game_frame.texture = window.skin.back1_skin[backIndex1];
           this.game_frame.loadImage(window.skin.back1_skin[backIndex1], Laya.Handler.create(this, () => {
               if (!this.loadover1) {
                   this.game_frame.width = 2668;
                   this.game_frame.height = 3975;
                   this.loadover1 = true;
                   this.game_frame.height = this.game_frame.height / 1334 * Laya.stage.height;
                   // this.game_back1.height = this.game_back1.height / 1334 * Laya.stage.height;

               }
           }));
       }
       // //获取当前地图初始位置
       // GetCurBG() {
       //     this.oldPos = [];
       //     this.backGround = [];
       //     for (let index = 0; index < 3; index++) {
       //         this.backGround[index] = this.back.getChildAt(index);
       //         this.oldPos[index] = { x: this.backGround[index].x, y: this.backGround[index].y };
       //     }
       //     Laya.timer.frameLoop(1, this, this.BackMove);

       // }
       // //地图移动
       // BackMove() {
       //     for (let index = 0; index < this.backGround.length; index++) {
       //         this.backGround[index].y += 1;
       //         if (this.backGround[index].y > this.oldPos[2].y + this.backGround[index].height / 2) {
       //             this.backGround[index].y = this.oldPos[0].y;
       //             this.backGround.unshift(this.backGround[index]);
       //             this.backGround.pop();
       //         }
       //     }
       // }

       /**
        * 
        * 加载玩家
        */
       LoadPlayer() {
           //加载玩家核心
           this.curPlayer = new Laya.Sprite();
           this.game_phyCeng.addChild(this.curPlayer);//添加到物理层
           this.curPlayer.texture = window.skin.core_skin[window.player.curCore];
           this.biaoqing = new Laya.Sprite();//表情
           this.biaoqing.texture = window.skin.biaoqing[0];
           this.curPlayer.addChild(this.biaoqing);
           this.curPlayer.loadImage(window.skin.core_skin[window.player.curCore], Laya.Handler.create(this, function () {

               // this.curPlayer.width = 238;
               // this.curPlayer.height = 234;
               this.curPlayer.pivotX = this.curPlayer.width / 2;//设置玩家锚点
               this.curPlayer.pivotY = this.curPlayer.height / 2;

               this.biaoqing.pivot(this.biaoqing.width / 2, this.biaoqing.height / 2);
               this.curPlayer.x = Laya.stage.width / 2;//玩家初始位置
               this.curPlayer.y = Laya.stage.height * 3 / 4;
               this.biaoqing.pos(this.curPlayer.pivotX, this.curPlayer.pivotY);

           }));

           this.curPlayer.addComponent(PengZhuang);//添加玩家碰撞脚本
           var playerRig = this.curPlayer.addComponent(Laya.RigidBody);//添加刚体
           playerRig.bullet = true;
           playerRig.allowSleep = false;
           playerRig.allowRotation = false;
           playerRig.gravityScale = 0;
           var playerColl = this.curPlayer.addComponent(Laya.BoxCollider);//添加碰撞器
           playerColl.width = this.curPlayer.width / 2;
           playerColl.height = this.curPlayer.height / 2;
           playerColl.x = playerColl.width / 2;
           playerColl.y = playerColl.height / 2;

           playerColl.isSensor = true;//设置为触发器
           playerColl.label = "player";

           //注册玩家信息    
           this.curPlayer.MSG = {
               tag: "player",//玩家标签
               type: window.Type.core,//玩家类型
               id: window.player.curCore,//玩家ID

           };
           // Laya.Tween.to(this.curPlayer,{y:Laya.stage/4},1000,Laya.Ease.linearOut)
           //加载外圈刀的父物体
           this.outerKnifeParent = new Laya.Sprite();
           this.curPlayer.addChild(this.outerKnifeParent);//添加到玩家上
           this.outerKnifeParent.width = window.player.knife_radius * 2;
           this.outerKnifeParent.height = window.player.knife_radius * 2;

           var CircleCollider = this.outerKnifeParent.addComponent(Laya.CircleCollider);//添加碰撞器
           CircleCollider.radius = window.player.knife_radius;
           CircleCollider.isSensor = true;

           this.outerKnifeParent.pivot(window.player.knife_radius, window.player.knife_radius);
           this.outerKnifeParent.x = this.curPlayer.width / 2;
           this.outerKnifeParent.y = this.curPlayer.height / 2;

           var equipRig = this.outerKnifeParent.addComponent(Laya.RigidBody);//添加刚体
           // equipRig.bullet = true;
           //equipRig.allowSleep = false;
           // equipRig.type ="dynamic";
           equipRig.gravityScale = 0;

           curEquip[0] = window.arsenal[window.player.outerKnife];//获取当前武器信息
           //注册信息
           this.outerKnifeParent.MSG = {
               tag: "knife0",
               Attack: 45 * (window.player.outerKnife + 1),//curEquip[0].Attack,
               id: curEquip[0].id,//武器ID
               // buff: curEquip[0].buff
           };

           //加载内圈刀的父物体
           this.lnnerKnifeParent = new Laya.Sprite();
           this.curPlayer.addChild(this.lnnerKnifeParent);//添加到玩家上
           this.lnnerKnifeParent.width = window.player.lnner_radius * 2;
           this.lnnerKnifeParent.height = window.player.lnner_radius * 2;
           var CircleCollider = this.lnnerKnifeParent.addComponent(Laya.CircleCollider);//添加碰撞器
           CircleCollider.radius = window.player.lnner_radius;


           CircleCollider.isSensor = true;
           this.lnnerKnifeParent.pivot(window.player.lnner_radius, window.player.lnner_radius);
           this.lnnerKnifeParent.x = this.curPlayer.width / 2;
           this.lnnerKnifeParent.y = this.curPlayer.height / 2;
           var linequipRig = this.lnnerKnifeParent.addComponent(Laya.RigidBody);//添加刚体
           linequipRig.bullet = true;
           //linequipRig.allowSleep = false;
           equipRig.allowRotation = true;
           linequipRig.gravityScale = 0;
           curEquip[1] = window.arsenal[window.player.lnnerKnife];//获取当前武器信息
           //注册信息
           this.lnnerKnifeParent.MSG = {
               tag: "knife1",
               Attack: 20 * (window.player.lnnerKnife + 1),
               id: curEquip[1].id,//武器ID
               buff: curEquip[1].buff
           };
           lnnerKnifeObj = [];
           outerKnifeObj = [];
           //加载主武器
           for (let i = 0; i < window.player.lnnerKnife_Num; i++) {
               var knife = new Laya.Sprite();
               this.lnnerKnifeParent.addChild(knife);
               // knife.pos(this.curPlayer.pivotX,this.curPlayer.pivotY)

               knife.texture = window.skin.lnnerKnife_skin[window.player.lnnerKnife];
               knife.pivot(knife.width / 2, knife.height / 2);
               lnnerKnifeObj.push(knife);
           }
           this.RefreshPos(lnnerKnifeObj, window.player.lnner_radius);
           //加载副武器
           for (let i = 0; i < window.player.outerKnife_Num; i++) {
               var knife = new Laya.Sprite();
               knife.texture = window.skin.outerKnife_skin[window.player.outerKnife];
               this.outerKnifeParent.addChild(knife);
               knife.pivot(knife.width / 2, knife.height / 2);
               outerKnifeObj.push(knife);
           }
           this.curPlayer.visible = false;
           Laya.timer.once(1000, this, () => {
               this.curPlayer.visible = true;
           }, [], false);

           Laya.timer.once(1500, this, () => {
               // this.curPlayer.scaleX = 0;
               // this.curPlayer.scaleY = 0;
               this.curPlayer.visible = true;
               // Laya.Tween.to(this.curPlayer, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.quadOut, Laya.Handler.create(this, () => {
               this.playerControl();//
               console.log("打开控制");
               // }), null, false), [], false
           }, [], false);

           // Laya.Tween.to(this.curPlayer, { y: Laya.stage.height * 3 / 4 }, 1000, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
           var chuchangurl = window.chuchangURL[window.player.curCore];
           // chuchangurl = window.chuchangURL[4];
           var ani = new Laya.Animation();

           ani.loadAtlas(chuchangurl, Laya.Handler.create(this, () => {
               Laya.stage.addChild(ani);
               for (let index = 0; index < ani._frames.length; index++) {
                   var one = ani._frames[index]._one;
                   one.x = -one.width / 2;
                   one.y = -one.height / 2;
               }
               // var fra = ani._frames[0]._one.texture;
               ani.pos(this.curPlayer.x, this.curPlayer.y);
               if (window.player.curCore = 1) {
                   ani.x -= 20;
               }
               ani.play(0, false);
               ani.on(Laya.Event.COMPLETE, this, () => {
                   // this.curPlayer.scaleX = 0;
                   // this.curPlayer.scaleY = 0;
                   // this.curPlayer.visible = true;
                   // Laya.Tween.to(this.curPlayer, { scaleX: 1, scaleY: 1 },300,Laya.Ease.quadOut)
                   if (ani) {
                       ani.destroy();
                   }
               });
               // this.curPlayer.scaleX = 0;
               // this.curPlayer.scaleY = 0;
               // this.curPlayer.visible = true;
               // Laya.Tween.to(this.curPlayer, { scaleX: 1, scaleY: 1 }, 300, Laya.Ease.quadOut, Laya.Handler.create(this, () => {
               //     this.playerControl();//玩家控制器
               // }))
           }));
           // }), 0, false)
           this.RefreshPos(outerKnifeObj, window.player.knife_radius);//刷新飞刀位置
           window.player.lnnerKnife_speed = 10;
           window.player.outerKnife_speed = -10;
           this.KnifeRotate();//开启飞刀旋转
           if (window.player.jieSuoHuoBan) {//解锁伙伴
               this.AddHuoBan();
           }
       }
       //添加伙伴
       AddHuoBan() {
           this.huoBan = new Laya.Sprite();
           Laya.stage.addChild(this.huoBan);
           this.huoBan.loadImage("XZDS/res/player/x_0.png", Laya.Handler.create(this, function () {
               this.huoBan.pivot(this.huoBan.width / 2, this.huoBan.height / 2);
               this.huoBan.pos(Laya.stage.width / 2 - 50, Laya.stage.height + 70);
               var coll = this.huoBan.addComponent(Laya.BoxCollider);
               coll.isSensor = true;
               coll.width = this.huoBan.width / 2;
               coll.height = this.huoBan.height / 2;
               coll.x = this.huoBan.pivotX / 2;
               coll.y = this.huoBan.pivotY / 2;

               var rig = this.huoBan.addComponent(Laya.RigidBody);
               rig.gravityScale = 0;
               rig.allowSleep = false;
               this.huoBan.MSG = {
                   tag: "huoban",
                   NoFirst: false
               };
               this.huoBan.addComponent(ItemPengZhuang);
               var ranFanXiang = this.GetRandomDic(0, 361);
               ranFanXiang.x = Math.floor(ranFanXiang.x * 100) / 100;
               ranFanXiang.y = Math.floor(ranFanXiang.y * 100) / 100;
               this.huoBan.forward = { x: ranFanXiang.x * 3, y: ranFanXiang.y * 3 };
               Laya.Tween.to(this.huoBan, { y: Laya.stage.height * 3 / 4 + 50 }, 500, Laya.Ease.linearIn, Laya.Handler.create(this, function () {
                   rig.setVelocity({ x: ranFanXiang.x * 3, y: ranFanXiang.y * 3 });
                   Laya.timer.loop(1000, this, this.HuoBanSkill);
               }), null, false);
               window.curLevelItem.push(this.huoBan);
           }));
       }
       /**
        * 刷新所有飞刀位置
        * @param {*} objArr 飞刀数组
        * @param {*} radius 旋转半径
        */
       RefreshPos(objArr, radius) {
           var angle = 360 / objArr.length;//相邻两个飞刀之间的夹角
           Laya.timer.clear(this, this.rotate);
           for (let i = 0; i < objArr.length; i++) {
               objArr[i].rotation = 0;//恢复到初始旋转角度
               var interval = angle * i;
               objArr[i].rotation = 90 + interval;//调整飞刀角度
               objArr[i].x = radius + radius * Math.cos(interval * Math.PI / 180);//转弧度
               objArr[i].y = radius + radius * Math.sin(interval * Math.PI / 180);

               // var objx = radius + radius * Math.cos(interval * Math.PI / 180);//转弧度
               // var objy = radius + radius * Math.sin(interval * Math.PI / 180);

               // Laya.Tween.to(objArr[i],{x:objx,y:objy},1000,Laya.Ease.linearIn,null,500,false)
           }
           //  this.KnifeRotate(objParent, speed);//旋转
       }

       //玩家控制
       playerControl() {
           Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.OnMouseDown);//鼠标按下
           Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.OnMouseUP);//鼠标离开
           Laya.stage.on(Laya.Event.MOUSE_UP, this, this.OnMouseUP);//鼠标抬起
       }
       //鼠标按下
       OnMouseDown() {
           this.dx = this.curPlayer.x - Laya.stage.mouseX;
           this.dy = this.curPlayer.y - Laya.stage.mouseY;
           this.lastPos.x = Laya.stage.mouseX;
           this.lastPos.y = Laya.stage.mouseY;

           Laya.stage.on(Laya.Event.MOUSE_MOVE, this, this.PlayerMove);//鼠标按住移动
           Laya.stage.on(Laya.Event.MOUSE_OUT, this, this.OnMouseUP);//鼠标离开
           Laya.stage.on(Laya.Event.MOUSE_UP, this, this.OnMouseUP);//鼠标抬起
       }
       //鼠标抬起
       OnMouseUP() {
           Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.PlayerMove);//删除鼠标移动的监听
           Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.OnMouseUP);//删除鼠标移动的监听
           Laya.stage.off(Laya.Event.MOUSE_UP, this, this.OnMouseUP);//删除鼠标移动的监听

       }
       //玩家移动
       PlayerMove() {
           this.nextPos.x = Laya.stage.mouseX;
           this.nextPos.y = Laya.stage.mouseY;
           if (this.nextPos.x - this.lastPos.x > 0 && this.curPlayer.x < Laya.stage.width || this.nextPos.x - this.lastPos.x < 0 && this.curPlayer.x > 0) {
               this.curPlayer.x = this.dx + Laya.stage.mouseX;
           } else {
               this.dx = this.curPlayer.x - Laya.stage.mouseX;
           }
           if (this.nextPos.y - this.lastPos.y > 0 && this.curPlayer.y < Laya.stage.height || this.nextPos.y - this.lastPos.y < 0 && this.curPlayer.y > 0) {
               this.curPlayer.y = this.dy + Laya.stage.mouseY;
           } else {
               this.dy = this.curPlayer.y - Laya.stage.mouseY;
           }
           this.lastPos.x = this.nextPos.x;
           this.lastPos.y = this.nextPos.y;

       }
       //伙伴技能
       HuoBanSkill() {
           var ran = this.GetRandom(0, window.curLevelEnemys.length);
           var target = window.curLevelEnemys[ran];
           if (target == undefined) { return }//没有敌人
           var skill = Laya.Pool.getItemByClass("skill", Laya.Sprite);
           this.game_phyCeng.addChild(skill);
           skill.pos(this.huoBan.x, this.huoBan.y);
           skill.loadImage("XZDS/Ani/gjtx/gj_4.png", Laya.Handler.create(this, function () {
               skill.pivot(skill.width / 2, skill.height / 2);
               var coll = skill.getComponent(Laya.BoxCollider);
               if (coll == null) {
                   coll = skill.addComponent(Laya.BoxCollider);
               }
               coll.isSensor = true;
               coll.width = skill.width / 2;
               coll.height = skill.height / 2;
               coll.x = skill.pivotX / 2;
               coll.y = skill.pivotY / 2;

               var rig = skill.getComponent(Laya.RigidBody);
               if (rig == null) {
                   rig = skill.addComponent(Laya.RigidBody);
               }
               rig.gravityScale = 0;
               rig.allowSleep = false;
               rig.bullet = true;
               skill.MSG = {
                   tag: "skill",
                   Attack: 100,
                   speed: 10
               };
               skill.forward = {
                   x: target.x - skill.x,
                   y: target.y - skill.y
               };
               this.EnemyMove(skill, skill.forward);
               // window.curLevelItem.push(skill);
           }));
           Laya.timer.once(5000, this, function () {//五秒后回收
               skill.removeSelf();
               Laya.Pool.recover("skill", skill);
           }, [], false);
       }

       /**
        * 飞刀旋转
        */
       KnifeRotate() {
           Laya.timer.frameLoop(1, this, this.rotate);
       }
       rotate() {
           this.outerKnifeParent.rotation += window.player.outerKnife_speed;
           this.lnnerKnifeParent.rotation += window.player.lnnerKnife_speed;
       }

       //进入玩家复活面板
       EnterFuHuo() {
           this.isStop = true;//游戏暂停;       
           this.stopTime = 6000;//暂停6秒

           window.player.lnnerKnife_speed = 10;//内圈刀旋转速度
           window.player.outerKnife_speed = -10;//外圈刀的旋转速度
           this.ClearMouseMonitor();//停止玩家移动
           for (let index = 0; index < window.curLevelEnemys.length; index++) {
               var pZ = window.curLevelEnemys[index].getComponent(EnemyPengZhuang);
               if (pZ == null) { return }
               pZ.attackTeXiao.stop();//关闭动画
               pZ.attackTeXiao.visible = false;
           }
           if (this.huoBan != null) {
               this.huoBanRig = this.huoBan.getComponent(Laya.RigidBody);
               this.huoBanRig.setVelocity({ x: 0, y: 0 });
           }
           this.jindu.pause();//怪物生成进度条暂停
           // this.curPlayerX = this.curPlayer.x;//记录死亡时的位置
           // this.curPlayerY = this.curPlayer.y;//记录死亡时的位置
           this.curPlayer.visible = false;
           otheruse.ViewToView(13, 12, false, true, function () {
               otheruse.FuHuoDaoJiShi();
           });//打开复活倒计时面板
       }
       //关闭timer
       closeAllTimer() {
           // Laya.timer.clear(this, this.BackMove);//关闭地图移动
           Laya.timer.clear(this, this.creatOneWave);//关闭每一波敌人的生成
           Laya.timer.clear(this, this.getOneEnemy);//关闭每一个敌人的生成
           Laya.timer.clear(this, this.creatGoldEnemy);//关闭奖励关金币的生成
           Laya.timer.clear(this, this.gensui);//关闭敌人的跟随
           Laya.timer.clear(this, this.rotate);//关闭飞刀旋转
           /**关闭敌人的攻击 */
           Laya.timer.clear(this, this.bossAI);

           Laya.timer.clear(this, this.HuoBanSkill);//关闭伙伴攻击

       }
       //游戏结束
       GameOver() {
           window.isGameQuit = false;
           this.clearObj();
       }
       //清空游戏显示
       clearShowData() {
           this.jinbishow.text = "000";

       }
       //清空游戏
       clearObj() {
           // var jinbiArr = Laya.Pool.getPoolBySign("jinbi");
           // console.log(jinbiArr);
           // for (let index = 0; index < jinbiArr.length; index++) {
           //     jinbiArr[index].destroy();

           // }
           for (let index = 0; index < window.jinbiArr.length; index++) {
               if (window.jinbiArr[index]) {
                   // window.jinbiArr[index].destroy();
                   window.jinbiArr[index].removeSelf();

               }
           }
           window.jinbiArr = [];
           this.isGameOver = true;//游戏结束 
           Laya.Tween.clear(this.jindu);//关闭敌人生成进度
           this.bar.x = -482;//恢复进度条初始位置
           this.closeAllTimer();//关闭timer
           Laya.Pool.clearBySign("skill");

           if ((window.curLevelInfo.grade + 1) % 10 == 0) {//当前为boss关
               this.mArmature.stop();
               this.mArmature.removeSelf();

               let coll = this.boss.getComponent(Laya.BoxCollider);
               let rig = this.boss.getComponent(Laya.RigidBody);
               if (coll) {
                   coll.destroy();
               }
               if (rig) {
                   rig.destroy();
               }
               if (this.boss) {
                   this.boss.destroy();
               }
           }

           for (let index = 0; index < window.curLevelEnemys.length; index++) {//移除所有敌人
               var pZ = window.curLevelEnemys[index].getComponent(EnemyPengZhuang);
               if (pZ == null) { continue }
               if (pZ.attackTeXiao) {
                   pZ.attackTeXiao.destroy();
               }
               if (window.curLevelEnemys[index]) {
                   window.curLevelEnemys[index].destroy();
               }
           }
           // for (let index = 0; index < 3; index++) {//恢复地图原始位置
           //     this.back.getChildAt(index).x = this.oldPos[index].x;
           //     this.back.getChildAt(index).y = this.oldPos[index].y;
           // }
           for (let index = 0; index < window.curLevelItem.length; index++) {//移除出现的道具
               if (window.curLevelItem[index]) {
                   window.curLevelItem[index].destroy();
               }
           }
           outerKnifeObj = [];//清空外圈刀物体
           lnnerKnifeObj = [];//清空内圈刀物体
           window.curLevelItem = [];//清空场景中出现的道具物体
           window.curLevelEnemys = [];
           Laya.timer.frameOnce(1, this, function () {
               let coll0 = this.outerKnifeParent.getComponent(Laya.CircleCollider);
               let rig0 = this.outerKnifeParent.getComponent(Laya.RigidBody);
               if (rig0) {
                   rig0.destroy();
               }
               if (coll0) {
                   coll0.destroy();

               }
               if (this.outerKnifeParent) {
                   this.outerKnifeParent.destroy();
               }



               let coll1 = this.lnnerKnifeParent.getComponent(Laya.CircleCollider);
               let rig1 = this.lnnerKnifeParent.getComponent(Laya.RigidBody);


               let coll2 = this.curPlayer.getComponent(Laya.BoxCollider);
               let rig2 = this.curPlayer.getComponent(Laya.RigidBody);
               if (rig2) {
                   rig2.destroy();
               }
               if (coll1) {
                   coll1.destroy();

               }
               if (rig1) {
                   rig1.destroy();
               }
               if (coll2) {
                   coll2.destroy();

               }
               if (this.curPlayer) {
                   this.curPlayer.destroy();//销毁角色
               }

           });
       }
       //游戏胜利
       Victory() {
           console.log("游戏胜利");
           window.GameUI_this.PlaySound(12);
           this.clearObj();//清除数据
           this.RefreshLevelInfo();//进入下一关
           otheruse.ShowVictory();//显示游戏胜利界面
           otheruse.RefreshLevel();//刷新主界面关卡显示
           this.ClearMouseMonitor();//解除玩家的控制
           otheruse.SavePlayerMSG();//保存数据
           otheruse.WXPHB();//更新排行榜数据
       }
       //刷新关卡信息
       RefreshLevelInfo() {
           window.curLevelInfo.grade++;//下一关
           window.player.curLevel = window.curLevelInfo.grade;
           if ((window.curLevelInfo.grade + 1) % 10 == 0) {
               window.curLevelInfo.type = 2;//boss关
           } else if ((window.curLevelInfo.grade + 1) % 5 == 0) {
               window.curLevelInfo.type = 1;//金币关
           } else {
               window.curLevelInfo.type = 0;//普通关
           }
           window.curLevelInfo.enemyType = [];
           var tempArr = [];

           //随机敌人
           for (let i = 0; i < 12; i++) {
               tempArr.push(i);
           }
           for (let j = 0; j < 4; j++) {
               window.curLevelInfo.enemyType[j] = this.GetRandom(0, tempArr.length);
               var index = tempArr.indexOf(window.curLevelInfo.enemyType[j]);
               tempArr.splice(index, 1);
           }

           window.player.lnnerKnife_speed = 10;//内圈刀旋转速度
           window.player.outerKnife_speed = -10;//外圈刀的旋转速度

       }
       //解除玩家的控制
       ClearMouseMonitor() {
           Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.OnMouseDown);//鼠标按下
           Laya.stage.off(Laya.Event.MOUSE_UP, this, this.OnMouseUP);//鼠标抬起
           Laya.stage.off(Laya.Event.MOUSE_MOVE, this, this.PlayerMove);//鼠标按住移动
           Laya.stage.off(Laya.Event.MOUSE_OUT, this, this.OnMouseUP);
       }
       //***************************************************敌人*****************************************************
       //警告Tween动画
       JinGaoTween(item) {
           var scale = item.scaleX == 1 ? 1.05 : 1;
           Laya.Tween.to(item, { scaleX: scale, scaleY: scale }, 400, Laya.Ease.linearOut, Laya.Handler.create(this, this.JinGaoTween, [item]), 0, false);

       }
       //生成敌人
       CreatEnemy() {
           //普通关卡
           this.isShow = false;//敌人是否全部出现
           this.stopTime = 0;//暂停时间
           if (window.curLevelInfo.type == 0) {
               this.jindu = Laya.Tween.to(this.bar, { x: this.bar.x + this.bar.width }, 2000 * (window.curLevelInfo.wave - 2), null, Laya.Handler.create(this, function () {
                   this.EnemyLaiXi.visible = true;//打开怪物来袭提示
                   this.JinGaoTween(this.enemyJinGao);
                   window.GameUI_this.PlaySound(2);
                   Laya.timer.once(2000, this, function () {
                       this.EnemyLaiXi.visible = false;
                       Laya.Tween.clearAll(this.enemyJinGao);
                   }, [], false);//两秒后关闭提示
               }));//进度条
               // Laya.timer.loop(2000 + this.stopTime,this,this.creatOneWave);//每隔2秒创建一波敌人
               for (let index = 0; index < window.curLevelInfo.wave; index++) {
                   Laya.timer.once(3000 * index + this.stopTime, this, this.creatOneWave, [(index + 2), index], false);//生成敌人
               }
           } else if (window.curLevelInfo.type == 1) {//奖励关
               this.JiangLiGuan();

           } else {//boss关
               this.BossLaiXi.visible = true;
               this.JinGaoTween(this.bossJingGao);
               this.PlaySound(2);
               this.jindu = Laya.Tween.to(this.bar, { x: this.bar.x + this.bar.width }, 3000);//进度条
               Laya.timer.once(3000, this, function () {
                   Laya.Tween.clearAll(this.bossJingGao);
                   this.BossLaiXi.visible = false;
               }, [], false);
               var a = this.GetRandom(0, bossId.length);
               this.parseComplete(this.templet[a], bossId[a]);//加载boss

           }
       }
       //加载所有的boss
       loadAllBoss() {
           this.templet = [];//所有的boss
           for (let index = 0; index < bossId.length; index++) {
               this.templet[index] = new Laya.Templet();
               // this.templet[index].on(Laya.Event.COMPLETE, this, this.parseComplete, [this.templet[index], bossId[index]])
               this.templet[index].on(Laya.Event.ERROR, this, this.onerror);
               this.templet[index].loadAni("XZDS/Ani/dgw" + bossId[index] + "/dgw" + bossId[index] + ".sk");
           }

       }
       //加载boss完成回调
       parseComplete(temp, id) {
           this.boss = new Laya.Sprite();
           this.game_phyCeng.addChild(this.boss);
           this.mArmature = this.boss.addChild(temp.buildArmature(0));
           this.mArmature.play(0, true);
           window.curLevelEnemys.push(this.boss);
           var rig = this.boss.addComponent(Laya.RigidBody);
           rig.gravityScale = 0;
           rig.allowRotation = false;
           rig.allowSleep = false;
           var coll = this.boss.addComponent(Laya.BoxCollider);
           this.firePoint = [];//boss开火点
           coll.isSensor = true;
           if (id == 8) {
               this.boss.width = 221;
               this.boss.height = 311;
               var attackpoint = new Laya.Sprite();//给boss加一个枪口
               this.boss.addChild(attackpoint);
               attackpoint.x = 120;//设置开火点位置
               attackpoint.y = 268;

               this.firePoint.push(attackpoint);//将boss枪口添加进数组
               this.mArmature.x = 110;
               this.mArmature.y = 320;
               coll.width = 221;
               coll.height = 311;
           } else if (id == 0) {
               this.boss.width = 241;
               this.boss.height = 249;
               var attackpoint = new Laya.Sprite();//给boss加一个枪口
               this.boss.addChild(attackpoint);
               attackpoint.x = 89;//设置开火点位置
               attackpoint.y = 241;

               this.firePoint.push(attackpoint);//将boss枪口添加进数组
               this.mArmature.x = 105;
               this.mArmature.y = 308;
               coll.width = 241;
               coll.height = 249;
           } else if (id == 1) {
               this.boss.width = 132;
               this.boss.height = 204;
               var attackpoint = new Laya.Sprite();//给boss加一个枪口
               this.boss.addChild(attackpoint);
               attackpoint.x = 74;//设置开火点位置
               attackpoint.y = 188;

               this.firePoint.push(attackpoint);//将boss枪口添加进数组
               this.mArmature.x = 69;
               this.mArmature.y = 240;
               coll.width = 132;
               coll.height = 204;
           } else if (id == 5) {
               this.boss.width = 229;
               this.boss.height = 189;
               var attackpoint = new Laya.Sprite();//给boss加一个枪口
               this.boss.addChild(attackpoint);
               attackpoint.x = 112;//设置开火点位置
               attackpoint.y = 181;

               this.firePoint.push(attackpoint);//将boss枪口添加进数组
               this.mArmature.x = 106;
               this.mArmature.y = 227;
               coll.width = 229;
               coll.height = 189;
           } else if (id == 7) {
               this.boss.width = 306;
               this.boss.height = 171;
               var attackpoint = new Laya.Sprite();//给boss加一个枪口
               this.boss.addChild(attackpoint);
               attackpoint.x = 153;//设置开火点位置
               attackpoint.y = 136;

               this.firePoint.push(attackpoint);//将boss枪口添加进数组
               this.mArmature.x = 153;
               this.mArmature.y = 181;
               coll.width = 306;
               coll.height = 171;
           }
           this.boss.pivot(this.boss.width / 2, this.boss.height / 2);
           this.boss.pos(375, -100);
           this.boss.MSG = {
               tag: "boss",//敌人标签
               hp: 5000 * (window.player.curLevel + 1),//敌人血量
               type: id,//敌人类型
               speed: 5,//移动速度
               gold: this.GetRandom(5, 11),//随机获得金币
               item: this.GetRandom(0, 20),//随机携带一件装备
           };
           this.boss.forward = { x: 0, y: 1 };//boss前方
           this.boss.addComponent(EnemyPengZhuang);
           Laya.Tween.to(this.boss, { y: 350 }, 6000, null, Laya.Handler.create(this, function () {//boss出场

               /**初始化敌人状态 */
               this.attackstage = true;//boss攻击状态
               this.bossIsTurn = true;//boss转向状态
               this.bossIsMove = true;//移动状态

               // var ranId = this.GetRandom(0,15);//随机一种敌人类型
               // this.bossTurn(30,this.bossAttack0,[ranId,20]);

               Laya.timer.once(2000, this, function () {//开启bossAI
                   if (this.isGameOver) {
                       return;
                   }
                   Laya.timer.loop(1000, this, this.bossAI);
               }, [], false);
           }));
       }

       //bossAI
       bossAI() {
           if (this.isGameOver) {//游戏结束
               return;
           }
           if (!this.bossIsTurn || !this.bossIsMove || !this.attackstage) {
               // console.log("正在转向或正在移动或正在攻击")
               return;
           }

           var ranStage = this.GetRandom(0, 3);//随机一种状态
           // ranStage = 1;
           // this.bossTurn(30);
           if (ranStage == 0) {
               var ranId = this.GetRandom(0, 15);//随机一种敌人类型
               // this.bossAttack0(ranId,10);
               this.bossTurn(30, this.bossAttack0, [ranId, 10]);
           } else if (ranStage == 1) {
               var ranId = this.GetRandom(0, 7);//随机一种子弹类型
               // this.bossAttack1(ranId,6);
               this.bossTurn(30, this.bossAttack1, [ranId, 6]);
           } else if (ranStage == 2) {
               // this.bossMove(40);
               this.bossTurn(30, this.bossMove, [40], 1);//转向后向玩家移动
           }
       }

       /**
        * boss转向
        * @param {*} angleSpeed 角速度
        * @param {*} fun 回调方法
        * @param {*} arr 参数数组
        */
       bossTurn(angleSpeed, fun = null, arr) {
           if (this.isGameOver) {
               return;
           }
           if (!this.bossIsTurn || !this.bossIsMove || !this.attackstage) {
               // console.log("正在转向或正在移动或正在攻击")
               return;
           }

           /*boss到玩家的向量 */
           var targetVC = {
               x: this.curPlayer.x - this.boss.x,
               y: this.curPlayer.y - this.boss.y
           };
           var angle = this.GetAngle(targetVC, this.boss.forward);//夹角
           if (angle < 5 && angle > -5) {
               fun(arr[0], arr[1], arr[2]);
               return
           };
           this.bossIsTurn = false;
           var angleTarget = 0;
           if (this.boss.forward.x * targetVC.y - this.boss.forward.y * targetVC.x >= 0) {
               angleTarget = this.boss.rotation + angle;
           } else {
               angleTarget = this.boss.rotation - angle;
           }
           Laya.Tween.to(this.boss, { rotation: angleTarget }, 1000 * angle / angleSpeed, Laya.Ease.linearIn, Laya.Handler.create(this, fun, arr));

           Laya.timer.once(1000 * angle / angleSpeed - 500, this, function () {
               this.boss.forward = targetVC;
               Laya.timer.once(2000, this, function () {//回调方法执行完成后才能继续转向
                   this.bossIsTurn = true;
               }, [], false);
           }, [], false);
       }
       /**
        * boss向玩家移动
        * @param {*} speed 速度
        * @param {*} callback 回调方法
        */
       bossMove(speed, callback = null) {
           if (!window.GameUI_this.bossIsMove || !window.GameUI_this.attackstage) {
               // console.log("正在转向或正在移动或正在攻击")
               return;
           }
           window.GameUI_this.bossIsMove = false;
           var juli = window.GameUI_this.getNor(window.GameUI_this.boss.forward);//移动距离
           var target = {
               x: window.GameUI_this.boss.x + window.GameUI_this.boss.forward.x,
               y: window.GameUI_this.boss.y + window.GameUI_this.boss.forward.y
           };
           Laya.Tween.to(window.GameUI_this.boss, { x: target.x, y: target.y }, 1000 * juli / speed, Laya.Ease.linearIn, Laya.Handler.create(window.GameUI_this, function () {
               window.GameUI_this.bossIsMove = true;//移动结束
           }), 1000);
       }
       //求向量的模长
       getNor(victor2) {
           return Math.sqrt(Math.pow(victor2.x, 2) + Math.pow(victor2.y, 2));//向量的模长
       }
       /**
        * 吐怪物
        * @param {*} id 怪物id
        * @param {*} num 数量
        */
       bossAttack0(id, num) {
           if (!window.GameUI_this.bossIsMove || !window.GameUI_this.attackstage) {
               // console.log("正在转向或正在移动或正在攻击")
               return;
           }
           if (window.GameUI_this.attackstage) {//敌人处于攻击状态
               window.GameUI_this.attackstage = false;//攻击中
               var pos = window.GameUI_this.firePointL2G(window.GameUI_this.firePoint[0]);
               window.GameUI_this.BossTuGuaiWu(id, num, pos);
           }
       }
       /**
        * 散弹攻击
        * @param {*} id 子弹id
        * @param {*} num 子弹数量
        */
       bossAttack1(id, num) {
           if (!window.GameUI_this.bossIsMove || !window.GameUI_this.attackstage) {
               // console.log("正在转向或正在移动或正在攻击")
               return;
           }
           window.GameUI_this.attackstage = false;//攻击中
           var firePoint = window.GameUI_this.firePointL2G(window.GameUI_this.firePoint[0]);
           var angle = 120 / num;//相邻两颗子弹的角度间距
           var bullets = [];//一波子弹
           var count = 0;//zidan
           for (let i = 0; i < num; i++) {
               var bullet = Laya.Pool.getItemByCreateFun("zidan" + id, function () {
                   return this.creatBullet1(id);
               }, window.GameUI_this);
               window.GameUI_this.initBullet(bullet, id);//初始化子弹方向          
               bullet.pos(firePoint.x, firePoint.y);//设置子弹位置
               var offset = angle * (Math.floor(num / 2) - i) + window.GameUI_this.boss.rotation;//角度偏移量
               bullet.rotation += offset;
               bullet.forward = {
                   x: Math.sin(-window.GameUI_this.Deg2Rad(offset)),
                   y: Math.cos(window.GameUI_this.Deg2Rad(offset))
               };
               bullets[i] = bullet;
               Laya.timer.once(50, window.GameUI_this, function () {//装弹中
                   var a = bullets[0].getComponent(Laya.BoxCollider);
                   window.GameUI_this.EnemyMove(bullets[count], bullets[count++].forward);//子弹移动
               }, [], false);
               // window.GameUI_this.EnemyMove(bullet,bullets[count++].forward);//子弹移动
               window.GameUI_this.PlaySound(9);
               Laya.timer.once(5000, window.GameUI_this, function () {//五秒后回收子弹
                   bullet.pos(9999, 9999);
                   Laya.Pool.recover("zidan" + id, bullet);
               }, [], false);
           }
           window.GameUI_this.attackstage = true;//攻击结束
       }
       //创建一颗子弹
       creatBullet1(id) {
           var zidan = new Laya.Sprite();
           // var zidanIma = new Laya.Sprite();
           this.game_phyCeng.addChild(zidan);
           // zidan.addChild(zidanIma);

           // zidan.texture = window.skin.bullet_skin[id];
           zidan.on(Laya.Event.COMPLETE, this);
           zidan.loadImage(window.skin.bullet_skin[id], Laya.Handler.create(this, function () {
               zidan.pivot(zidan.width / 2, zidan.height / 2);
               var rig = zidan.addComponent(Laya.RigidBody);
               rig.allowSleep = false;
               rig.gravityScale = 0;
               var coll = zidan.addComponent(Laya.BoxCollider);
               coll.width = zidan.width / 2;
               coll.height = zidan.height / 2;
               coll.x = zidan.pivotX / 2;
               coll.y = zidan.pivotY / 2;
               coll.isSensor = true;
           }));

           zidan.MSG = {
               tag: "zidan",
               type: id,
               speed: 10
           };
           this.initBullet(zidan, id);//初始化子弹朝向
           zidan.forward = { x: 0, y: 1 };
           window.curLevelItem.push(zidan);

           return zidan;
       }
       //初始子弹方向
       initBullet(bullet, id) {
           switch (id) {
               case 0:
                   bullet.rotation = 185;
                   break;
               case 1:
                   bullet.rotation = 160;
                   break;
               case 2:
                   bullet.rotation = 180;
                   break;
               case 3:
                   bullet.rotation = 180;
                   break;
               case 5:
                   bullet.rotation = -167;
                   break;
               default:
                   break;
           }
       }
       //boss开火点转世界坐标
       firePointL2G(pos) {
           var globalPos = {
               x: 0,
               y: 0
           };
           var raidus = Math.sqrt(Math.pow(pos.x - this.boss.width / 2, 2) + Math.pow(pos.y - this.boss.height / 2, 2));
           globalPos.x = this.boss.x + raidus * Math.sin(-this.Deg2Rad(this.boss.rotation));
           globalPos.y = this.boss.y + raidus * Math.cos(this.Deg2Rad(this.boss.rotation));
           return globalPos;
       }
       //加载出错
       onerror() {
           console.log("error");
       }
       /**
        * boss吐怪物
        * @param {*} id 怪物id
        * @param {*} num 怪物数量
        * @param {*} pos 怪物生成位置
        */
       BossTuGuaiWu(id, num, pos) {
           this.BossAttacktime = 0;//当前怪物生成开始时间
           var endTime = num;//结束时间
           for (let i = 0; i < num; i++) {
               Laya.timer.once(1000 * i, this, this.creatBossBullet0, [id, pos, endTime], false);
           }
       }

       //boss生成怪物
       creatBossBullet0(id, pos, endTime) {
           if (this.isGameOver) {
               return;
           }
           var enemy = Laya.Pool.getItemByCreateFun("enemy" + id, function () {
               return this.LoadEnemy(window.skin.enemy_skin[id]);
           }, this);
           this.game_phyCeng.addChild(enemy);
           var rig = enemy.addComponent(Laya.RigidBody);
           rig.gravityScale = 0;
           rig.bullet = true;
           rig.allowSleep = false;
           var coll = enemy.addComponent(Laya.BoxCollider);
           coll.width = enemy.width / 2;
           coll.height = enemy.height / 2;
           coll.x = enemy.pivotX / 2;
           coll.y = enemy.pivotY / 2;
           coll.isSensor = true;
           //添加信息    
           enemy.MSG = {
               tag: "enemy",//敌人标签
               hp: 500 * (window.player.curLevel + 1) /** (window.curLevelInfo.grade + 1)*/,//敌人血量
               type: id,//敌人类型
               speed: id * 0.2 + 1,//移动速度
               gold: this.GetRandom(5, 11),//随机获得金币
               item: this.GetRandom(0, 20),//随机携带一件装备
               // state:4,//敌人状态 
               NoFirst: true//是否进入战场
           };
           Laya.timer.once(5, this, function () {
               this.InitEnemyFoward(enemy.getChildAt(0));//初始化敌人朝向
               enemy.getChildAt(0).rotation += this.boss.rotation;
           }, [], false);
           this.PlaySound(10);

           window.curLevelEnemys.push(enemy);//将敌人添加进数组
           //获取敌人的生成位置
           enemy.x = pos.x;
           enemy.y = pos.y;
           // var target = {
           //     x: enemy.x + 200 * Math.sin(-this.Deg2Rad(this.boss.rotation)),
           //     y: enemy.y + 200 * Math.cos(this.Deg2Rad(this.boss.rotation))
           // }
           enemy.forward.x = 200 * Math.sin(-this.Deg2Rad(this.boss.rotation));
           enemy.forward.y = 200 * Math.cos(this.Deg2Rad(this.boss.rotation));

           enemy.addComponent(EnemyPengZhuang);
           this.EnemyMove(enemy, enemy.forward);
           this.BossAttacktime++;
           // console.log(this.BossAttacktime);
           if (this.BossAttacktime == endTime) {
               this.attackstage = true;//本次攻击结束 退出攻击状态 进入待机状态
           }
       }
       /**
        * 创建一波敌人
        * @param {*} num 敌人数量
        * @param {*} curWave 当前波数
        */
       creatOneWave(num, curWave) {
           // this.curwave++;
           // Laya.timer.loop(200 + this.stopTime,this,this.getOneEnemy)
           for (let i = 0; i < num; i++) {
               Laya.timer.once(200 * i + this.stopTime, this, this.getOneEnemy, [curWave, i], false);
           }
       }
       /**
        * 创建一个敌人并添加信息
        * @param {*} curWave 当前处于第几波
        * @param {*} i 出场序号
        */
       getOneEnemy(curWave, i) {
           if (!this.isStop) {//游戏没有暂停
               /*随机获取当前关卡的敌人类型*/
               var ranEnemyindex = this.GetRandom(0, window.curLevelInfo.enemyType.length);
               var type = window.curLevelInfo.enemyType[ranEnemyindex];
               var enemy = Laya.Pool.getItemByCreateFun("enemy" + type, function () {
                   return this.LoadEnemy(window.skin.enemy_skin[type])
               }, this);//生成随机类型的敌人
               this.game_phyCeng.addChild(enemy);
               var rig = enemy.addComponent(Laya.RigidBody);
               rig.gravityScale = 0;
               rig.bullet = true;
               rig.allowSleep = false;
               var coll = enemy.addComponent(Laya.BoxCollider);
               coll.width = enemy.width / 2;
               coll.height = enemy.height / 2;
               coll.x = enemy.pivotX / 2;
               coll.y = enemy.pivotY / 2;
               coll.isSensor = true;


               //添加信息    
               enemy.MSG = {
                   tag: "enemy",//敌人标签
                   hp: 1000 * (window.player.curLevel + 1),//敌人血量
                   type: type,//敌人类型
                   speed: type * 0.2 + 1,//移动速度
                   gold: this.GetRandom(5, 11),//随机获得金币
                   item: this.GetRandom(0, 20),//随机携带一件装备
                   // state:4,//敌人状态 
                   NoFirst: false//是否进入战场
               };
               enemy.addComponent(EnemyPengZhuang);//给敌人添加碰撞脚本
               this.InitEnemyFoward(enemy.getChildAt(0));//初始化敌人朝向
               window.curLevelEnemys.push(enemy);//将敌人添加进数组
               //随机获取敌人的生成位置
               enemy.x = this.GetRanEnemyPoint().x; //ranPos.x;
               enemy.y = this.GetRanEnemyPoint().y;//ranPos.y;

               var vector = { x: this.curPlayer.x - enemy.x, y: this.curPlayer.y - enemy.y };//敌人到玩家的向量
               var vectorNor = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));//模长
               var angle = Math.floor(Math.acos(vector.y / vectorNor) * 180 / Math.PI);//求夹角
               angle = enemy.x < this.curPlayer.x ? -angle : angle;//敌人需要旋转的角度
               enemy.getChildAt(0).rotation += angle;//敌人图片朝向玩家
               enemy.forward = { x: this.curPlayer.x - enemy.x, y: this.curPlayer.y - enemy.y };//敌人前方
               this.EnemyMove(enemy, vector);//敌人移动;
               if (curWave == window.curLevelInfo.wave - 1) {//最后一波最后一个敌人创建完毕
                   Laya.timer.once(2000, this, function () {
                       this.isShow = true;//全部敌人已经出现
                       let delTime = 8000;
                       if (window.curLevelInfo.grade <= 5) {
                           delTime = 4000;
                       } else if (window.curLevelInfo.grade < 7) {
                           delTime = 8000;
                       } else {
                           delTime = 10000;
                       }
                       Laya.timer.once(delTime, this, this.tongGuan, [], false);
                       Laya.timer.clear(this, this.creatOneWave);
                       Laya.timer.clear(this, this.getOneEnemy);
                   }, [], false);
               }
           }
       }
       //生成通关条件
       tongGuan() {
           if (this.isTongGuan) return;
           this.isTongGuan = true;
           var gw15 = new Laya.Sprite();
           this.game_phyCeng.addChild(gw15);
           gw15.loadImage("XZDS/res/enemys/gw_15.png", Laya.Handler.create(this, function () {
               gw15.pivot(gw15.width / 2, gw15.height / 2);
               gw15.pos(350, 350);
               var coll = gw15.addComponent(Laya.BoxCollider);
               coll.x = gw15.pivotX / 2;
               coll.y = gw15.pivotY / 2;

               coll.isSensor = true;
               var rig = gw15.addComponent(Laya.RigidBody);
               rig.gravityScale = 0;
               rig.allowSleep = false;

               window.curLevelItem.push(gw15);
               gw15.MSG = {
                   tag: "xing",
                   NoFirst: true
               };
               let endHandler = Laya.Handler.create(this, () => {
                   gw15.addComponent(ItemPengZhuang);
                   //随机一个方向
                   var ranFanXiang = this.GetRandomDic(0, 361);
                   ranFanXiang.x = Math.floor(ranFanXiang.x * 100) / 100;
                   ranFanXiang.y = Math.floor(ranFanXiang.y * 100) / 100;
                   rig.setVelocity({ x: ranFanXiang.x * 3, y: ranFanXiang.y * 3 });
                   gw15.forward = { x: ranFanXiang.x * 3, y: ranFanXiang.y * 3 };
               });
               if (!window.player.newbieGuide.tongguanZD) {
                   window.player.newbieGuide.tongguanZD = true;
                   this.newbieGuideWin(gw15, endHandler);
               } else {
                   endHandler.run();
               }



           }));

       }
       //金币关卡
       JiangLiGuan() {
           var posArr = [{ x: 100, y: -200 }, { x: 200, y: -200 }, { x: 426, y: -200 }, { x: 556, y: -200 }];
           this.jindu = Laya.Tween.to(this.bar, { x: this.bar.x + this.bar.width }, 1000 * 21, null,
               Laya.Handler.create(this, function () {
                   this.isShow = true;
                   this.tongGuan();//通关
               }));//进度条


           for (let index = 0; index < 20; index++) {
               Laya.stage.timerOnce(1000 * index, this, this.creatGoldEnemy, [posArr], false);
           }
       }
       //奖励关生成敌人
       creatGoldEnemy(posArr) {
           for (let i = 0; i < posArr.length; i++) {
               var enemy = Laya.Pool.getItemByCreateFun("enemy16", function () { return this.LoadEnemy(window.skin.enemy_skin[16]) }, this);
               enemy.x = posArr[i].x;
               enemy.y = posArr[i].y;
               var ranGold = this.GetRandom(10, 20);
               enemy.MSG = {
                   tag: "gold",
                   hp: ranGold * 10,
                   gold: ranGold,
                   NoFirst: false
               };
               enemy.forward = { x: 0, y: 1 };
               var rig = enemy.addComponent(Laya.RigidBody);
               rig.allowSleep = false;
               rig.gravityScale = 0;
               var coll = enemy.addComponent(Laya.BoxCollider);
               enemy.addComponent(EnemyPengZhuang);
               coll.isSensor = true;
               window.curLevelEnemys.push(enemy);//将敌人添加进数组;
               rig.setVelocity({ x: 0, y: 3 });
               enemy.forward = { x: 0, y: 3 };
           }

       }
       //初始化敌人的朝向
       InitEnemyFoward(enemy) {
           if (enemy == null) { return }
           switch (enemy.parent.MSG.type) {
               case 0:
                   enemy.rotation = -60;
                   break;
               case 1:
                   enemy.rotation = -90;
                   break;
               case 2:
                   enemy.rotation = -90;
                   break;
               case 3:
                   enemy.rotation = -90;
                   break;
               case 4:
                   enemy.rotation = -100;
                   break;
               case 5:
                   enemy.rotation = -90;
                   break;
               // case 6:
               //     enemy.rotation = -90
               //     break;  
               case 7:
                   enemy.rotation = -10;
                   break;
               case 8:
                   enemy.rotation = 10;
                   break;
               case 10:
                   enemy.rotation = -11;
                   break;
               case 11:
                   enemy.rotation = -20;
                   break;
               default:
                   break;
           }
       }
       //随机创建一个敌人生成位置
       GetRanEnemyPoint() {
           var pos = { x: 0, y: 0 };
           var ran = this.GetRandom(0, 2);//随机获取一面墙
           if (ran == 0) {//左边
               pos.x = -50;
               pos.y = this.GetRandom(30, Laya.stage.height - 30);
           } else if (ran == 1) {//右边
               pos.x = Laya.stage.width + 50;
               pos.y = this.GetRandom(30, Laya.stage.height - 30);
           } else {//上面
               pos.x = this.GetRandom(30, Laya.stage.width - 30);
               pos.y = -50;
           }
           return pos;
       }
       /**
        * 所有敌人的移动
        * @param {*} enemy 敌人
        * @param {*} vector 敌人前方
        */
       EnemyMove(enemy, vector) {
           var rig = enemy.getComponent(Laya.RigidBody);
           if (rig == null) { return };
           var vectorNor = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));//模长
           rig.setVelocity({ x: enemy.MSG.speed * vector.x / vectorNor, y: enemy.MSG.speed * vector.y / vectorNor });//设置速度
           enemy.forward = { x: enemy.MSG.speed * vector.x / vectorNor, y: enemy.MSG.speed * vector.y / vectorNor };//敌人前方
           if (enemy.MSG.type == 0) {
               Laya.timer.frameLoop(1, this, this.gensui, [enemy], false);//跟踪玩家

           }
       }
       //敌人跟随
       gensui(enemy) {
           var rig = enemy.getComponent(Laya.RigidBody);
           if (rig != null) {
               var vector = { x: this.curPlayer.x - enemy.x, y: this.curPlayer.y - enemy.y };//敌人到玩家的向量
               var vectorNor = Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));//模长
               var angle = Math.floor(Math.acos(vector.y / vectorNor) * 180 / Math.PI);//求夹角
               angle = enemy.x < this.curPlayer.x ? -angle : angle;//敌人需要旋转的角度
               // enemy.rotation = angle;
               if (enemy.getChildAt(0) == null) { return };
               if (enemy.getChildAt(0).rotation != (angle - 60)) {//如果敌人没有朝向玩家
                   this.InitEnemyFoward(enemy.getChildAt(0));
                   enemy.getChildAt(0).rotation = angle - 60;
                   rig.setVelocity({ x: enemy.MSG.speed * vector.x / vectorNor, y: enemy.MSG.speed * vector.y / vectorNor });//改变速度方向
                   enemy.forward = { x: enemy.MSG.speed * vector.x / vectorNor, y: enemy.MSG.speed * vector.y / vectorNor };//敌人前方
               }
           }
       }
       /**
        * 加载敌人模板
        * @param {*} url 
        */
       LoadEnemy(url) {
           var item = new Laya.Sprite();
           var enemyImg = new Laya.Sprite();//敌人图片
           this.game_phyCeng.addChild(item);
           item.addChild(enemyImg);
           // item.texture = "XZDS/res/enemys/gw_16.png"
           item.width = 110;
           item.height = 110;
           item.pivot(item.width / 2, item.height / 2);
           item.forward = { x: 0, y: 1 };//敌人前方默认为向下
           enemyImg.loadImage(url, Laya.Handler.create(this, function (enemyImg, item) {
               //    enemyImg.width = 100;
               //   enemyImg.height = 100;
               enemyImg.pivot(enemyImg.width / 2, enemyImg.height / 2);
               enemyImg.pos(item.pivotX, item.pivotY);

           }, [enemyImg, item]));
           return item;
       }
       /**
        * 敌人受伤
        * @param {*} enemy 敌人
        * @param {*} attack 
        */
       EnemyDamage(enemy, attack) {
           if (enemy.MSG.hp > 0) {
               enemy.MSG.hp -= attack;//敌人掉血 
           }
           if (enemy.MSG.hp <= 0) {//敌人血量为零
               window.FIG.wxZD(true);
               window.GameUI_this.PlaySound(8);
               var pZ = enemy.getComponent(EnemyPengZhuang);
               if (pZ.attackTeXiao) {
                   pZ.attackTeXiao.destroy();
               }

               Laya.timer.clearAll(enemy);
               var donghua = this.loadDongHua(0);//死亡动画
               donghua.visible = true;
               donghua.pos(enemy.x - 50, enemy.y - 50);
               donghua.interval = 100;
               donghua.play(0, false);
               donghua.on(Laya.Event.COMPLETE, this, this.onDongHuaComplete, [donghua]);

               this.curLevelgold += enemy.MSG.gold;//获得金币
               otheruse.jinbidonghua(enemy.MSG.gold, { x: enemy.x, y: enemy.y }, this.targetJinbi, function () {
                   window.GameUI_this.jinbishow.text = otheruse.GetJinBiStr(window.GameUI_this.curLevelgold);//金币显示
               });//金币掉落动画

               if (enemy.MSG.tag == "boss") {//boss死亡
                   let Handler = Laya.Handler.create(this, this.Victory);
                   Handler.run();
                   if (window.openQD) {
                       Laya.Scene.open("DQDView.scene", false, {});
                   }
                   // this.Victory();//游戏胜利
                   return;
               }

               if (enemy.MSG.type == 0) {
                   Laya.timer.clear(this, this.gensui);
               }
               //关闭敌人身上的tween动画
               Laya.Tween.clearAll(enemy);
               Laya.Tween.clearAll(enemy.getChildAt(0));
               enemy.pos(99999, 99999);
               enemy.isDestory = true;
               Laya.timer.frameOnce(1, this, function (enemy) {
                   enemy.getChildAt(0).rotation = 0; //恢复到初始朝向
                   var index = window.curLevelEnemys.indexOf(enemy);
                   window.curLevelEnemys.splice(index, 1);//将敌人从数组中移除
                   let coll5 = enemy.getComponent(Laya.BoxCollider);
                   let rig5 = enemy.getComponent(Laya.RigidBody);
                   let pz = enemy.getComponent(EnemyPengZhuang);

                   if (coll5) {
                       coll5.destroy();
                   }
                   if (rig5) {
                       rig5.destroy();
                   }
                   if (pz) {
                       pz.destroy();
                   }
                   enemy.removeSelf();
                   Laya.Pool.recover("enemy", enemy);//放回对象池
               }, [enemy], false);


               //随机掉落物品
               var ran = this.GetRandom(0, 30);
               if (ran <= 1) {//一定概率掉落物品
                   var item = new Laya.Sprite();
                   this.game_phyCeng.addChild(item);
                   item.texture = "XZDS/EnemyLaiXi_Ceng/baozou.png";
                   window.curLevelItem.push(item);
                   item.pos(enemy.x, enemy.y);
                   item.MSG = {
                       tag: "baozou",
                       NoFirst: true
                   };
                   var rig = item.addComponent(Laya.RigidBody);
                   rig.gravityScale = 0;
                   rig.bullet = true;
                   rig.allowSleep = false;
                   rig.allowRotation = false;
                   var BoxCollider = item.addComponent(Laya.BoxCollider);//添加碰撞器
                   BoxCollider.isSensor = true;//设置为触发器
                   BoxCollider.label = "item";
                   item.addComponent(ItemPengZhuang);
                   //随机一个方向
                   var ranFanXiang = this.GetRandomDic(0, 361);
                   ranFanXiang.x = Math.floor(ranFanXiang.x * 100) / 100;
                   ranFanXiang.y = Math.floor(ranFanXiang.y * 100) / 100;
                   rig.setVelocity({ x: ranFanXiang.x * 3, y: ranFanXiang.y * 3 });
                   item.forward = { x: ranFanXiang.x * 3, y: ranFanXiang.y * 3 };
               }
           }
       }
       //加载特效
       loadDongHua(id) {
           //创建动画实例
           var roleAni = new Laya.Animation();
           //加载动画图集，加载成功后执行回调方法
           roleAni.loadAtlas(dhPath[id], Laya.Handler.create(this, this.onLoaded, [roleAni]));
           // roleAni.interval = 1;

           return roleAni;
       }
       onLoaded(roleAni) {
           //添加到舞台
           Laya.stage.addChild(roleAni);
           roleAni.pivot(60, 30);
           roleAni.visible = false;
           // roleAni.pos(pos.x,pos.y);
           // roleAni.play();
       }
       //转向
       Turn(enemy, vector) {
           var rig = enemy.getComponent(Laya.RigidBody);
           rig.setVelocity(this.GetReflectVec(enemy.forward, vector));//改变速度方向
           var angle = this.GetAngle(enemy.forward, vector);
           //当X1Y2-X2Y1>0 表示tempVec2在tempVec1的左边
           // 当X1Y2-X2Y1<0 表示tempVec2在tempVec1的右边
           if (enemy.forward.x * vector.y - enemy.forward.y * vector.x >= 0) {
               enemy.getChildAt(0).rotation += (2 * angle - 180);
           } else {
               enemy.getChildAt(0).rotation -= (2 * angle - 180);
           }

           enemy.forward = this.GetReflectVec(enemy.forward, vector);
       }
       /**
        * 求两向量夹角 返回角度 
        * @param {*} vector1 
        * @param {*} vector2 
        */
       GetAngle(vector1, vector2) {
           var vector1Nor = Math.sqrt(Math.pow(vector1.x, 2) + Math.pow(vector1.y, 2));
           var vector2Nor = Math.sqrt(Math.pow(vector2.x, 2) + Math.pow(vector2.y, 2));
           var angle = Math.acos((vector1.x * vector2.x + vector1.y * vector2.y) / (vector2Nor * vector1Nor)) * 180 / Math.PI;
           return angle;
       }

       /**
        * 获取min~max之间的随机整数,不包含max
        * @param {*} min 最小值
        * @param {*} max 最大值
        */
       GetRandom(min, max) {
           var random = Math.floor(Math.random() * (max - min) + min);
           return random;
       }

       /**
        * 获取指定范围内的一个随机方向向量
        * @param {*} min 最小角度
        * @param {*} max 最大角度
        */
       GetRandomDic(min, max) {
           var angle = this.GetRandom(min, max);//随机一个角度
           var pos = { x: null, y: null };
           pos.x = Math.cos(this.Deg2Rad(angle));
           pos.y = Math.sin(this.Deg2Rad(angle));
           return pos;
       }
       /**
        * 弧度转度
        * @param {*} radian 
        */
       Rad2Deg(radian) {
           return radian * 180 / Math.PI;
       }
       /**
        * 度转弧度
        * @param {*} angle 
        */
       Deg2Rad(angle) {
           return angle * Math.PI / 180;
       }
       /**
            * 获取反射向量
            * @param {*} curVec 当前向量
            * @param {*} normalVec 法向量
            */
       GetReflectVec(curVec, normalVec) {
           //var curVecNor = Math.sqrt(Math.pow(curVec.x,2) + Math.pow(curVec.y,2));//当前向量的模长
           var normalVecNor = Math.pow(normalVec.x, 2) + Math.pow(normalVec.y, 2);//法向量向量的模长的平方
           //var cosVal = ((curVec.x*normalVec.x) + (curVec.y*normalVec.y))/curVecNor;//当前向量与法向量夹角的余弦值    
           // var ResultantVecNor = -curVecNor*cosVal;//当前向量投影在法向量上的模长
           // ResultantVec.x = 2*ResultantVecNor*normalVec.x/normalVecNor;
           // ResultantVec.y = 2*ResultantVecNor*normalVec.y/normalVecNor;
           var ADotB = curVec.x * normalVec.x + curVec.y * normalVec.y;//当前向量与法向量的点乘
           /**当前向量的反向量与反射向量的合向量 */
           var ResultantVec = { x: null, y: null };
           ResultantVec.x = -2 * ADotB * normalVec.x / normalVecNor;
           ResultantVec.y = -2 * ADotB * normalVec.y / normalVecNor;


           var outVec = { x: null, y: null };//反射向量
           outVec.x = ResultantVec.x + curVec.x;
           outVec.y = ResultantVec.y + curVec.y;
           return outVec;
       }

       //动画结束回调
       onDongHuaComplete(a) {
           if (a) {
               a.destroy();
           }

       }

       // 播放音效 
       PlaySound(id) {
           Laya.SoundManager.playSound(music[id].url, 1);
       }
       PlayDamageSound(id) {
           if (id == 7 && !this.isSound) {
               return;
           }
           this.isSound = false;
           Laya.SoundManager.playSound(music[id].url, 1, Laya.Handler.create(this, this.onComp));

       }
       // 播放音乐
       PlayMusic(id) {
           // console.log("播放音乐");
           Laya.SoundManager.playMusic(music[id].url, 0);
       }
       //关闭声音
       StopSound() {
           Laya.SoundManager.stopAll();
       }
       onComp() {
           this.isSound = true;
       }


       /**新手引导 */
       newbieGuide() {
           let oldThis = this;
           (function () {
               var Sprite = Laya.Sprite;
               var Stage = Laya.Stage;
               var HitArea = Laya.HitArea;
               var WebGL = Laya.WebGL;

               var red;
               var guideContainer;
               var tipContainer;

               var guideSteps = [];
               let pointArr = ['xs0', 'xs1'];
               let posArr = [];
               let len = pointArr.length;
               for (let i = 0; i < len; i++) {
                   let obj = oldThis[pointArr[i]];
                   let pos = obj.parent.localToGlobal(obj, true);
                   pos.x -= obj.pivotX;
                   pos.y -= obj.pivotY;
                   posArr.push(pos);
                   let steObj = {
                       x: pos.x,
                       y: pos.y,
                       radius: oldThis[pointArr[i]].width,
                       tipx: 200,
                       tipy: 250,
                       height: oldThis[pointArr[i]].width,
                       isRect: true
                   };
                   // if (i == len - 1) {
                   //     steObj.isRect = true;
                   // }
                   guideSteps.push(steObj);
               }
               let tipTextArr = [
                   '按住武器',
                   '拖拽到此处合成'
               ];
               let events = ['mousedown', 'mouseup'];
               let text = new Laya.Label();
               text.bold = true;
               text.fontSize = 35;
               text.fontSize = 35;
               text.color = '#eceee2';
               text.width = 672;
               text.height = 81;


               var guideStep = 0;
               var hitArea;
               var interactionArea;

               (function () {
                   Laya.init(1285, 727);
                   Laya.stage.alignH = Stage.ALIGN_CENTER;
                   Laya.stage.alignV = Stage.ALIGN_MIDDLE;

                   //绘制一个蓝色方块，不被抠图
                   var gameContainer = new Sprite();
                   // gameContainer.loadImage("../../res/guide/crazy_snowball.png");
                   Laya.stage.addChild(gameContainer);

                   // 引导所在容器
                   guideContainer = new Sprite();
                   // 设置容器为画布缓存
                   guideContainer.cacheAs = "bitmap";
                   Laya.stage.addChild(guideContainer);
                   // gameContainer.on("click", this, nextStep);

                   //oldThis.on(events[guideStep], this, nextStep);
                   //绘制遮罩区，含透明度，可见游戏背景
                   var maskArea = new Sprite();
                   maskArea.alpha = 0.5;
                   maskArea.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
                   guideContainer.addChild(maskArea);

                   //绘制一个圆形区域，利用叠加模式，从遮罩区域抠出可交互区
                   interactionArea = new Sprite();
                   //设置叠加模式
                   interactionArea.blendMode = "destination-out";
                   guideContainer.addChild(interactionArea);

                   hitArea = new HitArea();
                   hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");

                   guideContainer.hitArea = hitArea;
                   guideContainer.mouseEnabled = true;

                   tipContainer = new Sprite();
                   Laya.stage.addChild(tipContainer);
                   Laya.stage.addChild(text);
                   nextStep();
               })();

               function nextStep() {
                   // if (guideStep != 0) {
                   //     GameFIG.PlaySound(2);
                   // }
                   if (guideStep > 0) {
                       oldThis.off(events[guideStep - 1], this, nextStep);
                   }

                   oldThis.on(events[guideStep], this, nextStep);
                   if (guideStep == guideSteps.length) {
                       Laya.stage.removeChild(guideContainer);
                       Laya.stage.removeChild(tipContainer);
                       Laya.stage.removeChild(text);

                       oldThis.off(events[guideStep], this, nextStep);
                   }

                   else {
                       var step = guideSteps[guideStep++];

                       if (!step.isRect) {

                           hitArea.unHit.clear();
                           hitArea.unHit.drawCircle(step.x, step.y, step.radius, "#000000");

                           interactionArea.graphics.clear();
                           interactionArea.graphics.drawCircle(step.x, step.y, step.radius, "#000000");
                       } else {
                           hitArea.unHit.clear();
                           hitArea.unHit.drawRect(step.x, step.y, step.radius, step.height, "#000000");

                           interactionArea.graphics.clear();
                           interactionArea.graphics.drawRect(step.x, step.y, step.radius, step.height, "#000000");
                       }
                       text.text = tipTextArr[guideStep - 1];

                       text.pos(step.x - 60, step.y + 130);

                       //     tipContainer.graphics.clear();
                       //    tipContainer.loadImage(step.tip);
                       //    tipContainer.pos(step.tipx, step.tipy);
                   }
               }
           })();
       }
       newbieGuideWin(go, endHandler) {
           let oldThis = this;
           (function () {
               var Sprite = Laya.Sprite;
               var Stage = Laya.Stage;
               var HitArea = Laya.HitArea;
               var WebGL = Laya.WebGL;

               var red;
               var guideContainer;
               var tipContainer;

               var guideSteps = [];
               oldThis.tempObj = go;
               let pointArr = ['tempObj'];
               let posArr = [];
               let len = pointArr.length;
               for (let i = 0; i < len; i++) {
                   let obj = oldThis[pointArr[i]];
                   let pos = obj.parent.localToGlobal(obj, true);
                   pos.x -= obj.pivotX;
                   pos.y -= obj.pivotY;
                   posArr.push(pos);
                   let steObj = {
                       x: pos.x,
                       y: pos.y,
                       rx: pos.x - obj.pivotX + obj.width,
                       ry: pos.y - obj.pivotY + obj.height,
                       radius: obj.width / 2,
                       tipx: 200,
                       tipy: 250,
                       height: obj.height,
                       isRect: false
                   };
                   // if (i == len - 1) {
                   //     steObj.isRect = true;
                   // }
                   guideSteps.push(steObj);
               }
               let tipTextArr = [
                   '吃到星星即可过关'
               ];
               let events = ['mousedown'];
               let text = new Laya.Label();
               text.bold = true;
               text.fontSize = 35;
               text.fontSize = 35;
               text.color = '#eceee2';
               text.width = 672;
               text.height = 81;


               var guideStep = 0;
               var hitArea;
               var interactionArea;
               let setId;
               (function () {
                   Laya.init(1285, 727);
                   Laya.stage.alignH = Stage.ALIGN_CENTER;
                   Laya.stage.alignV = Stage.ALIGN_MIDDLE;

                   //绘制一个蓝色方块，不被抠图
                   var gameContainer = new Sprite();
                   // gameContainer.loadImage("../../res/guide/crazy_snowball.png");
                   Laya.stage.addChild(gameContainer);

                   // 引导所在容器
                   guideContainer = new Sprite();
                   // 设置容器为画布缓存
                   guideContainer.cacheAs = "bitmap";
                   Laya.stage.addChild(guideContainer);
                   // gameContainer.on("click", this, nextStep);

                   //oldThis.on(events[guideStep], this, nextStep);
                   //绘制遮罩区，含透明度，可见游戏背景
                   var maskArea = new Sprite();
                   maskArea.alpha = 0.5;
                   maskArea.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
                   guideContainer.addChild(maskArea);

                   //绘制一个圆形区域，利用叠加模式，从遮罩区域抠出可交互区
                   interactionArea = new Sprite();
                   //设置叠加模式
                   interactionArea.blendMode = "destination-out";
                   guideContainer.addChild(interactionArea);

                   hitArea = new HitArea();
                   hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");

                   guideContainer.hitArea = hitArea;
                   guideContainer.mouseEnabled = true;

                   tipContainer = new Sprite();
                   Laya.stage.addChild(tipContainer);
                   Laya.stage.addChild(text);
                   nextStep();
                   setId = setTimeout(() => {
                       nextStep();
                   }, 2500);
               })();

               function nextStep() {
                   // if (guideStep != 0) {
                   //     GameFIG.PlaySound(2);
                   // }
                   if (guideStep > 0) {
                       oldThis.off(events[guideStep - 1], this, nextStep);
                   }

                   oldThis.on(events[guideStep], this, nextStep);
                   if (guideStep == guideSteps.length) {
                       Laya.stage.removeChild(guideContainer);
                       Laya.stage.removeChild(tipContainer);
                       Laya.stage.removeChild(text);

                       oldThis.off(events[guideStep], this, nextStep);
                       if (endHandler) {
                           endHandler.run();
                       }
                       if (setId) {
                           clearTimeout(setId);
                       }
                   }

                   else {
                       var step = guideSteps[guideStep++];

                       if (!step.isRect) {

                           hitArea.unHit.clear();
                           hitArea.unHit.drawCircle(step.rx, step.ry, step.radius, "#000000");

                           interactionArea.graphics.clear();
                           interactionArea.graphics.drawCircle(step.rx, step.ry, step.radius, "#000000");
                       } else {
                           hitArea.unHit.clear();
                           hitArea.unHit.drawRect(step.x, step.y, step.radius, step.height, "#000000");

                           interactionArea.graphics.clear();
                           interactionArea.graphics.drawRect(step.x, step.y, step.radius, step.height, "#000000");
                       }
                       text.text = tipTextArr[guideStep - 1];

                       text.pos(step.x - 60, step.y + 130);

                       //     tipContainer.graphics.clear();
                       //    tipContainer.loadImage(step.tip);
                       //    tipContainer.pos(step.tipx, step.tipy);
                   }
               }
           })();
       }
   }

   /**定制UI动画父类 */
   class UIAni extends Laya.Script {
       constructor() {
           super();

       }

       onEnable() {
           this._Enable();
       }
       _Enable() {

       }


   }

   /**放大缩小 */
   class UIAni_Scale extends UIAni {

       constructor() {
           super();
           /** @prop {name:scaleTo, tips:"缩放到", type:float, default:0.8}*/
           this.scaleTo = 0.8;
           /** @prop {name:scaleCome, tips:"缩放回", type:float, default:1}*/
           this.scaleCome = 1;
           /** @prop {name:Time, tips:"动画时间", type:Int, default:500}*/
           this.Time = 500;



           // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
       }

       _Enable() {
           this.TimeLine = Laya.TimeLine
               .to(this.owner, { scaleX: this.scaleTo, scaleY: this.scaleTo }, this.Time)
               .to(this.owner, { scaleX: this.scaleCome, scaleY: this.scaleCome }, this.Time);
           this.TimeLine.play(0, true);

       }
       onDestroy() {
           this.TimeLine.destroy();
       }
   }

   var wx$4 = Laya.Browser.window.wx;
   window.load;
   class Loading extends Laya.Scene {
       constructor() {
           super();
           window.load = this;
       }

       onEnable() {
           // if (wx) {
           //     const loadTask = wx.loadSubpackage({
           //         name: "Other4M", // name 可以填 name 或者 root
           //         success: function (res) {
           //             console.log("加载成功");
           //             // 分包加载成功后通过 success 回调
           //             window.GameUI_this.Start();
           //             window.GameUI_this.zjmBG.texture = "Other4M/res/background/back0/bj_0.png";
           //         },
           //         fail: function (res) {
           //             // 分包加载失败通过 fail 回调
           //             console.log("加载失败");
           //         }
           //     })
           //     loadTask.onProgressUpdate(res => {
           //         console.log('下载进度', res.progress)
           //         console.log('已经下载的数据长度', res.totalBytesWritten)
           //         console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
           //     })
           // }
           window.FIG.Main_Use(Laya.Handler.create(this, () => {

           }), Laya.Handler.create(this, (res) => {
           }));

           window.FIG.GetGameInitConfig();
           window.loadnum = 3;
           if (wx$4) {
               const loadTask = wx$4.loadSubpackage({
                   name: "Other4M", // name 可以填 name 或者 root
                   success: function (res) {
                       console.log("加载成功");
                       // 分包加载成功后通过 success 回调
                       // window.GameUI_this.Start();
                       // window.GameUI_this.zjmBG.texture = "Other4M/res/background/back0/bj_0.png";
                       window.load.AddLoad();

                   },
                   fail: function (res) {
                       // 分包加载失败通过 fail 回调
                       console.log("加载失败");
                   }
               });
               loadTask.onProgressUpdate(res => {
                   console.log('下载进度', res.progress);
                   console.log('已经下载的数据长度', res.totalBytesWritten);
                   console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite);
               });
               const loadTask1 = wx$4.loadSubpackage({
                   name: "Other4M1", // name 可以填 name 或者 root
                   success: function (res) {
                       console.log("加载成功");
                       // 分包加载成功后通过 success 回调
                       // window.GameUI_this.Start();
                       // window.GameUI_this.zjmBG.texture = "Other4M/res/background/back0/bj_0.png";
                       window.load.AddLoad();
                   },
                   fail: function (res) {
                       // 分包加载失败通过 fail 回调
                       console.log("加载失败");
                   }
               });
               const loadTask2 = wx$4.loadSubpackage({
                   name: "XZDS", // name 可以填 name 或者 root
                   success: function (res) {
                       console.log("加载成功");
                       // 分包加载成功后通过 success 回调
                       // window.GameUI_this.Start();
                       // window.GameUI_this.zjmBG.texture = "Other4M/res/background/back0/bj_0.png";
                       window.load.AddLoad();
                   },
                   fail: function (res) {
                       // 分包加载失败通过 fail 回调
                       console.log("加载失败");
                   }
               });
           } else {
               Laya.Scene.open("gameui.scene", true, null, Laya.Handler.create(this, () => {
                   window.GameUI_this.zjmBG.texture = "Other4M/res/background/back0/bj_0.jpg";
                   window.GameUI_this.Start();
               }));
           }

           this.res = 0;
           Laya.timer.loop(1, this, this.updata);
           // Laya.Scene.open("gameui.scene", true, null, null, Laya.Handler.create(this, this.Load));
           Laya.Tween.to(this.rightKnife, { x: 101 }, 1000, Laya.Ease.expoOut);//101  311
           Laya.Tween.to(this.leftKnife, { x: 311 }, 1000, Laya.Ease.expoOut);//101  311
       }
       AddLoad() {
           window.loadnum--;
           if (window.loadnum <= 0) {
               Laya.Scene.open("gameui.scene", true, null, Laya.Handler.create(this, () => {
                   window.GameUI_this.zjmBG.texture = "Other4M/res/background/back0/bj_0.jpg";
                   window.GameUI_this.Start();
               }));


           }
       }
       UIMMP() {
           this.nodeUI = [
               { node: this.tips, y: 266 },
               { node: this.rightKnife, y: 266 },
               { node: this.leftKnife, y: 266 },
               { node: this.proback, y: 1131 }
           ];
           for (let index = 0; index < this.nodeUI.length; index++) {
               this.nodeUI[index].node.y = this.nodeUI[index].y * Laya.stage.height / 1334;

           }
       }
       updata() {
           this.res += 0.05;
           this.Load(this.res);
       }
       Load(res) {
           this.load_lab.value = Math.floor(res * 100);
           this.jindutiao.mask.x = this.jindutiao.mask.width * res;
           if (res >= 0.9) {
               Laya.timer.clear(this, this.updata);

           }
       }
   }

   if (false) {
       var FIG$1 = new GameFIG();
   } else {
       var FIG$1 = GameFIG.Get();

   }

   class XQDView extends Laya.Scene {
       constructor() {
           super();

       }

       onEnable() {
           this.UIMMP();
           this.Addbut();
       }

       UIMMP() {
           this.height = Laya.stage.height;
           this.nodeUI = [
               { node: this.tj, y: 380 },
               { node: this.tips, y: 206 },
               // { node: this.XQDList, y: 774 },
               { node: this.jixu, y: 1272 }
           ];
           for (let i = 0; i < this.nodeUI.length; i++) {
               this.nodeUI[i].node.y = this.nodeUI[i].y / 1334 * Laya.stage.height;
           }

           // FIG.SetGameBox(Laya.Handler.create(this, function () {
           //     FIG.SetListJS(this.XQDList, 2, null, false, 5, false, 0, "none", 2000);
           //     FIG.SetOpenCloseRunlist(this.XQDList, true);
           // }), 0);

           // FIG.SetGameBox(Laya.Handler.create(this, function () {
           //     FIG.SetListJS(this.tipsList, 1, null, true, 5, false, 0, "none", 1500);
           //     FIG.SetOpenCloseRunlist(this.tipsList, true);
           // }), 0);
       }

       onOpened() {
           // FIG.xqdIsOpen = true;
           let cells = this.XQDReiMen.cells;
           for (let i = 0; i < cells.length; i++) {
               cells[i].getChildAt(0).getChildAt(0).texture = "other/XQD/" + FIG$1.GetRandNub(1, 7) + ".png";
           }
       }

       Addbut() {
           FIG$1.butTween(this.jixu, Laya.Handler.create(this, this.OnClickJiXuBtn, [], false));
           // FIG.butTween(this.fanhui, Laya.Handler.create(this, this.OnClickJiXuBtn, [], false));

       }

       OnClickJiXuBtn() {
           // FIG.SetOpenCloseRunlist(this.XQDList, false);
           // FIG.SetOpenCloseRunlist(this.tipsList, false);
           this.close();
       }

       onClosed() {
           FIG$1.xqdIsOpen = false;
       }
   }

   if (false) {
       var FIG$2 = new GameFIG();
   } else {
       var FIG$2 = GameFIG.Get();

   }

   class NewXQD extends Laya.Scene {
       constructor() {
           super();
       }

       onEnable() {
           this.XQDList.vScrollBarSkin = "";
           this.tipsList.hScrollBarSkin = "";
           this.UIMMP();
           this.Addbut();



       }

       UIMMP() {
           this.height = Laya.stage.height;
           this.nodeUI = [
               { node: this.remen, y: 381 },
               { node: this.tips, y: 239 },
               // { node: this.XQDList, y: 774 },
               { node: this.XQDList, y: 443 },
               { node: this.fanhui, y: 111 }
           ];
           for (let i = 0; i < this.nodeUI.length; i++) {
               this.nodeUI[i].node.y = this.nodeUI[i].y / 1334 * Laya.stage.height;
           }

           FIG$2.SetGameBox(Laya.Handler.create(this, function () {
               FIG$2.SetListJS(this.XQDList, 2, null, false, 3, false, 0, "none", 2000);
               FIG$2.SetOpenCloseRunlist(this.XQDList, true);
           }), 0);

           FIG$2.SetGameBox(Laya.Handler.create(this, function () {
               FIG$2.SetListJS(this.tipsList, 1, null, true, 5, false, 0, "none", 1500);
               FIG$2.SetOpenCloseRunlist(this.tipsList, true);
           }), 0);
       }

       onOpened() {
           let cells = this.XQDList.cells;
           for (let i = 0; i < cells.length; i++) {
               cells[i].getChildAt(0).getChildAt(0).texture = "other/XQD1/b" + FIG$2.GetRandNub(2, 8) + ".png";
           }
       }

       Addbut() {
           FIG$2.butTween(this.fanhui, Laya.Handler.create(this, this.OnClickJiXuBtn, [], false));
           // FIG.butTween(this.fanhui, Laya.Handler.create(this, this.OnClickJiXuBtn, [], false));

       }

       OnClickJiXuBtn() {
           FIG$2.SetOpenCloseRunlist(this.XQDList, false);
           FIG$2.SetOpenCloseRunlist(this.tipsList, false);
           this.close();
       }

       onClosed() {
           // FIG.xqdIsOpen = false;
           FIG$2.xqdIsOpen = false;

       }
   }

   /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

   class GameConfig$1 {
       static init() {
           //注册Script或者Runtime引用
           let reg = Laya.ClassUtils.regClass;
   		reg("script/DQDView.js",DQDView);
   		reg("script/GameUI.js",GameUI);
   		reg("script/Ani/UIAni_Scale.js",UIAni_Scale);
   		reg("script/Loading.js",Loading);
   		reg("script/XQDView.js",XQDView);
   		reg("script/NewXQD.js",NewXQD);
       }
   }
   GameConfig$1.width = 750;
   GameConfig$1.height = 1334;
   GameConfig$1.scaleMode ="fixedwidth";
   GameConfig$1.screenMode = "vertical";
   GameConfig$1.alignV = "top";
   GameConfig$1.alignH = "left";
   GameConfig$1.startScene = "loading.scene";
   GameConfig$1.sceneRoot = "";
   GameConfig$1.debug = false;
   GameConfig$1.stat = false;
   GameConfig$1.physicsDebug = false;
   GameConfig$1.exportSceneToJson = true;

   GameConfig$1.init();

   class Main {
   	constructor() {
   		//根据IDE设置初始化引擎		
   		if (window["Laya3D"]) Laya3D.init(GameConfig$1.width, GameConfig$1.height);
   		else Laya.init(GameConfig$1.width, GameConfig$1.height, Laya["WebGL"]);
   		Laya["Physics"] && Laya["Physics"].enable();
   		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
   		Laya.stage.scaleMode = GameConfig$1.scaleMode;
   		Laya.stage.screenMode = GameConfig$1.screenMode;
   		Laya.stage.alignV = GameConfig$1.alignV;
   		Laya.stage.alignH = GameConfig$1.alignH;
   		//兼容微信不支持加载scene后缀场景
   		Laya.URL.exportSceneToJson = GameConfig$1.exportSceneToJson;

   		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
   		if (GameConfig$1.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
   		if (GameConfig$1.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
   		if (GameConfig$1.stat) Laya.Stat.show();
   		Laya.alertGlobalError = true;

   		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
   		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
   	}

   	onVersionLoaded() {
   		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
   		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
   	}

   	onConfigLoaded() {
   		//加载IDE指定的场景
   		GameConfig$1.startScene && Laya.Scene.open("loading.scene");
   	}
   }
   //激活启动类
   new Main();

}());
//# sourceMappingURL=bundle.js.map
