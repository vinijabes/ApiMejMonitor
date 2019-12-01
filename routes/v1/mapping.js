let controller = require('../../controller/mapping');
var compression = require('compression')

module.exports = (app, authenticate) => {
    app.get('/city/sync', async (req, res) => {
        let result = await controller.syncCities();

        if (result) {
            res.status(201).json({
                code: 201                
            });
        } else {
            res.status(500).json({
                code: 500
            });
        }
    });

    app.get('/ies/sync', compression(), async (req, res) => {
        let result = await controller.syncCityIes();
        if (result) { 
            res.status(201).json({
                code: 200,
                cities: result
            })
        } else {
            res.status(500).json({
                code: 500
            });
        }
    });

    app.get('/city', async (req, res) => {
        let result = await controller.getCity();

        if(result){
            res.status(201).json({
                code: 200,
                cities: result
            })
        } else{
            res.status(500).json({
                code: 500
            })
        }
    })

    app.get('/ies/region/:id', async (req, res) => {
        let result = await controller.getCityIesByRegion(req.params.id);

        if(result){
            res.status(201).json({
                code: 200,
                ...result
            })
        } else{
            res.status(500).json({
                code: 500
            })
        }
    })

    app.get('/ies', async (req, res) => {
        let limit = parseInt(req.query.limit);
        let page = parseInt(req.query.page);
        let query = {limit: limit*page, skip: (page - 1)*limit};

        let result = await controller.getCityIes(null, {}, query);
        if(result){
            res.status(201).json({
                code: 200,
                ...result
            })
        } else{
            res.status(500).json({
                code: 500
            })
        }
    })

    app.get('/course', async (req, res) => {
        let result = await controller.getCourse();

        if(result){
            res.status(201).json({
                code: 200,
                courses: result
            })
        } else{
            res.status(500).json({
                code: 500
            })
        }
    })

    app.post('/region', async (req, res) => {
        let result = await controller.createRegion(req.body.name);

        if(result){
            res.status(201).json({
                code: 200,
                region: result
            })
        } else{
            res.status(500).json({
                code: 500
            })
        }
    })

    app.post('/region/city', async (req, res) => {
        let result = await controller.addCityToRegion(req.body._id, req.body.city);

        if(result){
            res.status(201).json({
                code: 200,
                region: result
            })
        } else{
            res.status(500).json({
                code: 500
            })
        }
    })

    app.get('/region', async (req, res) => {
        let result = await controller.getRegion();

        if(result){
            res.status(201).json({
                code: 200,
                regions: result
            })
        } else{
            res.status(500).json({
                code: 500
            })
        }
    })
}