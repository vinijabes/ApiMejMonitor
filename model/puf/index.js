const con = require('../../config/database');
var Ej = require('./schema').Ej;
var Visit = require('./schema').Visit;
var fs = require('fs');
var dateFormat = require('dateformat');

module.exports.create = async (data) => {
    let ies = (await con.promise().query("SELECT id_ies FROM Ies WHERE name = ?", [data.ies]))[0][0].id_ies;

    let result = (
        await con.promise().query(
            "INSERT INTO Ej(id_ies, name, courses, qnt_members, revenue_goal, project_goal, img_path)"
            + "VALUES(?, ?, ?, ?, ?, ?, ?)", [ies, data.name, data.courses, data.members, data.revenue, data.projects, data.imgPath]
        )
    );

    return result;
}

module.exports.get = async (config = {}) => {
    let result = (await con.promise().query("SELECT *, img_path as imgPath FROM Ej"))[0];
    return result;
}

module.exports.getOneById = async (id) => {
    let result = (
        await con.promise().query(
            "SELECT " +
            "Ej.name as name," +
            "Ies.name as ies," +
            "courses as courses," +
            "qnt_members as members," +
            "revenue_goal as revenue," +
            "project_goal as projects," +
            "img_path as imgPath FROM Ej INNER JOIN Ies ON Ej.id_ies = Ies.id_ies WHERE cod_ej = ?", [id]))[0][0];
    result.madeProjects = (await con.promise().query("SELECT *, price as revenue FROM Project WHERE cod_ej = ?", [id]))[0].map((elem) => ({ ...elem, revenue: parseFloat(elem.revenue) }));
    return result;
}

module.exports.update = async (id, data) => {
    let ies = (await con.promise().query("SELECT id_ies FROM Ies WHERE name = ?", [data.ies]))[0][0].id_ies;
    let ej = (await con.promise().query("SELECT *, img_path as imgPath FROM Ej WHERE cod_ej = ?", [id]))[0][0];
    try {
        if (ej.imgPath && data.imgPath) {
            fs.unlinkSync(ej.imgPath);
        } else if (ej.imgPath) {
            data.imgPath = ej.imgPath
        }
    } catch (err) {
        console.log(err);
    }

    let result = (await con.promise().query("UPDATE Ej SET id_ies=?, name=?, courses=?, qnt_members=?, revenue_goal=?, project_goal=?, img_path=? WHERE cod_ej = ?", [ies, data.name, data.courses, data.members, data.revenue, data.projects, data.imgPath, id]))[0][0];
    return (await con.promise().query("SELECT *, img_path as imgPath FROM Ej WHERE cod_ej = ?", [id]))[0][0];
}

module.exports.delete = async (id) => {
    let ej = await Ej.findById(id).exec();
    try {
        if (ej.imgPath) {
            fs.unlinkSync(ej.imgPath);
            ej.imgPath = null;
        }
        return !! await ej.delete();//Ej.findByIdAndDelete(id).exec();
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports.createVisit = async (data) => {
    let result = (
        await con.promise().query("INSERT INTO Visit(date, cod_ej, cnpj_instance, responsible, reason) VALUES(?, ?, ?, ?, ?)", [data.date, data.ej, '33.164.213/0001-08', data.responsible, data.reason])
    );
    return result;
}

module.exports.getVisits = async (config = {}) => {
    let result = (await con.promise().query("SELECT *, cod_ej as ej FROM Visit WHERE cod_ej = ?", [config.ej]))[0];
    for (let elem of result) {
        let id = {
            data: elem.date.getTime(),
            codEj: elem.ej
        };

        id = JSON.stringify(id);
        elem._id = Buffer.alloc(id.length, id, 'utf8').toString('base64');
    }
    return result;
}

module.exports.getOneVisitById = async (id) => {
    id = Buffer.alloc(id.length - 12, id, 'base64').toString('utf8');
    console.log(id);
    id = JSON.parse(id);
    id.data = dateFormat(new Date(id.data), "yyyy-mm-dd h:MM:ss");

    let result = (await con.promise().query("SELECT *, cod_ej as ej FROM Visit WHERE cod_ej = ? AND DATE(date) = DATE(?)", [id.codEj, id.data]))[0];
    console.log(result, `SELECT *, cod_ej as ej FROM Visit WHERE cod_ej =${id.codEj} AND date = ${id.data}`);
    return result[0];
}

module.exports.updateVisit = async (id, data) => {
    id = Buffer.alloc(id.length - 12, id, 'base64').toString('utf8');
    id = JSON.parse(id);
    id.data = new Date(id.data).toLocaleString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '').
        replace('AM', '');

    data.date += " 00:00:00";
    console.log(data, id);
    let result = (
        await con.promise().query("UPDATE Visit SET date = ?, cod_ej = ?, cnpj_instance = ?, responsible = ?, reason = ? WHERE cod_ej = ? AND DATE(date) = DATE(?)", [data.date, id.codEj, '33.164.213/0001-08', data.responsible, data.reason, id.codEj, id.data])
    );
    return result;

    let visit = await Visit.findById(id).exec();
    visit.set(data);
    return await visit.save();
}

module.exports.setGoals = async (id, data) => {
    let ej = await Ej.findById(id).exec();
    if (ej == null) return false;
    ej.goals = data;
    return await ej.save();
}

module.exports.addAccompaniment = async (id, data) => {
    let visit = await Visit.findById(id).exec();
    if (visit == null) return false;
    if (visit.accompaniments) visit.accompaniments.push(data);
    else visit.accompaniments = [data];
    return await visit.save();
}

module.exports.getAccompaniments = async (config = {}) => {
    let visit = await Visit.find(config).exec();
    return visit.accompaniments;
}

module.exports.addProject = async (id, data) => {
    if (!id) return false;
    let result = (await con.promise().query("INSERT INTO Project(cod_ej, price, duration, business_name) VALUES (?, ?, ?, ?)"), [data.ej, data.price, data.duration, data.businessName]);
}