import { Model } from 'sequelize'
import moment from 'moment'

const loadModel = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Restaurant.belongsTo(models.RestaurantCategory, { foreignKey: 'restaurantCategoryId', as: 'restaurantCategory' })
      Restaurant.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Restaurant.hasMany(models.Product, { foreignKey: 'restaurantId', as: 'products' })
      Restaurant.hasMany(models.Order, { foreignKey: 'restaurantId', as: 'orders' })
    }

    async getAverageServiceTime () {
      try {
        const orders = await this.getOrders()
        const serviceTimes = orders.filter(o => o.deliveredAt).map(o => moment(o.deliveredAt).diff(moment(o.createdAt), 'minutes'))
        return serviceTimes.reduce((acc, serviceTime) => acc + serviceTime, 0) / serviceTimes.length
      } catch (err) {
        return err
      }
    }
  }
  Restaurant.init({
    // TODO: Include the rest of the properties of the Restaurant model
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    restaurantCategoryId: DataTypes.INTEGER,
    status: DataTypes.ENUM('online', 'offline', 'closed', 'temporarily closed'),
    heroImage: DataTypes.STRING,
    logo: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    shippingCosts: DataTypes.DOUBLE,
    url: DataTypes.STRING,
    postalCode: DataTypes.STRING,
    address: DataTypes.STRING,
    description: DataTypes.STRING,
    name: DataTypes.STRING,
    averageServiceMinutes: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Restaurant'
  })
  return Restaurant
}
export default loadModel
