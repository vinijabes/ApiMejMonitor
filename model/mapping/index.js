var City = require('./schema').City;
var Ies = require('./schema').Ies;
var Course = require('./schema').Course;
var Region = require('./schema').Region;
var fs = require('fs');

module.exports.createCity = async (data) => {
    options = { upsert: true, new: true, setDefaultsOnInsert: true };
    return await City.findOneAndUpdate({ _id: data._id }, data, options);
}

module.exports.dropCity = async () => {
    return await City.deleteMany({});
}

module.exports.getCity = async (config = {}) => {
    return await City.find(config).exec();
}

module.exports.getOneCityById = async (id) => {
    return await City.findById(id).exec();
}

module.exports.getOneCityByName = async (name) => {
    return await City.findOne({ name }).exec();
}

module.exports.updateCity = async (id, data) => {
    let doc = await City.findById(id).exec();
    doc.set(data);
    return await doc.save();
}

module.exports.deleteCity = async (id) => {
    let doc = await City.findById(id).exec();
    try {
        return !! await doc.delete();
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports.createIes = async (data) => {
    options = { upsert: true, new: true, setDefaultsOnInsert: true };
    return await Ies.findOneAndUpdate({ _id: data._id }, data, options);
}

const getCityIes = async (filter = {}, config = {}) => {
    let aggregations = [];
    aggregations.push({ $unwind: { path: '$campus', "preserveNullAndEmptyArrays": true } });
    
    if(config.limit) aggregations.push({ $limit: config.limit});
    if(config.skip) aggregations.push({ $skip: config.skip});

    return await City.populate(
        await Course.populate(
            await Ies.aggregate(
                aggregations), 
            { path: 'campus.courses' }),
        [{ path: 'city' }, {path:'campus.city'}])
}

module.exports.getCityIes = getCityIes;

module.exports.getCityIesCount = async(config = {}) => {
    return (await getCityIes(config)).length;
}

module.exports.getOneCityIesById = async (id) => {
    return await Ies.findById(id).exec();
}

const getCityIesByRegion = async (config = {}) => {
    return await City.populate(
        await Course.populate(
            await Ies.aggregate([
                {
                    $unwind: {path: '$campus', "preserveNullAndEmptyArrays": true}                    
                },
                {
                    $project: {
                        name: 1,
                        tag: 1,
                        type: 1,
                        presential: 1,
                        info: 1,
                        city: {
                            $cond: [
                                {$ifNull: ['$campus.city', true]},
                                '$city',
                                '$campus.city'
                            ]
                        },
                        courses: {
                            $cond: [
                                {$ifNull: ['$campus.courses', true]},
                                '$courses',
                                '$campus.courses'
                            ]
                        },
                        'university_code': '$_id',
                        '_id': '$campus._id'
                    }
                },
                {
                    $lookup: {
                        from: 'regions',
                        let: { city_id: "$city" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $in: ['$$city_id', '$cities'] }
                                        ]
                                    }
                                },
                            },
                            {
                                $project: {
                                    cities: { $size: '$cities' }
                                }
                            }
                        ],
                        as: 'temp'
                    }
                },
                {
                    $unwind: {
                        path: '$temp'
                    }
                },
                {
                    $project: {
                        temp: 0
                    }
                },
                {
                    $group: {
                        _id: { university_code: '$university_code', name: '$name' },
                        campus: { $push: '$$ROOT' }
                    }
                }
            ]),
            { path: 'campus.courses', select: 'name -_id' }),
        { path: 'campus.city', select: 'name -_id' })
}

module.exports.getCityIesByRegion = getCityIesByRegion;

module.exports.getCityIesByRegionCount = async (config = {}) => {
    return getCityIesByRegion(config).length;
}

module.exports.createCourse = async (data) => {
    options = { upsert: true, new: true, setDefaultsOnInsert: true };
    return await Course.findOneAndUpdate({ name: data.name }, data, options);
}

exports.getOneCourseById = async (id) => {
    return await Course.findById(id).exec();
}

module.exports.getCourse = async (config = {}) => {
    return await Course.find(config).populate('campus.courses', 'name').populate('courses', 'name').exec();
}

module.exports.createRegion = async (name) => {
    return await new Region({ name }).save();
}

module.exports.addCityToRegion = async (regionId, city) => {
    let region = await Region.findById(regionId).exec();
    region.cities.push(city);
    return await region.save();
}

module.exports.getRegion = async () => {
    return await Region.find().exec();
}