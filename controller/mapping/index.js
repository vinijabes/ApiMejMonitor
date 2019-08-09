const HTMLParser = require('node-html-parser');
const querystring = require('querystring');
const FormData = require('form-data');
const fetch = require('node-fetch');
const md5 = require('md5');
var iconv = require('iconv-lite');
const utf8 = require('utf8');
let axios = require('axios')
let model = require('../../model/mapping');

module.exports.createCity = (data) => {
    return model.create(data);
}

var getCity = (id, config = {}) => {
    if (id) return model.getOneCityById(id);
    else return model.getCity(config);
}

module.exports.getCity = getCity;

module.exports.updateCity = (id, data) => {
    return model.update(id, data);
}

module.exports.deleteCity = (id) => {
    return model.delete(id);
}

module.exports.syncCities = async () => {
    try {
        let result = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/35/municipios');
        await model.dropCity();
        for (let city of result.data) {
            await model.createCity({ _id: city.id, name: city.nome });
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

var requestIesHtml = async (iesCode) => {
    let data = {}

    data['data[CONSULTA_AVANCADA][hid_template]'] = 'listar-consulta-avancada-ies';
    data['data[CONSULTA_AVANCADA][hid_order]'] = 'ies.no_ies ASC';
    data['data[CONSULTA_AVANCADA][hid_no_cidade_avancada]'] = '';
    data['data[CONSULTA_AVANCADA][hid_no_regiao_avancada]'] = '';
    data['data[CONSULTA_AVANCADA][hid_no_pais_avancada]'] = '';
    data['data[CONSULTA_AVANCADA][hid_co_pais_avancada]'] = '';
    data['data[CONSULTA_AVANCADA][rad_buscar_por]'] = 'IES';
    data['data[CONSULTA_AVANCADA][txt_no_ies]'] = '';
    data['data[CONSULTA_AVANCADA][txt_no_ies_curso]'] = '';
    data['data[CONSULTA_AVANCADA][txt_no_ies_curso_especializacao]'] = '';
    data['data[CONSULTA_AVANCADA][txt_no_curso]'] = '';
    data['data[CONSULTA_AVANCADA][sel_co_area_geral]'] = '';
    data['data[CONSULTA_AVANCADA][sel_co_area_especifica]'] = '';
    data['data[CONSULTA_AVANCADA][sel_co_area_detalhada]'] = '';
    data['data[CONSULTA_AVANCADA][sel_co_area_curso]'] = '';
    data['data[CONSULTA_AVANCADA][txt_no_especializacao]'] = '';
    data['data[CONSULTA_AVANCADA][sel_co_area]'] = '';
    data['data[CONSULTA_AVANCADA][sel_sg_uf]'] = 'SP';
    data['data[CONSULTA_AVANCADA][sel_co_municipio]'] = iesCode;
    data['data[CONSULTA_AVANCADA][sel_st_gratuito]'] = '';
    data['data[CONSULTA_AVANCADA][sel_no_indice_ies]'] = '';
    data['data[CONSULTA_AVANCADA][sel_no_indice_curso]'] = '';
    data['data[CONSULTA_AVANCADA][sel_co_situacao_funcionamento_ies]'] = '10035';
    data['data[CONSULTA_AVANCADA][sel_co_situacao_funcionamento_curso]'] = '9';
    data['data[CONSULTA_AVANCADA][sel_st_funcionamento_especializacao]'] = '';
    data['captcha'] = '';

    var form_data = new FormData();
    for (var key in data) {
        form_data.append(key, data[key]);
    }
    form_data.append('data[CONSULTA_AVANCADA][chk_tp_organizacao_gn][]', '10022, 10024, 10023, 10027');
    form_data.append('data[CONSULTA_AVANCADA][chk_tp_organizacao_gn][]', '10019, 10020, 10021, 10026');
    form_data.append('data[CONSULTA_AVANCADA][chk_tp_organizacao_gn][]', '10026, 10019');
    form_data.append('data[CONSULTA_AVANCADA][chk_tp_organizacao_gn][]', '10028, 10029');
    form_data.append('data[CONSULTA_AVANCADA][chk_tp_credenciamento_gn][]', '112'); 
    

    let result = await fetch('http://emec.mec.gov.br/emec/nova-index/listar-consulta-avancada/list/300', { method: 'POST', body: form_data, headers: form_data.getHeaders() });
    return iconv.decode(await result.buffer(), 'ISO-8859-1');
}

var fetchIesData = async (iesCode) => {
    let result = await fetch(`http://emec.mec.gov.br/emec/consulta-ies/index/d96957f455f6405d14c6542552b0f6eb/${Buffer.from(iesCode).toString('base64')}`, { method: 'GET'});
    let decodedHtml = iconv.decode( await result.buffer(), 'ISO-8859-1');

    const root = HTMLParser.parse(decodedHtml);
    let row = root.querySelectorAll('tr');
    let columns = row[3].querySelectorAll('table td');
    let i = 0;

    let phone = columns[19].structuredText;
    let site = columns[25].structuredText;
    let email = columns[27].structuredText;

    await model.createIes({_id: iesCode, info: {phone: phone.split('\n'), site, email: email.split('\n')}});

    //`http://emec.mec.gov.br/emec/consulta-ies/index/d96957f455f6405d14c6542552b0f6eb/${Buffer.from(iesCode).toString('base64')}`
    //http://emec.mec.gov.br/emec/consulta-ies/index/d96957f455f6405d14c6542552b0f6eb/MTcwMTQ=
}

var fetchCourse = async(iesCode, campiCode) => {
    let result = await fetch(`http://emec.mec.gov.br/emec/consulta-ies/listar-curso-endereco/d96957f455f6405d14c6542552b0f6eb/${Buffer.from(iesCode).toString('base64')}/aa547dc9e0377b562e2354d29f06085f/${Buffer.from(campiCode).toString('base64')}`, { method: 'GET'});
    let decodedHtml = iconv.decode( await result.buffer(), 'ISO-8859-1');

    const root = HTMLParser.parse(decodedHtml);
    let table = root.querySelector('#listar-ies-cadastro');
    let rows = table.querySelectorAll('tbody td');

    return rows.map((elem) => elem.structuredText);
}

var insertNewCourses = async (courses) => {
    let coursesIds = [];
    for(let course of courses){
        coursesIds.push((await model.createCourse({name: course}))._id);
    }
    return coursesIds;
}

var fetchCampi = async (iesCode) => {
    let result = await fetch(`http://emec.mec.gov.br/emec/consulta-ies/listar-endereco/d96957f455f6405d14c6542552b0f6eb/${Buffer.from(iesCode).toString('base64')}`, { method: 'GET'});
    let decodedHtml = iconv.decode( await result.buffer(), 'ISO-8859-1');

    const root = HTMLParser.parse(decodedHtml);
    let table = root.querySelector('#listar-ies-cadastro');

    let rows = table.querySelectorAll('tbody tr');
    if(rows.length <= 1){
        let columns = rows[0].querySelectorAll('td');
        let campiCode = columns[0].structuredText;
        await model.createIes({_id: iesCode, courses: await insertNewCourses(await fetchCourse(iesCode, campiCode))});
        return;
    };

    let campus = [];
    for(let row of rows){
        let columns = row.querySelectorAll('td');
        let campiCode = columns[0].structuredText;
        let city = columns[4].structuredText;
        try{

            campus.push({
                _id: campiCode,
                city: (await model.getOneCityByName(city))._id,            
                courses: await insertNewCourses(await fetchCourse(iesCode, campiCode))
            });        
        }catch(err){
            console.log(city);
            break;
        }
    }

   await model.createIes({_id: iesCode, campus});
}

module.exports.syncCityIes = async () => {
    try {

        let cities = await getCity(null);
        for (let c of cities) {
            html = await requestIesHtml(c._id);
    
            const root = HTMLParser.parse(html);

            let rows = root.querySelectorAll('.linha_tr_body_nova_grid');
            rows = rows.concat(root.querySelectorAll('.linha_tr_body_nova_grid_old'));
            for (let row of rows) {
                let columns;
                try {
                    columns = row.querySelectorAll('td');
                } catch (err) {
                    console.log(c);
                    break;
                }
                //if (!columns) { console.log(c._id); continue; };
                let iesName = columns[0].structuredText ? columns[0].structuredText : columns[0].text;
                let iesTag = columns[1] ? (columns[1].structuredText ? columns[1].structuredText : columns[1].text) : null;
                let iesType = columns[3] ? (columns[3].structuredText ? columns[3].structuredText : columns[3].text) : null;

                let city = c._id;
                let regexUniversityCode = /\([0-9]*\)/g;

                if (!iesName) { console.log(c._id, c.name); continue; };
                let universityCode
                try{
                    universityCode = regexUniversityCode.exec(iesName)[0];
                }catch(err){
                    console.log(iesName);
                    continue;
                }
                let data = {
                    _id: universityCode.replace(/[()]/g, ''),
                    name: iesName,
                    tag: iesTag,
                    type: iesType,
                    presential: true,
                    city
                }

                await model.createIes(data)
                await fetchIesData(universityCode.replace(/[()]/g, ''));
                await fetchCampi(universityCode.replace(/[()]/g, ''));
            }          
        }
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports.getCityIes = async (id, filter = {}, config = {}) => {
    if (id) return model.getOneCityIesById(id);
    else return {
        data: await model.getCityIes(filter, config),
        total: await model.getCityIesCount(filter)
    }
}

module.exports.getCourse = (id, config = {}) => {
    if (id) return model.getOneCourseId(id);
    else return model.getCourse(config);
}

module.exports.createRegion = async(name) => {
    return model.createRegion(name);
}

module.exports.addCityToRegion = async (regionId, city) => {
    if(Array.isArray(city)){
        let result;
        for(let c of city){
            console.log(c);
            result = await model.addCityToRegion(regionId, (await model.getOneCityByName(c))._id);
        }
        return result;
    }else{
        return model.addCityToRegion(regionId, (await model.getOneCityByName(city))._id);
    }
}

module.exports.getRegion = async () => {
    return model.getRegion();
}