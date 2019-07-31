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

module.exports.updateSection = async(id, sectionId, data) => {
    let doc = await Document.findById(id).exec();
    
    if(!doc) return null;
    section = doc.sections.id(sectionId);

    if(!section) return null;
    section.set(data);

    return await doc.save();
}

module.exports.deleteSection = async(id, sectionId) => {
    let doc = await Document.findById(id).exec();
    if(!doc) return null;
    doc.sections.id(sectionId).remove();

    return !!await doc.save();
}

module.exports.addAlias = async(id, data) => {
    let doc = await Document.findById(id).exec();
    
    if(!doc) return null;
    doc.aliases.push(data);
    
    return await doc.save();
}

module.exports.updateAlias = async(id, aliasId, data) => {
    let doc = await Document.findById(id).exec();
    
    if(!doc) return null;    
    alias = doc.aliases.id(aliasId);

    if(!alias) return null;
    alias.set(data);
    
    return await doc.save();
}

module.exports.deleteAlias = async(id, aliasId) => {    
    let doc = await Document.findById(id).exec();

    if(!doc) return null;    
    alias = doc.aliases.id(aliasId);

    if(!alias) return null;
    doc.aliases.splice(doc.aliases.indexOf(alias), 1);

    return !!doc.save();
}