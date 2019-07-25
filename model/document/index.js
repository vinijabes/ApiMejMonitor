var Document = require('./schema').Document;
var fs = require('fs');

module.exports.create = async (data) => {
    let doc = new Document(data);
    return await doc.save();
}

module.exports.get = async (config = {}) => {
    return await Document.find(config).exec();
}

module.exports.getOneById = async (id) => {
    return await Document.findById(id).exec();
}

module.exports.update = async (id, data) => {
    let doc = await Document.findById(id).exec();
    doc.set(data);
    return await doc.save();
}

module.exports.delete = async (id) => {
    let doc = await Document.findById(id).exec();
    try{
        return !! await doc.delete();
    }catch (err){
        console.log(err);
        return false;
    }
}

module.exports.addSection = async(id, data) => {
    let doc = await Document.findById(id).exec();
    if(!doc) return null;
    doc.sections.push(data);
    return await doc.save();
}

module.exports.addSubSection = async(id, sectionId, data) => {
    let doc = await Document.findById(id).exec();
    
    if(!doc) return null;
    section = doc.sections.id(sectionId);
    
    if(!section) return null;
    section.subSections.push(data);
    
    return await doc.save();   
}