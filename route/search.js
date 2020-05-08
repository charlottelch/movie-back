var express = require('express')
var router = express.Router()
// 导入数据库
var mysql = require('../db/mysql')

// 模糊查询电影院的品牌
router.post('/selectMovie', function (req, res) {
  console.log(req.body)
  console.log(`select * from (select c.*,GROUP_CONCAT(l.labelName) as labels from cinema_label l RIGHT JOIN cinema c on c.cinemaId = l.cinemaId GROUP BY c.cinemaId) hh  WHERE labels like '%${req.body.cinemaServerSelected}%' AND labels like '%${req.body.hallTypeSelected}%' AND cinemaName like '%${req.body.brandSelectText}%' AND selectAdress like '%${req.body.zoneSelected}%' AND selectAdress like '%${req.body.tradeAreaSelected}%' ORDER BY ${req.body.sortOrderText}`)

  mysql.query(`select * from (select c.*,GROUP_CONCAT(l.labelName) as labels from cinema_label l RIGHT JOIN cinema c on c.cinemaId = l.cinemaId GROUP BY c.cinemaId) hh  WHERE labels like '%${req.body.cinemaServerSelected}%' AND labels like '%${req.body.hallTypeSelected}%' AND cinemaName like '%${req.body.brandSelectText}%' AND selectAdress like '%${req.body.zoneSelected}%' AND selectAdress like '%${req.body.tradeAreaSelected}%' ORDER BY ${req.body.sortOrderText}`, (err, Cdata) => {
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

module.exports = router
