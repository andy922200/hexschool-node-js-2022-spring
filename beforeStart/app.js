/* open default web server */
const http = require('http')
const port = 8080

const server = http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.write('hello!!')
    res.end()
})

server.listen(port ? port : 8080)

// 分析路徑
const path = require('path')
console.log(path.parse('/xx/yy/zz.js'))