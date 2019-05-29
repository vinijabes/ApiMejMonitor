let model = require('../../model/puf');

module.exports.create = (data) => {
    return model.create(data);
}

module.exports.get = (id, config={}) => {
    if(id) return model.getOneById(id);
    else return model.get(config);
}

module.exports.update = (id, data) => {
    return model.update(id, data);
}

module.exports.delete = (id) => {
    return model.delete(id);
}

module.exports.setGoals = (id, data) => {
    return model.setGoals(id, data);
}