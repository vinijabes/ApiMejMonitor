let controller = require('../../controller/visit');
let upload = require('../../middlewares/upload');
var url = require('url');

module.exports = (app, authenticate) => {
    app.post('/visit', authenticate(), async (req, res) => {
        let data = req.body;        
        console.log(data);
        let visit = await controller.create(data);
        if(visit){
            res.status(201).json({
                code: 201,
                visit
            });
        }else{
            res.status(500).json({
                code: 500
            });
        }        
    });

    app.put('/visit', authenticate(), upload.single('img'), async (req, res) => {        
        let {_id, ...data} = req.body;        
        let visit = await controller.update(_id, data);
        
        if(visit){
            res.status(200).json({
                code:200,
                visit
            });
        }else{
            res.status(500).json({
                code: 500
            })
        }
    })

    app.get('/visit', async (req, res) => {
        var url_parts = url.parse(req.url, true);
        var query = url_parts.query;
        let config = {};
        if(query.ej) config.ej = query.ej;
        let visits = await controller.get(null, config);
        if(visits){
            res.status(200).json({
                code: 200,
                visits
            })
        }else{
            res.status(500).json({
                code: 500
            })
        }
    });

    app.get('/visit/:id', authenticate('teste'), async (req, res) => {
        let visit = await controller.get(req.params.id);
        if(visit){
            res.status(200).json({
                code:200,
                visit
            });
        }else{
            res.status(500).json({
                code: 500
            })
        }
    });

    app.delete('/visit/:id', authenticate(), async (req, res) => {
        let result = await controller.delete(req.params.id);
        if(result){
            res.status(200).json({
                code:200
            })
        }else{
            res.status(500).json({
                code:500
            })
        }
    })
}