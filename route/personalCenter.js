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
// 影豆兑换优惠券
router.post('/toExchangeCoupon', function (req, res) {
  // console.log(req.body)
  mysql.query(`insert into user_coupon(userId,\`value\`,startAt,endAt,unitDesc,\`condition\`,\`name\`,valueDesc) value(${req.body.userId},"${req.body.value}",${req.body.startAt},${req.body.endAt},"${req.body.unitDesc}","${req.body.condition}","${req.body.name}","${req.body.valueDesc}")`, (err, data) => {
    if (err) {

    } else {
      // console.log(data)
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

// 个人中心我的优惠券
router.post('/getMyCoupon', function (req, res) {
  mysql.query(`select * from user_coupon WHERE userId=${req.body.userId}`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '数据获取成功' })
      console.log(data)
    }
  })
  // console.log(req.body)
})

// 购票使用优惠券后更新优惠券数据
router.post('/updateCouponData', function (req, res) {
  mysql.query(`DELETE FROM user_coupon WHERE couponId = ${req.body.couponId}`, (err, data) => {
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
  // console.log(req.body)
  mysql.query(`select m.* from movie m LEFT JOIN want_movie w on w.movieId=m.movieId WHERE w.userId=${req.body.userId}`, (err, mData) => {
    if (err) {

    } else {
      mysql.query('SELECT a.*,b.performerName,b.birthday,b.image FROM movie_performer a LEFT JOIN performer b on b.performerId = a.performerId', (err, mpData) => {
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
          res.send({ data: mData, code: 200, msg: '数据获取成功' })
        }
      })
    }
  })
})

// 电影订单表信息
router.post('/getOrderData',function(req,res){
  mysql.query(`SELECT * from \`order\` WHERE orderId=${req.body.orderId}`,(err,data)=>{
    if(err){

    }else{
      res.send({data:data,code:200,msg:'获取订单信息成功'})
    }
  })
})

// 电影订单详细信息
router.post('/getOrderDetailData',function(req,res){
  mysql.query(`SELECT DISTINCT s.*,m.movieName,c.cinemaName,c.cinemaAdress,ch.cinemaHallName FROM scene s  RIGHT JOIN movie m on s.movieId=m.movieid RIGHT JOIN cinema c on c.cinemaId=s.cinemaId RIGHT JOIN seat on seat.sceneId=s.sceneId RIGHT JOIN cinema_hall ch on seat.hallId=ch.hallId WHERE s.sceneId=${req.body.sceneId} AND seat.orderId = ${req.body.orderId}
  `,(err,data)=>{
    if(err){

    }else{
      mysql.query(`SELECT s.* from seat s WHERE s.orderId = ${req.body.orderId}`,(err,Sdata)=>{
        if(err){
    
        }else{
          for(let i=0;i<data.length;i++){
            data[i].seat = []
            for(let j=0;j<Sdata.length;j++){
              if(data[i].sceneId == Sdata[j].sceneId){
                data[i].seat.push(Sdata[j])
              }
            }
          }
          res.send({data:data,code:200,msg:'获取订单信息成功'})
        }
      })
      // res.send({data:data,code:200,msg:'获取订单信息成功'})
    }
  })
})

// 获取该用户的所有电影票列表
router.post('/getUserOrderData',function(req,res){
  mysql.query(`SELECT o.orderId,s.sceneDate,s.startTime,m.movieName,c.cinemaName FROM \`order\` o RIGHT JOIN scene s on s.sceneId=o.sceneId RIGHT JOIN movie m on m.movieId=s.movieId RIGHT JOIN cinema c on c.cinemaId=s.cinemaId where userId=${req.body.userId}`,(err,data)=>{
    if(err){

    }else{
      res.send({data:data,code:200,msg:'获取电影票列表信息成功'})
    }
  })
})

// 获取该用户的所有电影评论
router.post('/getUserCommentData',function(req,res){
  mysql.query(`SELECT fc.id,fc.userId,fc.comment,fc.score,fc.commentTime,m.* from film_comment fc LEFT JOIN movie m on fc.movieId=m.movieId WHERE fc.userId=${req.body.userId}`,(err,MCata)=>{
    if(err){

    }else{
      mysql.query('SELECT a.*,b.performerName,b.image FROM movie_performer a LEFT JOIN performer b on b.performerId = a.performerId', (err, mpData) => {
        if (err) {

        } else {
          // console.log(mpData)
          for (var i = 0; i < MCata.length; i++) {
            MCata[i].actor = []
            MCata[i].director = []
            MCata[i].directorAndActor = []
            for (var j = 0; j < mpData.length; j++) {
              // console.log(mpData[j].movieId, MCata[i].movieId)
              if (MCata[i].movieId == mpData[j].movieId && mpData[j].role != '导演') {
                MCata[i].actor.push(mpData[j])
              }
              if (MCata[i].movieId == mpData[j].movieId && mpData[j].role == '导演') {
                MCata[i].director.push(mpData[j])
              }
              if (MCata[i].movieId == mpData[j].movieId) {
                MCata[i].directorAndActor.push(mpData[j])
              }
            }
          }
          // console.log(MCata)
          // res.send({ data: MCata })
        }
      })
      // 
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
              for (let i = 0; i < MCata.length; i++) {
                MCata[i].reply = []
                for (let j = 0; j < Rdata.length; j++) {
                  if (MCata[i].id == Rdata[j].filmCommentId) {
                    // console.log(MCata[i].commentId, Rdata[j].commentId)
                    MCata[i].reply.push(Rdata[j])
                  }
                }
              }
              // console.log(MCata)
              // res.send({ data: Cdata, code: 200, msg: '获取数据成功' })

              console.log(MCata)
              res.send({data:MCata,code:200,msg:'获取电影评论'})
            }
          })
        }
      })
      // res.send({data:MCata,code:200,msg:'获取电影评论'})
    }
  })
})
// 拿到登录用户的动态信息
// router.post('/getLoginUserCommunity', function (req, res) {
//   mysql.query(`select v.* ,u.userName,u.headPortrait from video v LEFT JOIN user u on v.userId=u.userId WHERE u.userId=${req.body.userId}`, (err, data) => {
//     if (err) {

//     } else {
//       res.send({ data: data, code: 200, msg: '数据获取成功' })
//       // console.log(data)
//     }
//   })
//   // console.log(req.body)
// })

module.exports = router
