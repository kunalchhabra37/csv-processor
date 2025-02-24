const Images = require('../models/images')
const compressImage = async (url) => {
    try {
        // No image compression service is being used for now, only returning pseudo url for compressed image
        if(url.includes('-')){
            let urlArr = url.split('-')
            n = urlArr.length
            urlArr.splice(n-1, 0, 'output')
            return urlArr.join('-')
        } else {
            return url.replace('.jpg', '') + '/output.jpg'
        }
    } catch (error) {
        console.log('imageCompression ERROR::', error)
        throw error
    }
}

const processImages = async (productId,urls) => {
    try {
        const urlsArr = urls.split(',')
        const outputUrls = []
        for(let url of urlsArr){
            const outputUrl = await compressImage(url)
            outputUrls.push(outputUrl)
            await Images.create({
                product_id: productId,
                input_url : url,
                output_url: outputUrl
            })
        }
        return outputUrls.join(',')
    } catch (error) {
        console.log('processImages ERROR::', error)
        throw error
    }
}

module.exports = {
    processImages
}