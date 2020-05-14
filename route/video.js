var express = require('express')
var router = express.Router()
// 导入数据库
var mysql = require('../db/mysql')

var multer = require('multer')
//上传的文件保存在 upload
const storage = multer.diskStorage({
  //存储的位置
  destination (req, file, cb) {
    cb(null, 'uploads/')
  },
  //文件名字的确定 multer默认帮我们取一个没有扩展名的文件名，因此需要我们自己定义
  filename (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

//传入storage 除了这个参数我们还可以传入dest等参数
const uploadd = multer({ storage })
// req前端传过来的值
// 前端接口
router.post('/getVideo', function (req, res) {
  mysql.query(`select v.* ,u.userName,u.headPortrait from video v LEFT JOIN user u on v.userId=u.userId ORDER BY likeNumber DESC`, (err, data) => {
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
  } else if (req.body.isFollow == true) {
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

// 上传视频
router.post('/upload', uploadd.single('file'), function (req, res) {
  console.log(req.file)
  let file = req.file
  file.url = `http://localhost:3000/${file.filename}`
  // console.log(file)
  res.send({
    code: 200,
    data: file
  })

})
// 上传图片
router.post('/uploadImage', uploadd.single('file'), function (req, res) {
  console.log(req.file)
  let file = req.file
  file.url = `http://localhost:3000/${file.filename}`
  // console.log(file)
  res.send({
    code: 200,
    data: file
  })
})
// 发布动态
router.post('/toUpload', function (req, res) {
  console.log(req.body)
  mysql.query(`insert into video(video,userId,videoDescribe,videoCover,videoLabel) value('${req.body.video}',${req.body.userId},'${req.body.videoDescribe}','${req.body.videoCover}','${req.body.videoLabel}')`, (err, data) => {
    if (err) {

    } else {
      // videoList.push(data)
      res.send({ data: data, code: 200, msg: '获取数据成功' })
      // console.log(data)
    }
  })
})

// 获取video的评论数据
router.post('/getCommentData', function (req, res) {
  // console.log(req.body)
  mysql.query(`SELECT * FROM video_comment v LEFT JOIN user u ON v.userCommentId=u.userId WHERE videoId=${req.body.videoId}`, (err, Cdata) => {
    if (err) {

    } else {
      // videoList.push(data)
      mysql.query(`SELECT * FROM video_comment_reply`, (err, Rdata) => {
        if (err) {

        } else {
          mysql.query(`select * from user`, (err, Udata) => {
            if (err) {

            } else {
              for (let i = 0; i < Rdata.length; i++) {
                Rdata[i].userSend = []
                Rdata[i].userReplied = []
                for (let j = 0; j < Udata.length; j++) {
                  if (Rdata[i].userSendId == Udata[j].userId) {
                    Rdata[i].userSend.push(Udata[j])
                  }
                  if (Rdata[i].userRepliedId == Udata[j].userId) {
                    Rdata[i].userReplied.push(Udata[j])
                  }
                }
              }
              for (let i = 0; i < Cdata.length; i++) {
                Cdata[i].reply = []
                for (let j = 0; j < Rdata.length; j++) {
                  if (Cdata[i].videoCommentId == Rdata[j].videoCommentId) {
                    // console.log(Cdata[i].commentId, Rdata[j].commentId)
                    Cdata[i].reply.push(Rdata[j])
                  }
                }
              }
              // console.log(Cdata)
              res.send({ data: Cdata, code: 200, msg: '获取数据成功' })
            }
          })
        }
      })
    }
  })
})

// 发布评论
router.post("/sendComment", function (req, res) {
  mysql.query(`insert into video_comment(videoId,userCommentId,commentContent,commentTime) VALUE (${req.body.videoId},${req.body.userCommentId},'${req.body.commentContent}','${req.body.commentTime}')
  `,(err,data)=>{
    if(err){

    }else{
      console.log(data)
      res.send({ data: data, code: 200, msg: '发布成功' })
    }
  })
})

// 回复评论
router.post("/sendReplyComment", function (req, res) {
  console.log(req.body)
  mysql.query(`insert into video_comment_reply(videoCommentId,userSendId,userRepliedId,replyContent,replyTime) VALUE (${req.body.videoCommentId},${req.body.userSendId},${req.body.userRepliedId},'${req.body.replyContent}','${req.body.replyTime}')`,(err,data)=>{
    if(err){

    }else{
      console.log(data)
      res.send({ data: data, code: 200, msg: '发布成功' })
    }
  })
})
module.exports = router