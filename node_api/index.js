// 引入express
const express = require("express");
const app = express();
const port = 3009; //端口
// 跨域
const cors = require("cors");
// 引入user   user.js设置了传输类型和db.js设置了云数据库
const user = require("./user");
const path = require("path");
const fs = require("fs");
// md5 加密 防止密文泄露
const md5 = require("md5");
const bodyParser = require("body-parser"); //post请求需要下载 body-parser 模板
const jwt = require("jsonwebtoken"); // 插件，可以做token算法 如果没有则需要自己写token算法

// 跨域  上线以后不建议使用cors 安全性比较差，都可以访问，练习可以使用
app.use(cors())
app.use(bodyParser.json());

// md5 用法 中间件   extended 扩展
app.use(bodyParser.urlencoded({ extended: false }));
const passwdcrpyt = function (req, res, next) {
  let password = req.body.password;
  // substr() 方法可在字符串中抽取从 start 下标开始的指定数目的字符。
  // 双层加密 字符串截取
  var a = md5(password + md5(password).substr(10, 13));
  // 把a赋值给
  req.body.passwdcrpyt = a;
  next();
};

// 登录逻辑
const jwt_secret = 'aaa'
app.post('/api/v1/login',passwdcrpyt, async (req,res)=>{
    console.log('/api/v1/login')
  // 响应上面中间件中  req.body.passwdcrpyt = a
  let {mobile,passwdcrpyt} = req.body 
  console.log('mobile',mobile)
  console.log('passwdcrpty',passwdcrpyt)
  // user.findOne 查找单个
  let result = await user.findOne({mobile,password:passwdcrpyt})
  // 判断有没有结果
  if(result) {
    res.send ({
        code:'1000',
        info:'success',
        mobile:mobile,
        data:{
            _token:jwt.sign({
                // userId:result.userId,
                mobile:result.mobile,
                password:passwdcrpyt
            },
        // 添加jwt_secret。MD5更难自己破解
          jwt_secret,{
            //expiresIn 过期时间
            expiresIn: 60 * 60
        }),
      },
    });
  }else{
      res.send({
        code: "9999",
        info: "失败",
      })
  }
})

// 校验token的逻辑
const checkToken =function(req,res,next){
  console.log('进入了校验token识别');
  // split() 方法用于把一个字符串分割成字符串数组。 
  //因为req.headers.authorization 给你的不是原来的token 是加了bearer dflksjdksfjlsfjsdfjsdf是这样的
  let temArr = (req.headers.authorization).split(' ')
  let _token = temArr[1]
  console.log('_token')
  console.log(_token);

    //这里要做 更合理的  各种情况的处理
    try {
      // jwt.verify 验证
      // jwt引擎 反推这个秘文  是否是我给你的  是的话 把你秘文变成你的 用户信息 还原
      let verify = jwt.verify(_token,jwt_secret)
      // console.log('verify')
      // console.log(verify)
      if(verify) {
          console.log('我进入verify里面了')
          req.body.user_info = verify
          console.log('req.body.user_info',req.body.user_info)
          next()
      } 
  } catch (error) {
    // 状态码 403 没有权限访问此站
      // res.status(403).send({
        res.send({
          code:'888',
          info:'没有权限token,请重新登陆'
      })
  }
}

// 这边写已经登录过了，不需要输入用户名和密码。后端有办法识别
app.get('/api/v1/user_info',checkToken,(req,res)=>{
  console.log('进入了/api/v1/user_info');
  console.log(req.body.user_info);
  res.send({
    code:'1000',
    info:'success',
    info2:req.body.user_info
  })
})



//注册逻辑
app.post('/zhuce',passwdcrpyt,(req,res)=>{
  console.log('zhuce我进来了')
  var bbb = {
      mobile:req.body.mobile,
      // password:req.body.password,
      password:req.body.passwdcrpyt
  }
  user.insertMany(bbb,(err,data)=>{
      if(err){
          console.log('err',err)
          res.send({
              code:'400',
              info:'fail',
              info2:'注册失败'
          })
      }
      console.log(data)
      res.send({
          code:'200',
          info:'success',
          info2:'注册成功'
      })
  })
})

// 以下是权限管理的后端
app.post("/quanxian",(req, res) => {
  console.log("进入quanixan的后端了");
  if (req.body.username === "普通员工" && req.body.password === "123456") {
    console.log("普通员工进入");
    res.send({
      id: 1,
      username: "普通用户1",
      password: "123456",
      token: "abcdefghijklmnopqrstuvwxy99",
      rights: [
        {
          id: 1,
          authName: "基础菜单",
          icon: "icon-menu",
          children: [
            {
              id: 11,
              authName: "一级项目1",
              path: "/menu/one",
              rights: ["view", "edit", "add", "delete"]
            },
            {
              id: 11,
              authName: "一级项目2",
              path: "/menu/two",
              rights: ["view"]
            }
          ]
        }
      ]
    });
  } else if (
    req.body.username === "普通员工2" &&
    req.body.password === "123456"
  ) {
    console.log("普通员工2进入了");
    res.send({
      id: 1,
      username: "普通用户2",
      password: "123456",
      token: "abcdefghijklmnopqrstuvwxyz",
      rights: [
        {
          id: 1,
          authName: "一级菜单",
          icon: "icon-menu",
          children: [
            {
              id: 11,
              authName: "一级项目1",
              path: "/menu/one",
              rights: ["view", "edit", "add", "delete"]
            },
            {
              id: 11,
              authName: "一级项目2",
              path: "/menu/two",
              rights: ["view"]
            }
          ]
        }
      ]
    });
  } else if (
    req.body.username === "霸道总裁" &&
    req.body.password === "123456"
  ) {
    console.log("‘霸道总裁进入");
    res.send({
      id: 2,
      username: "霸道总裁",
      password: "123456",
      buttonadd: true,
      buttondel: true,
      buttondit: true,
      buttonfind: false,
      Nuclearmissile:true,
      token: "abcdefghijklmnopqrstuvwxyz"
        .split("")
        .reverse()
        .join(""),
      rights: [
        {
          id: 1,
          authName: "一级菜单",
          icon: "icon-menu",
          children: [
            {
              id: 11,
              authName: "一级项目1",
              path: "/menu/one",
              rights: ["view", "edit", "add", "delete"]
            },
            {
              id: 11,
              authName: "一级项目2",
              path: "/menu/two",
              rights: ["view", "edit", "add", "delete"]
            }
          ]
        },
        {
          id: 2,
          authName: "总裁管理私密",
          icon: "icon-menu",
          children: [
            {
              id: 21,
              authName: "秘书管理1",
              path: "/menu/three",
              rights: ["view", "edit", "add", "delete"]
            },
            {
              id: 22,
              authName: "秘书管理22",
              path: "/menu/four",
              rights: ["view", "edit", "add", "delete"]
            },
            {
              id: 23,
              authName: "秘书管理33",
              path: "/menu/five",
              rights: ["view"]
            }
          ]
        }
      ]
    });
  } else {
    res.send({
      code: 401,
      msg: "可能不是内部员工"
    });
  }
});




// // 初始化用户数据
// app.post("/init", passwdcrpyt, (req, res) => {
//   console.log("init");
//   var bbb = {


    
//     userId: 123456,
//     mobile: "123456789",
//     password: req.body.passwdcrpyt,
//     headIcon: "http//",
//     gender: 0,
//   };
//   // 写入数据库
//   user.insertMany(bbb, (err,data) => {
//     if (err) {
//       console.log("err", err);
//     }
//     console.log(data);
//   });
//   res.send("你的password 密码是  " + req.body.passwdcrpyt);
// });



app.get("/", (req, res) => {
  res.send({
    name: "zs",
    token: "ddgsdfasfjiojfaiojfioajfiosjdfiosafjldfgjdlgjklfajgkljdkgladjkgjaskgfjaklfjklsajlksa",
  });
});

// app.listen(port, () => console.log(`Server is running at http://127.0.0.1:${port}!`));
app.listen(port, () => console.log("后端端口在" + port + "启动了"));







app.get("/axiosget1", (req, res) => {
  console.log("进来/axiosget1里面了");
  console.log(req.query);

  setTimeout(() => {
    res.status(200).send({
      code: "4000",
      data: "可能存在什么错误哦"
    });
  }, 3000);
});

// 轮询解决 后端要主动给前端  返回交互数据的需求  第一种解决方案
app.get("/lunxun", (req, res) => {
  console.log("进入lunxun里面了");

  res.send({
    code: 200,
    msg: "万圣节广告信息"
  });
});

// 第二种socket技术 实现服务器向客户端推送
// 第一步 先引入websocket的包
const Websocket = require("ws");

//  第二部  new出来一个超能力的 wss    给它传入一个参数{port:3000}
var wss = new Websocket.Server({ port: 3000 });

wss.on("connection", ws => {
  //服务器监听消息事件  on  监听客户端给服务端
  ws.on("message", msg => {
    console.log("服务器收到", msg);
  });
  // send   服务端给客户端
  ws.send("卖车优惠广告");
});

