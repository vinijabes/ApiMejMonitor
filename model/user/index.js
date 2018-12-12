let User = require('../oauth2/schema').User;

module.exports.create = async (data) => {
    let user = new User(data);
    return await user.save();
}

module.exports.get = async (config = {}) => {
    return await User.find(config).exec();
}

module.exports.getOneById = async (id) => {
    return await User.findById(id).exec();
}

module.exports.update = async (id, data) => {
    let user = await User.findById(id).exec();
    user.set(data);
    return await user.save();
}

module.exports.delete = async (id) => {
    return !! await User.findByIdAndDelete(id).exec();
}