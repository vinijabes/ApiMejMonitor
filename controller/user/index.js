let model = require('../../model/user');

module.exports.create = (data) => {
    return model.create(data);
}

module.exports.get = (id) => {
    if(id) return model.getOneById(id);
    else return model.get();
}

module.exports.update = (id, data) => {
    return model.update(id, data);
}

module.exports.delete = (id) => {
    return model.delete(id);
}