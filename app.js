// 创建expresss服务器
var express = require('express');
// 解析前端请为看得懂的样子
var bodyparser=require('body-parser')
var app = express();
app.use(bodyparser.json())
app.get('/', function (req, res) {
   res.send('Hello World');
})
// 引入用户 
var user = require('./route/user')
app.use('/',user)
// 引入电影
var movie = require('./route/movie')
app.use('/',movie)
// 引入电影院
var cinema = require('./route/cinema')
app.use('/',cinema)

// 引入视频
var video = require('./route/video')
app.use('/',video)

// 引入个人中心
var personalCenter = require('./route/personalCenter')
app.use('/',personalCenter)
// app.post('/getUserInfo', function (req, res) {
//   console.log(req.body)
//   console.log(`select * from user where user_id='${req.body.user_id}'`)
//   mysql.query(`select * from user where user_id='${req.body.user_id}'`,(err,data)=>{
//     console.log(data)
//     res.send({
//       code:200,
//       data:data,
//       msg:"登录成功"
//     })
//   })

//   // res.send({
//   //   username:'user001'
//   // });
// })

app.listen(3000,function(){
  console.log("连接成功")
})
 
