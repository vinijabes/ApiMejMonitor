const con = require('../../config/database');
let User = require('../oauth2/schema').User;

module.exports.create = async (data) => {
    let result = (await con.promise().query("INSERT INTO User(username, password, scope, firstname, lastname) VALUES (?, ?, ?, ?, ?)", [data.username, data.password, data.scope, data.firstname, data.lastname]));
    return result;
}

module.exports.get = async (config = {}) => {
    return await User.find(config).exec();
}

module.exports.getOneById = async (id) => {
    let result = (await con.promise().query("SELECT username, firstname, lastname FROM User WHERE username = ?", [id]))[0][0];
    return result;
}

module.exports.update = async (id, data) => {
    let user = await User.findById(id).exec();
    user.set(data);
    return await user.save();
}

module.exports.delete = async (id) => {
    return !! await User.findByIdAndDelete(id).exec();
}