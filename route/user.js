var express = require('express')
var router = express.Router()
// 导入数据库
var mysql = require('../db/mysql')

// req前端传过来的值
// 前端接口
router.post('/login', function (req, res) {
  mysql.query(`select * from user where phone='${req.body.phone}'`, (err, data) => {
    if (err) {

    } else {
      if (data.length > 0) {
        // console.log(data)
        if (data[0].password === req.body.password) {
          res.send({ data: data, code: 200, msg: '登录成功' })
          console.log('登录成功')

        } else {
          res.send({ code: 201, msg: '密码错误' })
          // console.log('密码错误')
        }
      } else {
        res.send({ code: 202, msg: '用户账号不存在' })
        // console.log('登录失败')
      }
      // console.log(data)
    }
  })
  // console.log(req.body)
})

router.post('/register', function (req, res) {
  mysql.query(`select * from user where phone='${req.body.phone}'`, (err, data) => {
    console.log(req.body)
    if (err) {

    } else {
      console.log(data)
      if (data.length != 0) {
        res.send({ code: 203, msg: '用户账号已经存在' })
      } else {
        mysql.query(`insert into user(phone, password) value('${req.body.phone}','${req.body.password}') `, (err, data) => {
          if (err) {

          } else {
            res.send({ code: 200, msg: '注册成功' })
          }
        })
      }
    }
  })
})
// 上传头像
router.post('/uploadHeadPortrait', function (req, res) {
  console.log(req)
  mysql.query(`UPDATE user SET headPortrait='${req.body.headPortrait}' WHERE userId=${req.body.userId}`,(err,data) => {
    if(err){

    }else{
      // console.log(data)
      res.send({code:200,msg:'更改成功'})
      // console.log(data)
    }

  })
})
// 改变昵称
router.post('/preserveNickname', function (req, res) {
  console.log(req)
  mysql.query(`UPDATE user SET userName='${req.body.userName}' WHERE userId=${req.body.userId}`,(err,data) => {
    if(err){

    }else{
      // console.log(data)
      res.send({code:200,msg:'更改成功'})
      // console.log(data)
    }

  })
})
// 改变性别
router.post('/genderBoy', function (req, res) {
  console.log(req)
  mysql.query(`UPDATE user SET gender='${req.body.gender}' WHERE userId=${req.body.userId}`,(err,data) => {
    if(err){

    }else{
      // console.log(data)
      res.send({code:200,msg:'更改成功'})
      // console.log(data)
    }
  })
})
router.post('/genderGirl', function (req, res) {
  console.log(req)
  mysql.query(`UPDATE user SET gender='${req.body.gender}' WHERE userId=${req.body.userId}`,(err,data) => {
    if(err){

    }else{
      // console.log(data)
      res.send({code:200,msg:'更改成功'})
      // console.log(data)
    }
  })
})
// 更改生日
router.post('/confirmDate', function (req, res) {
  console.log(req)
  mysql.query(`UPDATE user SET birthday='${req.body.birthday}' WHERE userId=${req.body.userId}`,(err,data) => {
    if(err){

    }else{
      // console.log(data)
      res.send({code:200,msg:'更改成功'})
      // console.log(data)
    }
  })
})

module.exports = router