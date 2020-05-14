var express = require('express')
var router = express.Router()
// 导入数据库
var mysql = require('../db/mysql')

// req前端传过来的值
// 前端接口
// 数据库操作之后的值
// SELECT movie.movieName,movie.movieId,performer.performerName,performer.performerId,GROUP_CONCAT(performer.performerName SEPARATOR ',') performerNameAll FROM movie_performer mp LEFT JOIN movie on movie.movieId=mp.movieId LEFT JOIN performer on performer.performerId=mp.performerId GROUP BY movie.movieName
// 拿取电影信息
router.post('/getMovie', function (req, res) {
  mysql.query(`select * from movie`, (err, mData) => {
    if (err) {

    } else {
      mysql.query('SELECT a.*,b.performerName,b.image FROM movie_performer a LEFT JOIN performer b on b.performerId = a.performerId', (err, mpData) => {
        if (err) {

        } else {
          // console.log(mpData)
          for (var i = 0; i < mData.length; i++) {
            mData[i].actor = []
            mData[i].director = []
            mData[i].directorAndActor = []
            for (var j = 0; j < mpData.length; j++) {
              // console.log(mpData[j].movieId, mData[i].movieId)
              if (mData[i].movieId == mpData[j].movieId && mpData[j].role != '导演') {
                mData[i].actor.push(mpData[j])
              }
              if (mData[i].movieId == mpData[j].movieId && mpData[j].role == '导演') {
                mData[i].director.push(mpData[j])
              }
              if (mData[i].movieId == mpData[j].movieId) {
                mData[i].directorAndActor.push(mpData[j])
              }
            }
          }
          // console.log(mData)
          res.send({ data: mData })
        }
      })
      // res.send({ data: data, code: 200, msg: '数据获取成功' })
      // console.log(mData)
    }
  })
  // console.log(req.body)
})
// 操作“想看按钮”
router.post('/wantToLook', function (req, res) {
  mysql.query(`UPDATE movie SET wantLook=${req.body.wantLook} WHERE movieId=${req.body.movieId}`, (err, data) => {
    if (err) {
      // console.log(err)
    } else {
      if (req.body.isActive == true) {
        mysql.query(`insert into want_movie(movieId,userId) value(${req.body.movieId},${req.body.userId}) `, (err, data) => {
          if (err) {
            // console.log(err)
          } else {
            res.send({ data: data, code: 200, msg: '加入想看' })
          }
        })
      } else {
        // console.log("sdasdas")
        // console.log(req.body)
        mysql.query(`delete from want_movie where movieId = ${req.body.movieId} AND userId =${req.body.userId}`, (err, data) => {
          if (err) {
            // console.log(err)
          } else {
            res.send({ data: data, code: 201, msg: '不想看了' })
          }
        })
      }
    }
  })
})
// 想看列表
router.post('/wantLookList', function (req, res) {
  mysql.query(`select * from want_movie WHERE movieId=${req.body.movieId} AND userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      if (data.length != 0) {
        res.send({ data: data, code: 200, msg: '该电影在想看名单' })
      } else {
        res.send({ data: data, code: 201, msg: '该电影在想看名单' })
      }
    }
  })
  // console.log(req.body)
})
// 提交评分
router.post('/score', function (req, res) {
  mysql.query(`insert into film_comment(movieId,userId,comment,score) value(${req.body.movieId},${req.body.userId},'${req.body.comment}','${req.body.score}')`, (err, data) => {
    if (err) {

    } else {
      res.send({ code: 200, msg: '该电影已经评论' })
    }
  })
  // console.log(req.body)
})
// 查找该用户是否看过这部电影
router.post('/seenMovie', function (req, res) {
  mysql.query(`select * from film_comment WHERE movieId=${req.body.movieId} AND userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      if (data.length != 0) {
        res.send({ data: data, code: 200, msg: '用户已经评论' })
      }
    }
  })
  // console.log(req.body)
})
// 电影评分
router.post('/movieScore', function (req, res) {
  mysql.query(`SELECT avg(score) as score from film_comment WHERE movieId=${req.body.movieId}`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '电影评分' })
      console.log(data)
      mysql.query(`UPDATE movie SET score='${data[0].score}' WHERE movieId=${req.body.movieId}`, (err, data) => {
        if (err) {
        } else {
          // res.send({ data: data, code: 200, msg: '电影评分' })
          // console.log(data)
        }
      })
    }
  })
  // console.log(req.body)
})

// 拿到剧照
router.post('/stillList', function (req, res) {
  mysql.query(`select still from movie_still WHERE movieId=${req.body.movieId}`, (err, data) => {
    if (err) {

    } else {
      if (data.length != 0) {
        res.send({ data: data, code: 200, msg: '剧照' })
      }
    }
  })
  // console.log(req.body)
})
// 演员数据
router.post('/getPerformerData', function (req, res) {
  mysql.query(`SELECT * FROM  performer  WHERE performerId=${req.body.performerId}`, (err, data) => {
    if (err) {

    } else {
      if (data.length != 0) {
        res.send({ data: data, code: 200, msg: '演员' })
      }
    }
  })
  // console.log(req.body)
})
// 电影影评数据
router.post('/getMovieCommentData', function (req, res) {
  mysql.query(`select * from film_comment f LEFT JOIN user u ON f.userId=u.userId WHERE movieId = ${req.body.movieId}`, (err, Cdata) => {
    if (err) {

    } else {
      mysql.query(`select * from film_comment_reply`, (err, Rdata) => {
        if (err) {

        } else {
          mysql.query(`select * from user`, (err, Udata) => {
            if (err) {

            } else {
              for (let i = 0; i < Rdata.length; i++) {
                Rdata[i].userSend = []
                Rdata[i].userReplied = []
                for (let j = 0; j < Udata.length; j++) {
                  if (Rdata[i].userFilmSendId == Udata[j].userId) {
                    Rdata[i].userSend.push(Udata[j])
                  }
                  if (Rdata[i].userFilmRepliedId == Udata[j].userId) {
                    Rdata[i].userReplied.push(Udata[j])
                  }
                }
              }
              for (let i = 0; i < Cdata.length; i++) {
                Cdata[i].reply = []
                for (let j = 0; j < Rdata.length; j++) {
                  if (Cdata[i].id == Rdata[j].filmCommentId) {
                    // console.log(Cdata[i].commentId, Rdata[j].commentId)
                    Cdata[i].reply.push(Rdata[j])
                  }
                }
              }
              console.log(Cdata)
              res.send({ data: Cdata, code: 200, msg: '获取数据成功' })
            }
          })
        }
      })
    }
  })
  // console.log(req.body)
})
module.exports = router