let model = require('../../model/puf');

module.exports.create = (data) => {
    return model.createVisit(data);
}

module.exports.get = (id, config={}) => {
    console.log("GET");
    console.log(config);
    if(id) return model.getOneVisitById(id);
    else return model.getVisits(config);
}

module.exports.update = (id, data) => {
    return model.updateVisit(id, data);
}

module.exports.delete = (id) => {
    return model.delete(id);
}

module.exports.setGoals = (id, data) => {
    return model.setGoals(id, data);
}

module.exports.addAccompaniment = (id, data) => {
    return model.addAccompaniment(id, data);
}

module.exports.getAccompaniments = () => {
    return model.getAccompaniments();
}