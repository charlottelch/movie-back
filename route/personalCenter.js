var express = require('express')
var router = express.Router()
// 导入数据库
var mysql = require('../db/mysql')

// 获取签到历史
router.post('/getSignInData', function (req, res) {
  var signList = {}
  mysql.query(`select signDate from user_signin WHERE userId=${req.body.userId}
  `, (err, data) => {
    if (err) {

    } else {
      signList.signDate = []
      signList.signDate.push(data)
      // res.send({ data: data, code: 200, msg: '数据获取成功' })
      // console.log(data)
    }
  })
  mysql.query(`select integral from user WHERE userId=${req.body.userId}
  `, (err, data) => {
    if (err) {

    } else {
      signList.integral = []
      signList.integral.push(data)
      // res.send({ data: data, code: 200, msg: '数据获取成功' })
      // console.log(data)
    }
  })
  mysql.query(`SELECT COUNT(*) as day FROM user_signin WHERE userId=${req.body.userId}
  `, (err, data) => {
    if (err) {

    } else {
      signList.day = []
      signList.day.push(data)
      res.send({ data: signList, code: 200, msg: '数据获取成功' })
      // console.log(signList)
    }
  })
  // console.log(req.body)
})
// 更新签到信息到数据库
router.post('/insertSignData', function (req, res) {
  mysql.query(`insert into user_signin(userId,signDate) value(${req.body.userId},"${req.body.signDate}")
  `, (err, data) => {
    if (err) {

    } else {
      req.body.integral = req.body.integral + 5
      mysql.query(`UPDATE user SET integral=${req.body.integral} WHERE userId=${req.body.userId}`, (err, data) => {
        if (err) {

        } else {
        }
      })
      res.send({ data: data, code: 200, msg: '数据获取成功' })
      // console.log(data)
    }
  })
  // console.log(req.body)
})
// 兑换优惠券
router.post('/toExchangeCoupon', function (req, res) {
  mysql.query(`insert into user_coupon(userId,couponValue) value(${req.body.userId},"${req.body.couponValue}")
  `, (err, data) => {
    if (err) {

    } else {
      mysql.query(`UPDATE user SET integral=integral-${req.body.cost} WHERE userId=${req.body.userId}`, (err, data) => {
        if (err) {

        } else {
        }
      })
      res.send({ data: data, code: 200, msg: '数据获取成功' })
      // console.log(data)
    }
  })
  // console.log(req.body)
})

// 我的优惠券
router.post('/getMyCoupon', function (req, res) {
  mysql.query(`select * from user_coupon WHERE userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '数据获取成功' })
      // console.log(data)
    }
  })
  // console.log(req.body)
})

// 拿取想看电影信息
router.post('/getLikeMovieData', function (req, res) {
  mysql.query(`select m.* from movie m LEFT JOIN want_movie w on w.movieId=m.movieId WHERE w.userId=${req.body.userId}`, (err, mData) => {
    if (err) {

    } else {
      mysql.query('SELECT a.*,b.performerName,b.role,b.birthday,b.image FROM movie_performer a LEFT JOIN performer b on b.performerId = a.performerId', (err, mpData) => {
        if (err) {

        } else {
          console.log(mpData)
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
          console.log(mData)
          res.send({ data: mData, code: 200, msg: '数据获取成功' })
        }
      })
    }
  })
})

module.exports = router
