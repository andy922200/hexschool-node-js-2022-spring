const http = require('http')
const port = 8080
const {v4: uuidv4} = require('uuid')
const todos = [
    {
        "title": "Title 1",
        "ids": uuidv4()
    }
]

const requestListener = (req, res) =>{
    const resHeaders = {
        "Access-Control-Allow-Headers": 'Content-Type, Authorization, Content-Length, X-Requested-With',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": 'PATCH, POST, GET, OPTIONS, DELETE',
        "content-type": "application/json"
    }

    if(req.url === "/"){
        switch (req.method){
            case 'GET':
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    data: {
                        status: 'success',
                        message: 'Get your Index page'
                    }
                })
                break
            case 'DELETE':
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    data: {
                        status: 'success',
                        message: 'Delete successfully'
                    }
                })
                break
            default:
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    data: {
                        status: 'success',
                        message: 'Nothing happened'
                    }
                })
                break
        }
        return;
    }

    if(req.url === "/todos"){
        switch (req.method) {
            case 'GET':
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    data: {
                        status: 'success',
                        data: todos
                    }
                })
                break
            default:
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    data: {
                        status: 'success',
                        message: 'Nothing happened'
                    }
                })
                break
        }
        return;
    }

    resContentGenerator({
        res,
        statusCode: 404,
        resHeaders,
        data: {
            status: false,
            message: 'invalid route'
        }
    })
}
const resContentGenerator = ({ res, statusCode, resHeaders, data})=>{
    res.writeHead(statusCode, resHeaders)
    res.write(data ? JSON.stringify(data) : JSON.stringify({status: false, message: 'No Value'}))
    res.end()
}

const httpServer = http.createServer(requestListener)
httpServer.listen(port ? port : 8080)