const resContentGenerator = ({ res, statusCode, resHeaders, callback })=>{
    res.writeHead(statusCode, resHeaders)
    if (callback) {
        callback()
    }
    res.end()
}

module.exports = {
    resContentGenerator
}