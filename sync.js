const sequelize = require('./config/database')
const Requests = require('./models/requests')
const Products = require('./models/products')
const Images = require('./models/images')
const StatusMapper = require('./models/statusMapper')
const createDatabase = async () => {
    try {
      await sequelize.authenticate(); 
      await Requests.sync({force: true})
      await Products.sync({force: true})
      await Images.sync({force: true})
      await StatusMapper.sync({force: true})
      await StatusMapper.bulkCreate([{
        id: 1, name: 'Request received'
      },
      {
        id: 2, name: 'Request processing'
      },
      {
        id: 3, name: 'Request processed successfully'
      },
      {
        id: 4, name: 'Error'
      }])
      console.log("Database synced successfully.");
    } catch (error) {
      console.error("Error syncing database:", error);
    } 
  }
createDatabase()