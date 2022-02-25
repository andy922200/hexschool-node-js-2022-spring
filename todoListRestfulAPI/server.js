const { resContentGenerator } = require('./tools')
const http = require('http')
const port = 8080
const {v4: uuidv4} = require('uuid')
let todos = [
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
            default:
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    callback: () => {
                        res.write(JSON.stringify({
                            status: 'success',
                            message: 'This is index page.'
                        }))
                    }
                })
                break
        }
        return;
    }

    if (req.url.startsWith('/todos')){
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
                req.on('end', async ()=>{
                    try{
                        const content = JSON.parse(body)
                        if(content && content.title){
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
                        }else{
                            errorHandling({
                                res,
                                resHeaders
                            })
                        }
                    }catch(err){
                        errorHandling({
                            res,
                            resHeaders
                        })
                    }
                })
                break
            case 'PATCH':
                req.on('end', async () =>{
                    try{
                        const content = JSON.parse(body)
                        const id = req.url.split('/todos/')[1]
                        const index = todos.findIndex(i => i.ids === id)

                        if (content && content.title) {
                            if (id && index > -1) {
                                todos[index].title = content.title
                                resContentGenerator({
                                    res,
                                    statusCode: 200,
                                    resHeaders,
                                    callback: () => {
                                        res.write(JSON.stringify({
                                            status: 'success',
                                            message: `Edit Todo ID: ${id} successfully`
                                        }))
                                    }
                                })
                            } else {
                                errorHandling({
                                    res,
                                    resHeaders
                                })
                            }
                        } else {
                            errorHandling({
                                res,
                                resHeaders
                            })
                        }
                    }catch(err){
                        errorHandling({
                            res,
                            resHeaders
                        })
                    }
                })
                break
            case 'DELETE':
                resContentGenerator({
                    res,
                    statusCode: 200,
                    resHeaders,
                    callback: () => {
                        const id = req.url.split('/todos/')[1]
                        const index = todos.findIndex(i => i.ids === id)

                        if (id){
                            if(index > -1){
                                todos.splice(index, 1)
                                res.write(JSON.stringify({
                                    status: 'success',
                                    message: `Delete Todo ID: ${id} successfully`
                                }))
                            }else{
                                errorHandling({
                                    res,
                                    resHeaders
                                })
                            }
                        }else{
                            todos = []
                            res.write(JSON.stringify({
                                status: 'success',
                                message: 'Delete All Todos successfully'
                            }))
                        }
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

const httpServer = http.createServer(requestListener)
const errorHandling = function ({ res, resHeaders }){
    resContentGenerator({
        res,
        statusCode: 400,
        resHeaders,
        callback: () => {
            res.write(JSON.stringify({
                status: 'error',
                message: 'Your input is not correct or todo id does not exist.'
            }))
        }
    })
}

httpServer.listen(process.env.PORT || port ? port : 8080)