const path = require('path')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { Readable } = require('stream');
const fs = require('fs')
const parseCSV = async (file) => {
    try {
        const results = []
        await new Promise((resolve, reject) => {
            const stream = Readable.from(file.buffer.toString());
            stream.pipe(csv()).on('data', (data) => results.push(data)).on('end', resolve)
            stream.on('error', reject)
        })
        return results
    } catch (error) {
        console.log('parseCSV error::', error)
        throw error
    }
}

const createCSV = async (data, name) => {
    try {
        const csv_dir = path.join(__dirname, '../', 'csv')
        if(!fs.existsSync(csv_dir)){
            fs.mkdirSync(csv_dir)
        }
        const response = {}
        const fileName = `${name}_output.csv`
        const csvWriter = createCsvWriter({
            path: path.join(csv_dir, fileName),
            header: [
                { id: 'sNo', title: 'S. No.' },
                { id: 'productName', title: 'Product Name' },
                { id: 'input_urls', title: 'Input Image Urls' },
                { id: 'output_urls', title: 'Output Image Urls' }
            ]
        });
        await new Promise((resolve, reject) => {
            csvWriter.writeRecords(data)
            .then(() => {
                console.log('CSV file created successfully!')
                response.status = true
                response.message = 'CSV file created successfully!'
                response.fileName = fileName
                resolve(response)
            })
            .catch(err => {
                response.status = false
                response.message = err.message
                reject(response)
            });
        })
        return response
    } catch (error) {
        console.log('createCSV error::', error)
        throw error
    }
}

module.exports = {
    parseCSV,
    createCSV
}