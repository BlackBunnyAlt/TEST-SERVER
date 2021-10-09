const mysql2 = require('mysql2')

const mysql = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test_server'
})

module.exports = mysql

mysql.connect(function (err) {
    if(err)
      return console.log('[MYSQL] Ошибка подключения к БД ' + err.stack)
})