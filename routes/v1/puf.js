let controller = require('../../controller/puf');
let upload = require('../../middlewares/upload');

module.exports = (app, authenticate) => {
    app.post('/puf/ej', authenticate(), upload.single('img'), async (req, res) => {
        let data = req.body;
        if(req.file) data.imgPath = req.file.path;
        
        let ej = await controller.create(data);
        if(ej){
            res.status(201).json({
                code: 201,
                ej
            });
        }else{
            res.status(500).json({
                code: 500
            });
        }        
    });

    app.put('/puf/ej', authenticate(), upload.single('img'), async (req, res) => {        
        let {_id, ...data} = req.body;
        if(req.file) data.imgPath = req.file.path;

        let ej = await controller.update(_id, data);
        
        if(ej){
            res.status(200).json({
                code:200,
                ej
            });
        }else{
            res.status(500).json({
                code: 500
            })
        }
    })

    app.post('/puf/ej/goal', authenticate(), async (req, res) => {
        let {_id, ...data} = req.body;
        console.log(req.body)
        let ej = await controller.setGoals(_id, data.data);
        console.log("Requestttt");
        if(ej){
            res.status(201).json({
                code: 201,
                ej
            });
        }else{
            res.status(500).json({
                code: 500
            });
        }        
    });

    app.get('/puf/ej', authenticate(), async (req, res) => {
        let ejs = await controller.get();
        if(ejs){
            res.status(200).json({
                code: 200,
                ejs
            })
        }else{
            res.status(500).json({
                code: 500
            })
        }
    });

    app.get('/puf/ej/:id', authenticate('teste'), async (req, res) => {
        let ej = await controller.get(req.params.id);
        if(ej){
            res.status(200).json({
                code:200,
                ej
            });
        }else{
            res.status(500).json({
                code: 500
            })
        }
    });

    app.delete('/puf/ej/:id', authenticate(), async (req, res) => {
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

    app.post('/puf/ej/project', authenticate(), async (req, res) => {
        console.log(req.body);
        let {_id, ...data} = req.body;        
        let result = await controller.addProject(_id, data);
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