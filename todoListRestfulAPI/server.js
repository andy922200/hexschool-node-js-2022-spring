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
    const { method: reqMethod } = req
    const resHeaders = {
        "Access-Control-Allow-Headers": 'Content-Type, Authorization, Content-Length, X-Requested-With',
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": 'PATCH, POST, GET, OPTIONS, DELETE',
        "content-type": "application/json"
    }

    /* get chunk data for JSON parse */
    let body = ""
    req.on('data',chunk=>{
        body+=chunk
    })

    if(req.url === "/"){
        switch (reqMethod){
            case 'GET':
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    callback: () => {
                        res.write(JSON.stringify({
                            status: 'success',
                            message: 'Get your Index page'
                        }))
                    }
                })
                break
            case 'DELETE':
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    callback: () => {
                        res.write(JSON.stringify({
                            status: 'success',
                            message: 'Delete successfully'
                        }))
                    }
                })
                break
            default:
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    callback: () => {
                        res.write(JSON.stringify({
                            status: 'success',
                            message: 'Nothing happened'
                        }))
                    }
                })
                break
        }
        return;
    }

    if(req.url === "/todos"){
        switch (reqMethod) {
            case 'GET':
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    callback: () => {
                        res.write(JSON.stringify({
                            status: 'success',
                            data: todos
                        }))
                    }
                })
                break
            case 'OPTIONS':
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders
                })
                break
            case 'POST':
                req.on('end', (s)=>{
                    const content = JSON.parse(body)
                    resContentGenerator({
                        res,
                        statusCode: 200,
                        resHeaders,
                        callback: () => {
                            todos.push({
                                "title": content.title,
                                "ids": uuidv4()
                            })
                            res.write(JSON.stringify({
                                status: 'success',
                                message: 'Add Successfully'
                            }))
                        }
                    })
                })
                break
            default:
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    callback: () => {
                        res.write(JSON.stringify({
                            status: 'success',
                            message: 'Nothing happened'
                        }))
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
        callback: ()=>{
            res.write(JSON.stringify({
                status: false,
                message: 'invalid route'
            }))
        }
    })
}
const resContentGenerator = ({ res, statusCode, resHeaders, callback })=>{
    res.writeHead(statusCode, resHeaders)
    if (callback){
        callback()
    }
    res.end()
}

const httpServer = http.createServer(requestListener)
httpServer.listen(port ? port : 8080)