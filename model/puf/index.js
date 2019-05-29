var Ej = require('./schema').Ej;
var Visit = require('./schema').Visit;
var fs = require('fs');

module.exports.create = async (data) => {
    let ej = new Ej(data);
    return await ej.save();
}

module.exports.get = async (config = {}) => {
    return await Ej.find(config).exec();
}

module.exports.getOneById = async (id) => {
    return await Ej.findById(id).exec();
}

module.exports.update = async (id, data) => {
    let ej = await Ej.findById(id).exec();
    try{
        if(ej.imgPath && data.imgPath){
            fs.unlinkSync(ej.imgPath);
            ej.imgPath = null;
        }
    }catch (err){
        console.log(err);
    }
    
    ej.set(data);
    return await ej.save();
}

module.exports.delete = async (id) => {
    let ej = await Ej.findById(id).exec();
    try{
        if(ej.imgPath){
            fs.unlinkSync(ej.imgPath);
            ej.imgPath = null;
        }
        return !! await ej.delete();//Ej.findByIdAndDelete(id).exec();
    }catch (err){
        console.log(err);
        return false;
    }
}

module.exports.createVisit = async (data) => {
    let visit = new Visit(data);
    return await visit.save();
}

module.exports.getVisits = async (config = {}) => {
    return await Visit.find(config).exec();
}

module.exports.getOneVisitById = async (id) => {
    return await Visit.findById(id).exec();
}

module.exports.updateVisit = async (id, data) => {
    let visit = await Visit.findById(id).exec();
    visit.set(data);
    return await visit.save();
}

module.exports.setGoals = async (id, data) => {
    let ej = await Ej.findById(id).exec();
    if(ej == null) return false;
    ej.goals = data;
    return await ej.save();
}