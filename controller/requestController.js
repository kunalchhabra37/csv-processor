const { createRequest,  validateAndProcessFile, fetchRequestInfo, downloadOutputFile } = require("../services/request.service")
const { errorMsg, successMsg } = require("../utils/apiResponse")
const { validateFileType } = require("../validations/csvValidations")

const handleUpload = async (req, res, next) => {
    try {
        const file = req.file
        const webhook = req.body.webhook
        if(!validateFileType(file)){
            return errorMsg(res, next, false,{}, 'Incorrect file type, please upload CSV file.', 400)
        }
        const id = await createRequest(webhook)
        successMsg(res, true, 'Request created successfully.', {
            request_id: id
        })
        validateAndProcessFile(id,file) // calling asynchronous worker
    } catch (error) {
        console.log('Error handleUpload::', error)
        errorMsg(res, next, false, error, 'Something went wrong', 500)
    }
}

const fetchRequestStatus = async (req, res, next) => {
    try {
        const result = await fetchRequestInfo(req.params.id)
        if(!result.status){
            return errorMsg(res, next, result.status, result.data, result.message, 404)
        }
        return successMsg(res, result.status, result.message, result.data)
    } catch (error) {
        console.log('Error fetchRequestStatus::', error)
        errorMsg(res, next, false, error, 'Something went wrong', 500)
    }
}

const downloadCsv = async (req, res, next) => {
    try {
        const result = await downloadOutputFile(req.params.id)
        if(!result.status){
            return errorMsg(res, next, result.status, result.data, result.message, 404)
        }
        res.download(result.file, 'output.csv')
    } catch (error) {
        console.log('Error downloadCsv::', error)
        errorMsg(res, next, false, error, 'Something went wrong', 500)
    }
}

module.exports = {
    handleUpload,
    fetchRequestStatus,
    downloadCsv
}