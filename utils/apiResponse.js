const success = (res, status, message = "Success", data = {}, statusCode = 200) => {
    if(res.headersSent){
        return
    }
    return res.status(statusCode).json({status,message, data})
}

const error = (res, next, status, data = {}, message = 'Error', statusCode = 500) => {
    if(res.headersSent){
        return next()
    }
    return res.status(statusCode).json({status,message, data})
}

module.exports = {
    successMsg: success,
    errorMsg: error
}