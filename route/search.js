var express = require('express')
var router = express.Router()
// 导入数据库
var mysql = require('../db/mysql')

// 模糊查询电影院
router.post('/selectCinema', function (req, res) {
  mysql.query(`select * from (select c.*,GROUP_CONCAT(l.labelName) as labels from cinema_label l RIGHT JOIN cinema c on c.cinemaId = l.cinemaId GROUP BY c.cinemaId) hh  WHERE labels like '%${req.body.cinemaServerSelected}%' AND labels like '%${req.body.hallTypeSelected}%' AND cinemaName like '%${req.body.brandSelectText}%' AND selectAdress like '%${req.body.zoneSelected}%' AND selectAdress like '%${req.body.tradeAreaSelected}%' AND selectAdress LIKE '%${req.body.locationCity}%' ORDER BY ${req.body.sortOrderText}`, (err, Cdata) => {
    if (err) {

    } else {
      mysql.query(`select * from cinema_label`, (err, CLdata) => {
        if (err) {

        } else {
          for (var i = 0; i < Cdata.length; i++) {
            Cdata[i].label = []
            for (var j = 0; j < CLdata.length; j++) {
              if (Cdata[i].cinemaId == CLdata[j].cinemaId) {
                Cdata[i].label.push(CLdata[j])
              }
            }
          }
          // console.log(Cdata)
          res.send({ data: Cdata, code: 200, msg: '查询结果' })
        }
      })
      // res.send({ data: Cdata, code: 200, msg: '查询结果' })
    }
  })
})

// console.log(`select distinct s.*,t.hallId,h.cinemaHallName,c.cinemaName,c.cinemaDistance,c.bottomPrice,c.selectAdress,c.cinemaDistance,cl.labels from scene s LEFT JOIN seat t on s.sceneId = t.sceneId  LEFT JOIN cinema_hall h on t.hallId = h.hallId  LEFT JOIN cinema c on c.cinemaId=s.cinemaId LEFT JOIN (select *,GROUP_CONCAT(l.labelName) as labels from cinema_label l GROUP BY cinemaId) cl on cl.cinemaId = c.cinemaId WHERE movieId=${req.body.movieId} AND labels like '%${req.body.cinemaServerSelected}%' AND labels like '%${req.body.hallTypeSelected}%' AND cinemaName like '%${req.body.brandSelectText}%' AND selectAdress like '%${req.body.zoneSelected}%' AND selectAdress like '%${req.body.tradeAreaSelected}%' ORDER BY startTime,${req.body.sortOrderText}`)

// 有该电影的影院的筛选
router.post('/selectMovieCinema', function (req, res) {
  mysql.query(`SELECT distinct movieId,cinemaId,sceneDate FROM scene WHERE movieId=${req.body.movieId} ORDER BY sceneDate`, (err, Ddata) => {
    if (err) {

    } else {
      mysql.query(`SELECT distinct s.sceneDate,c.*,cl.labels FROM scene s LEFT JOIN cinema c on s.cinemaId=c.cinemaId LEFT JOIN (select *,GROUP_CONCAT(l.labelName) as labels from cinema_label l GROUP BY cinemaId) cl on cl.cinemaId = c.cinemaId WHERE movieId=${req.body.movieId} AND labels like '%${req.body.cinemaServerSelected}%' AND labels like '%${req.body.hallTypeSelected}%' AND cinemaName like '%${req.body.brandSelectText}%' AND selectAdress like '%${req.body.zoneSelected}%' AND selectAdress like '%${req.body.tradeAreaSelected}%' AND selectAdress LIKE '%${req.body.locationCity}%' ORDER BY ${req.body.sortOrderText}`, (err, Cdata) => {
        if (err) {

        } else {
          // console.log(Cdata)
          //电影院标签
          mysql.query(`select * from cinema_label`, (err, CLdata) => {
            if (err) {

            } else {
              for (var i = 0; i < Cdata.length; i++) {
                Cdata[i].label = []
                for (var j = 0; j < CLdata.length; j++) {
                  if (Cdata[i].cinemaId == CLdata[j].cinemaId) {
                    Cdata[i].label.push(CLdata[j])
                  }
                }
              }
              // console.log(Cdata)
              // res.send({ data: Cdata })
            }
          })
          mysql.query(`select distinct s.*,t.hallId,h.cinemaHallName from scene s LEFT JOIN seat t on s.sceneId = t.sceneId  LEFT JOIN cinema_hall h on t.hallId = h.hallId WHERE movieId=${req.body.movieId} ORDER BY startTime`, (err, Sdata) => {
            if (err) {

            } else {
              // console.log(Sdata)
              for (var i = 0; i < Ddata.length; i++) {
                Ddata[i].cinema = []
                for (var j = 0; j < Cdata.length; j++) {
                  if (Ddata[i].sceneDate == Cdata[j].sceneDate) {
                    Ddata[i].cinema.push(Cdata[j])
                  }
                }
              }
              for (var i = 0; i < Cdata.length; i++) {
                Cdata[i].scene = []
                for (var j = 0; j < Sdata.length; j++) {
                  if (Cdata[i].cinemaId == Sdata[j].cinemaId && Cdata[i].sceneDate == Sdata[j].sceneDate) {
                    Cdata[i].scene.push(Sdata[j])
                  }
                }
              }
              // console.log(Ddata)
              res.send({ data: Ddata, code: 200, msg: '数据获取成功' })
            }
          })
          // res.send({ data: Cdata })
        }
      })
    }
  })
  // console.log(req.body)
})
// 搜索记录列表
router.post('/getSearchHistory', function (req, res) {
  mysql.query(`select * from movie_search_history order by searchHistoryId DESC`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '数据获取成功' })
      // console.log(data)
    }
  })
  // console.log(req.body)
})
// 添加记录列表
router.post('/addSearchHistory', function (req, res) {
  mysql.query(`INSERT INTO movie_search_history(searchHistoryContent) VALUE('${req.body.searchHistoryContent}')`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '添加成功' })
      // console.log(data)
    }
  })
  // console.log(req.body)
})
// 搜索电影、影院、影人
router.post('/getSearchAll', function (req, res) {
  // console.log(req.body)
  var searchList = {movie:[],performer:[],cinema:[]}
  mysql.query(`SELECT * from  movie WHERE movieName LIKE '%${req.body.inputText}%'`, (err, Mdata) => {
    if (err) {

    } else {
      mysql.query('SELECT a.*,b.performerName,b.image FROM movie_performer a LEFT JOIN performer b on b.performerId = a.performerId', (err, mpData) => {
        if (err) {

        } else {
          // console.log(mpData)
          for (var i = 0; i < Mdata.length; i++) {
            Mdata[i].actor = []
            Mdata[i].director = []
            Mdata[i].directorAndActor = []
            for (var j = 0; j < mpData.length; j++) {
              // console.log(mpData[j].movieId, mData[i].movieId)
              if (Mdata[i].movieId == mpData[j].movieId && mpData[j].role != '导演') {
                Mdata[i].actor.push(mpData[j])
              }
              if (Mdata[i].movieId == mpData[j].movieId && mpData[j].role == '导演') {
                Mdata[i].director.push(mpData[j])
              }
              if (Mdata[i].movieId == mpData[j].movieId) {
                Mdata[i].directorAndActor.push(mpData[j])
              }
            }
          }
          searchList.movie.push(Mdata)
          // console.log(mData)
          // res.send({ data: Mdata })
        }
      })
    }
  })
  mysql.query(`select * from performer where performerName LIKE '%${req.body.inputText}%'`, (err, Pdata) => {
    if (err) {

    } else {
      searchList.performer.push(Pdata)
    }
  })
  mysql.query(`SELECT * from  cinema WHERE cinemaName LIKE '%${req.body.inputText}%'`, (err, Cdata) => {
    if (err) {

    } else {
      mysql.query(`select * from cinema_label`, (err, CLdata) => {
        if (err) {

        } else {
          for (var i = 0; i < Cdata.length; i++) {
            Cdata[i].label = []
            for (var j = 0; j < CLdata.length; j++) {
              if (Cdata[i].cinemaId == CLdata[j].cinemaId) {
                Cdata[i].label.push(CLdata[j])

              }
            }
          }
          searchList.cinema.push(Cdata)
          // console.log(searchList)
          res.send({ data: searchList, code: 200, msg: '查询结果' })
        }
      })
    }
  })
})
// 搜索动态
router.post('/getSearchVideo', function (req, res) {
  mysql.query(`select v.* ,u.userName,u.headPortrait from video v LEFT JOIN user u on v.userId=u.userId WHERE videoDescribe LIKE '%${req.body.inputText}%' OR videoLabel LIKE '%${req.body.inputText}%' OR userName LIKE '%${req.body.inputText}%'`, (err, data) => {
    if (err) {

    } else {
      res.send({ data: data, code: 200, msg: '数据获取成功' })
      // console.log(data)
    }
  })
  // console.log(req.body)
})

module.exports = router
