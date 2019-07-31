let draftToHtml = require('draftjs-to-html');
let pdf = require('html-pdf');
const uuidv4 = require('uuid/v4');
let pdfTemplate = require('../../documents');
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

module.exports.updateSection = (id, data) => {
    if(data.sectionId){
        return model.updateSection(id, data.sectionId, data);
    }
}

module.exports.deleteSection = (id, sectionId) => {
    return model.deleteSection(id, sectionId);    
}

module.exports.addAlias = (id, data) => {
    return model.addAlias(id, data);
}

module.exports.updateAlias = (id, data) => {
    return model.updateAlias(id, data.aliasId, data);
}

module.exports.deleteAlias = (id, aliasId) => {    
    return model.deleteAlias(id,aliasId);
}

module.exports.createDocPdfFromDocument = (id, newFile) => {
    return new Promise(async (resolve, reject) => {
        let document = await model.getOneById(id);
        if(!document) {
            resolve(false);
            return null;
        }

        let filename;
        if(!newFile) filename = id;
        else filename = uuidv4();

        pdf.create(pdfTemplate(documentReplacement(document)), {
            format: 'A4',
            orientation: 'portrait',
            border: {
                "top": "2.5cm",            // default is 0, units: mm, cm, in, px
                "right": "3cm",
                "bottom": "2.5cm",
                "left": "3cm"
            }
        }).toFile(`./public/uploads/${id}.pdf`, (err, res) => {
            if (err) return console.log('error');
            resolve(res.filename);
        })        

    })
}

const documentReplacement = (document) => {
    let html = "";
    let article = 1;

    for(let section of document.sections) {
        replacedSection = sectionReplacement(section, document.aliases, article);
        html += replacedSection.html;
        article = replacedSection.article;
    }    

    return html;
}

const sectionReplacement = (section, aliases, article) => {
    let description = draftToHtml(JSON.parse(section.description));
    const ALIAS_REGEX = /\$\{(.*?)\}/g;
    let aliasesKeys = aliases.map((elem) => { return elem.key });
    let chapter = 1;

    while ((matchArr = ALIAS_REGEX.exec(description)) !== null) {
        if (matchArr[0] == '${title}') {
            description = description.replace('${title}', section.title);
        };

        if (matchArr[0] == '${article}') {
            description = description.replace('${article}', `Artigo ${article++}º.`);
        }

        if (matchArr[0] == '${chapter}') {
            description = description.replace('${chapter}', `CAPÍTULO ${chapter++}º`);
        }

        if ((index = aliasesKeys.indexOf(matchArr[1])) != -1) {
            description = description.replace(matchArr[0], aliases[index].value);
        }
    }

    return {html: description, article};
}

module.exports.pdfTemplate = async (id) => {
    let document = await model.getOneById(id);
    if(!document) {
        resolve(false);
        return null;
    }

    return documentReplacement(document);
}