const mysql = require('mysql');

// 建立数据库连接池
const db = mysql.createPool({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'movie'
})

module.exports=db