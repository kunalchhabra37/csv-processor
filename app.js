const express = require('express')
const app = express()
require('dotenv').config()



const router = require('./router')
const { errorMsg } = require('./utils/apiResponse')
app.use(express.json())
app.use('/', (req, res) => {
    res.json({
        status: true,
        message: 'Hello'
    })
})
app.use(router)
app.use((error, req, res, next) => {
    console.log('Error caught Globally', error)
    if(res.headersSent){
        return next()
    }
    return errorMsg(res, next, false, error, error.message || 'Something went wrong', 500)
})

app.listen(process.env.PORT,() => console.log(`Server sterted on ${process.env.PORT}`))