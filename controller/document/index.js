let model = require('../../model/document');

module.exports.create = (data) => {
    return model.create(data);
}

module.exports.addProject = (id, data) => {
    return model.addProject(id, data);
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

module.exports.addSection = (id, data) => {
    if(data.subSectionId){
        let {subSectionId, ...subSectionData} = data;
        return model.addSubSection(id, subSectionId, subSectionData);
    }else{
        return model.addSection(id, data);
    }
}