var express = require('express')
var router = express.Router()
// 导入数据库
var mysql = require('../db/mysql')

// req前端传过来的值
// 前端接口
router.post('/getVideo', function (req, res) {
  mysql.query(`select v.* ,u.userName,u.headPortrait from video v LEFT JOIN user u on v.userId=u.userId`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '数据获取成功' })
      // console.log(data)
    }
  })
  // console.log(req.body)
})
// 查询用户是否点赞过这个视频
router.post('/toCheckThumb', function (req, res) {
  // console.log(req.body)
  mysql.query(`SELECT * FROM user_fabulous WHERE videoId=${req.body.videoId} AND userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '用户已经点赞' })
      // console.log(data)
    }
  })
  // console.log(req.body)
})
// 点赞这个视频
router.post('/toThumb', function (req, res) {
  // console.log(req.body)
  mysql.query(`insert into user_fabulous(videoId,userId) value(${req.body.videoId},${req.body.userId})`, (err, data) => {
    if (err) {

    } else {
      req.body.likeNumber = req.body.likeNumber + 1
      mysql.query(`UPDATE video SET likeNumber=${req.body.likeNumber} WHERE videoId=${req.body.videoId}`, (err, data) => {
        if (err) {

        } else {
          res.send({ data: data, code: 200, msg: '点赞成功' })
          // console.log(data)
        }
      })
    }
  })
})

// 取消点赞
router.post('/toCancelThumb', function (req, res) {
  // console.log(req.body)
  mysql.query(`DELETE FROM user_fabulous WHERE videoId=${req.body.videoId} AND userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      req.body.likeNumber = req.body.likeNumber - 1
      mysql.query(`UPDATE video SET likeNumber=${req.body.likeNumber} WHERE videoId=${req.body.videoId}`, (err, data) => {
        if (err) {

        } else {
          res.send({ data: data, code: 200, msg: '取消点赞成功' })
          // console.log(data)
        }
      })
    }
  })
})

// 查询用户是否收藏这个视频
router.post('/toCheckCollect', function (req, res) {
  // console.log(req.body)
  mysql.query(`SELECT * FROM user_video_collect WHERE videoId=${req.body.videoId} AND userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '用户已经收藏' })
      // console.log(data)
    }
  })
})

// 收藏这个视频
router.post('/toCollect', function (req, res) {
  // console.log(req.body)
  mysql.query(`insert into user_video_collect(videoId,userId) value(${req.body.videoId},${req.body.userId})`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '收藏成功' })
    }
  })
})

// 取消收藏
router.post('/toCancelCollect', function (req, res) {
  // console.log(req.body)
  mysql.query(`DELETE FROM user_video_collect WHERE videoId=${req.body.videoId} AND userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '取消收藏' })
    }
  })
})

// 查询用户是否关注这个作者
router.post('/toCheckFollow', function (req, res) {
  // console.log(req.body)
  mysql.query(`SELECT * FROM user_follow WHERE concernedId=${req.body.concernedId} AND userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '用户已经关注' })
      // console.log(data)
    }
  })
})

// 操作关注按钮
router.post('/follow', function (req, res) {
  // console.log(req.body)
  if (req.body.isFollow == false) {
    mysql.query(`insert into user_follow(concernedId,userId) value(${req.body.concernedId},${req.body.userId})`, (err, data) => {
      if (err) {
  
      } else {
        res.send({ data: data, code: 200, msg: '关注' })
        // console.log(data)
      }
    })
  }else if(req.body.isFollow == true){
    mysql.query(`DELETE FROM user_follow WHERE concernedId=${req.body.concernedId} AND userId=${req.body.userId}`, (err, data) => {
      if (err) {
  
      } else {
        res.send({ data: data, code: 200, msg: '取消关注' })
        // console.log(data)
      }
    })
  }
  
})

// 作者的个人中心（关注和粉丝）
router.post('/getUserInfo', function (req, res) {
  // console.log(req.body)
  var followFansList = []
  mysql.query(`SELECT u.* FROM user_follow uf RIGHT JOIN \`user\` u ON uf.concernedId=u.userId WHERE uf.userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      followFansList.push(data)
      // console.log(followFansList)
      // res.send({ data: followFansList, code: 200, msg: '用户已经关注' })
    }
  })
  mysql.query(`SELECT u.* FROM user_follow uf RIGHT JOIN \`user\` u ON uf.userId=u.userId WHERE uf.concernedId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      followFansList.push(data)
      // console.log(followFansList)
      res.send({ data: followFansList, code: 200, msg: '关注和粉丝' })
    }
  })
})

// 作者的动态及收藏的动态
router.post('/getVideoData', function (req, res) {
  // console.log(req.body)
  var videoList = []
  mysql.query(`select v.* ,u.userName,u.headPortrait from video v LEFT JOIN user u on v.userId=u.userId WHERE v.userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      videoList.push(data)
      // res.send({ data: data, code: 200, msg: '用户已经关注' })
      // console.log(data)
    }
  })
  mysql.query(`SELECT u.collectId,v.*,user.headPortrait,user.userName FROM user_video_collect u LEFT JOIN video v on u.videoId=v.videoId LEFT JOIN user on v.userId=user.userId WHERE u.userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      videoList.push(data)
      res.send({ data: videoList, code: 200, msg: '获取数据成功' })
      // console.log(data)
    }
  })
})
module.exports = router