var express = require('express')
var router = express.Router()
// 导入数据库
var mysql = require('../db/mysql')
// 电影院信息
router.post('/getCinemaData', function (req, res) {
  mysql.query(`select * from cinema`, (err, Cdata) => {
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
          res.send({ data: Cdata })
        }
      })
    }
  })
  // console.log(req.body)
})

// 电影院上映电影
router.post('/getCinemaMovie', function (req, res) {
  mysql.query(`SELECT distinct m.*,s.cinemaId FROM movie m LEFT JOIN scene s on m.movieId = s.movieId WHERE cinemaId=${req.body.cinemaId}`, (err, Mdata) => {
    if (err) {

    } else {
      // console.log(data)
      mysql.query(`select distinct movieId,sceneDate from scene WHERE cinemaId=${req.body.cinemaId} ORDER BY sceneDate`, (err, Ddata) => {
        if (err) {

        } else {
          mysql.query(`select distinct s.*,t.hallId,h.cinemaHallName from scene s LEFT JOIN seat t on s.sceneId = t.sceneId  LEFT JOIN cinema_hall h on t.hallId = h.hallId WHERE cinemaId=${req.body.cinemaId} ORDER BY startTime
          `, (err, Tdata) => {
            if (err) {

            } else {
              for (var i = 0; i < Ddata.length; i++) {
                Ddata[i].scene = []
                for (var j = 0; j < Tdata.length; j++) {
                  if (Ddata[i].sceneDate == Tdata[j].sceneDate && Ddata[i].movieId == Tdata[j].movieId) {
                    Ddata[i].scene.push(Tdata[j])
                  }
                }
              }
              // console.log(Ddata)
              // res.send({ data: Ddata })
              for (var i = 0; i < Mdata.length; i++) {
                Mdata[i].sceneDate = []
                for (var j = 0; j < Ddata.length; j++) {
                  if (Mdata[i].movieId == Ddata[j].movieId) {
                    Mdata[i].sceneDate.push(Ddata[j])
                  }
                }
              }
              // console.log(Mdata)
              res.send({ data: Mdata, code: 200, msg: '数据获取成功' })
            }
          })
        }
      })
    }
  })
  // console.log(req.body)
})

// 获取有该电影的影院
router.post('/getMovieCinema', function (req, res) {
  mysql.query(`SELECT distinct movieId,cinemaId,sceneDate FROM scene WHERE movieId=${req.body.movieId} ORDER BY sceneDate`, (err, Ddata) => {
    if (err) {

    } else {
      mysql.query(`SELECT distinct s.sceneDate,c.* FROM scene s LEFT JOIN cinema c on s.cinemaId=c.cinemaId WHERE movieId=${req.body.movieId}`, (err, Cdata) => {
        if (err) {

        } else {
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
              console.log(Cdata)
              // res.send({ data: Cdata })
            }
          })
          mysql.query(`
          select distinct s.*,t.hallId,h.cinemaHallName from scene s LEFT JOIN seat t on s.sceneId = t.sceneId  LEFT JOIN cinema_hall h on t.hallId = h.hallId WHERE movieId=${req.body.movieId} ORDER BY startTime`, (err, Sdata) => {
            if (err) {

            } else {
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

// 获取影厅座位
router.post('/getHall', function (req, res) {
  mysql.query(`select s.*,h.seatRow,h.seatCol from seat s LEFT JOIN cinema_hall h on s.hallId=h.hallId WHERE s.hallId=${req.body.hallId} AND s.sceneId=${req.body.sceneId}`, (err, data) => {
    if (err) {

    } else {
      // console.log(data)
      res.send({ data: data, code: 200, msg: '数据获取成功' })
      // console.log(data)
    }
  })
})

// router.post('/getHall', function (req, res) {
//   console.log(req)
//   mysql.query(`select seatRow,seatCol from cinema_hall WHERE hallId=${req.body.hallId}`, (err, data) => {
//     if (err) {

//     } else {
//       // console.log(data)
//       res.send({ data: data, code: 200, msg: '更改成功' })
//       // console.log(data)
//     }
//   })
// })


module.exports = router
