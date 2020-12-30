// src/myOpenDataContext/index.js

let sharedCanvas = wx.getSharedCanvas();
let context = sharedCanvas.getContext('2d');
let myopid = "";
let TopOrother = false; //false代表不为排第一个  true代表排第一个
let allYE = 1; //设置多少页
let nowYE = 0; //设置当前也
var alldata;

wx.onMessage(data => {
  console.log("进入子域")

  if (data.type == "getonce") { //更新页
    allYE = 1;
    nowYE = 0;
    console.log("进入排行榜首页")
    myopid = data.opid;
    wx.getFriendCloudStorage({
      keyList: ['score', 'maxScore'],
      success: res => {
        console.log(res.data);
        console.log("排序前")
        alldata = res.data;

        // for (let a = 0; a <21; a++) {
        //   alldata[a] = res.data[0]
          
        
        // }
        var max;
        for (var a = 0; a < alldata.length - 1; a++) { //排序
          for (var b = a + 1; b < alldata.length; b++) {
            if (parseInt(alldata[a].KVDataList[0].value) < parseInt(alldata[b].KVDataList[0].value)) {
              max = alldata[b]
              alldata[b] = alldata[a];
              alldata[a] = max;
            }
          }
        }

        allYE = Math.ceil(alldata.length / 5);
        drawRankList(alldata, nowYE);
      },
      fail: err => {
        console.log(err);
      },
    });

  } else if (data.type == "getnext") { //下一页
    if (nowYE + 1 != allYE) {
      nowYE++;
      var ppdata = [];
      var ps = 0;
      for (var a = nowYE * 5; a < alldata.length; a++) {
        ppdata[ps] = alldata[a];
        ps++;
      }
      drawRankList(ppdata, nowYE);
    }
  } else if (data.type == "getlast") { //上一页
    if (nowYE - 1 != -1) {
      nowYE--;
      var ppdata = [];
      var ps = 0;
      for (var a = nowYE * 5; a < alldata.length; a++) {
        ppdata[ps] = alldata[a];
        ps++;
      }
      drawRankList(ppdata, nowYE);
    }

  } else if (data.type == "caoyue"){//超越
      CaoYue();
  }

})



function drawRankList(dataya, index) {
  console.log(sharedCanvas.width)
  console.log(sharedCanvas.height)
  console.log("进入绘制");
  context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
  var jl = 110;
  var pp = 0;
  var data = [];
  var qqss = 0;
  //绘制页码
  context.fillStyle = '#9de7c9';
  context.font = '32px SimHei';
  context.textAlign = 'center';
  context.fillText(nowYE + 1 + "/" + allYE, 375 / 750 * sharedCanvas.width, 1100);


  for (var c = 0 *index; c < 5 + index * 5; c++) {
    data[qqss] = dataya[c];
    qqss++;
  }
   
  //绘制头像
  let avatar = wx.createImage();
  avatar.src = data[0].avatarUrl;
  avatar.onload = function() {
    context.drawImage(avatar, 250 / 750 * sharedCanvas.width, (380 + 0 * jl)/1334*sharedCanvas.height - 60, 70, 70);
  }
  if (data[1] != undefined) {
    let avatar2 = wx.createImage();
    avatar2.src = data[1].avatarUrl;
    avatar2.onload = function() {
      context.drawImage(avatar2, 250 / 750 * sharedCanvas.width, (380 + 1 * jl)/1334*sharedCanvas.height - 60, 70, 70);
    }
  }
  if (data[2] != undefined) {
    let avatar3 = wx.createImage();
    avatar3.src = data[2].avatarUrl;
    avatar3.onload = function() {
      context.drawImage(avatar3, 250 / 750 * sharedCanvas.width, (380 + 2 * jl)/1334*sharedCanvas.height - 60, 70, 70);
    }
  }
  if (data[3] != undefined) {
    let avatar4 = wx.createImage();
    avatar4.src = data[3].avatarUrl;
    avatar4.onload = function() {
      context.drawImage(avatar4, 250 / 750 * sharedCanvas.width, (380 + 3 * jl)/1334*sharedCanvas.height - 60, 70, 70);
    }
  }
  if (data[4] != undefined) {
    let avatar5 = wx.createImage();
    avatar5.src = data[4].avatarUrl;
    avatar5.onload = function() {
      context.drawImage(avatar5, 250 / 750 * sharedCanvas.width, (380 + 4 * jl)/1334*sharedCanvas.height - 60, 70, 70);
    }
  }
  // if (data[5] != undefined) {
  //   let avatar6 = wx.createImage();
  //   avatar6.src = data[1].avatarUrl;
  //   avatar6.onload = function() {
  //     context.drawImage(avatar6, 250 / 750 * sharedCanvas.width, (380 + 5 * jl)/1334*sharedCanvas.height - 60, 70, 70);
  //   }
  // }


  for (var a = 0; a < 5; a++) {
    if (data[a] == undefined) {
      break;
    }

    //绘制排名
    context.fillStyle = '##f4f4f4';
    context.font = '80px Arial';
    context.textAlign = 'center';
    context.fillText(a + 1+5*nowYE, 180 / 750 * sharedCanvas.width, (380 + pp * jl)/1334*sharedCanvas.height,80);
    //绘制名字
    context.fillStyle = '#4e0e7f';
    context.font = '40px Arial';
    context.textAlign = 'left';
    var name = data[a].nickname.split('');
    var nametext;
    if (ischina(data[a].nickname)) {
      if (name.length > 3)
        name.splice(3, name.length - 3);
      nametext = name.join('');
    } else {
      if (name.length > 5)
        name.splice(5, name.length - 5);
      nametext = name.join('');
    }
    context.fillText(nametext, 350 / 750 * sharedCanvas.width, (380 + pp * jl)/1334*sharedCanvas.height,80);
    
    //绘制关卡
    context.font = '60px Arial';
    context.fillStyle = '#9de7c9';
    context.textAlign = 'center';
    context.fillText((parseInt(data[a].KVDataList[0].value) +1), 530 / 750 * sharedCanvas.width,  (370 + pp * jl)/1334*sharedCanvas.height,80);
   
    pp++;
  }
}


function CaoYue(){
  context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
  
}
/*校验是否y有中文组成 */
function ischina(str) {
  var reg = new RegExp("[\\u4E00-\\u9FFF]+", "g"); /*定义验证表达式*/
  return reg.test(str); /*进行验证*/
}