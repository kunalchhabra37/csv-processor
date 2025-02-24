const validateJoi = (schema, data) => {
    let result = schema.validate(data)
    if(result.error){
        let errorMessages = result.error.details.map((det) => det.message).join()
        return {
            status: false,
            message: errorMessages
        }
    }

    return {
        status: true,
        message: 'validated data successfully'
    }
}

module.exports = {
    validateJoi
}