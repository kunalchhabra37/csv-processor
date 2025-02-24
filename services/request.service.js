const path = require('path')
const Requests = require('../models/requests')
const Products = require('../models/products')
const fs = require('fs')
const { processImages } = require('./image.services');
const {createCSV, parseCSV } = require('../utils/csvHelper');
const { STATUS_MAPPER } = require('../utils/constants');
const { default: axios } = require('axios');
const { validateStructure, validateCsvData } = require('../validations/csvValidations');
const createRequest = async (webhook) => {
    try {
        const insertedRequest = await Requests.create({
            status: 1,
            webhook: webhook,
            create_date: Date.now()
        })
        return insertedRequest.id
    } catch (error) {
        console.log('createRequest error::', error)
        throw error
    }
}

const validateAndProcessFile = async (id, file) => {
    try {
        const parsedData = await parseCSV(file)
        const validateStructureResponse = validateStructure(parsedData)
        if(!validateStructureResponse.status){
            return await updateRequestStatus(id, {
                status: 4,
                comments: validateStructureResponse.message 
            })
        }

        const validateDataResp = validateCsvData(parsedData)
        if(!validateDataResp.status){
            return await updateRequestStatus(id, {
                status: 4,
                comments: JSON.stringify({message: validateDataResp.message})
            })
        }
        await updateRequestStatus(id, {
            status: 2
        })
        const processFileResponse = await processFileData(parsedData)
        if(!processFileResponse.status){
            return await updateRequestStatus(id, {
                status: 4,
                comments: processFileResponse.message
            })
        }

        const csvResponse = await createCSV(processFileResponse.data, id)
        if(!csvResponse.status){
            return await updateRequestStatus(id, {
                status: 4,
                comments: csvResponse.message
            })
        }

        await updateRequestStatus(id, {
            status: 3,
            comments: 'Success',
            output_file: csvResponse.fileName
        })
        callWebhook(id)
    } catch (error) {
        console.log('validateAndProcessFile error::', error)
        await updateRequestStatus(id, {
            status: 4,
            comments: error.message || 'Something went wrong'
        })
    }
}

const updateRequestStatus = async (id, data) => {
    try {
        return await Requests.update(data, {
            where: {
                id
            }
        })
    } catch (error) {
        console.log('updateRequestStatus error::', error)
        throw error
    }
}

const processFileData = async (data) => {
    try {
        const response = {
            status: false
        }
        const finalOutputData = []
        for(let row of data){
            const sNo = row['S. No.']
            const productName = row['Product Name']
            const input_urls = row['Input Image Urls']
            const productData = await Products.findOrCreate({
                where: {product_name: productName}
            })
            if(!productData.length){
                response.message = 'Unable to fetch or add Product'
                return response
            }
            const productId = productData[0].id
            const output_urls = await processImages(productId, input_urls)
            finalOutputData.push({
                sNo: sNo,
                productName: productName,
                input_urls: input_urls,
                output_urls: output_urls
            })
        }
        return {
            status: true,
            data: finalOutputData
        }
    } catch (error) {
        console.log('processFileData error::', error)
        throw error
    }
}



const fetchRequestInfo = async (id) => {
    try {
        
        const fetchDataResp = await fetchRequestData(id)
        if(!fetchDataResp.status){
            return fetchDataResp
        }
        const requestData = fetchDataResp.data
        const respData = {
            id: requestData.id,
            status: STATUS_MAPPER[requestData.status],
            create_date: requestData.create_date,
            modify_date: requestData.modify_date
        }
        if(requestData.comments){
            respData.comments = requestData.comments
        }
        return {
            status: true, 
            message: 'Data fetched successfully',
            data: respData
        }
    } catch (error) {
        console.log('fetchRequestInfo error::', error)
        throw error
    }
}

const downloadOutputFile = async (id) => {
    try {
        const response = {
            status: false,
            message: 'Unable to fetch file'
        }
        const fetchDataResp = await fetchRequestData(id)
        if(!fetchDataResp.status){
            return fetchDataResp
        }
        const requestData = fetchDataResp.data
        if(requestData.status == 3 && requestData.output_file){
            const filePath = path.join(__dirname, '../', 'csv', requestData.output_file)
            if(fs.existsSync(filePath)){
                response.status = true
                response.file = filePath
                response.message = 'Success'
            } else {
                response.message = "File not available to download"
            }
            
        } else {
            response.message = 'File unavailable at current status'
        }
        return response
    } catch (error) {
        console.log('downloadOutputFile error::', error)
        throw error
    }
}

const fetchRequestData = async (id) => {
    try {
        if(!id){
            return {
                status: false,
                message: 'Please send request id'
            }
        }
        const requestData = await Requests.findOne({
            where : {
                id
            },
            raw: true
        })
        if(!requestData || !Object.keys(requestData).length || !requestData.id){
            return {
                status: false,
                message: 'Unable to find the request'
            }
        }
        return {
            status: true,
            data: requestData
        }
    } catch (error) {
        console.log('fetchRequestData error::', error)
        throw error
    }
}

const callWebhook = async (id) => {
    try {
        const fetchDataResp = await fetchRequestData(id)
        if(!fetchDataResp.status){
            return fetchDataResp
        }
        const requestData = fetchDataResp.data
        if(requestData.webhook){
            const resp = await axios.post(requestData.webhook, fetchDataResp.data)
        }
    } catch (error) {
        console.log('callWebhook error::', error)
    }
}

module.exports = {
    createRequest, 
    validateAndProcessFile,
    fetchRequestInfo,
    downloadOutputFile
}