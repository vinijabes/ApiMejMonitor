let controller = require('../../controller/document');

module.exports = (app, authenticate) => {
    app.post('/document', authenticate(),async (req, res) => {
        let document = await controller.create(req.body);
        
        if(document){
            res.status(201).json({
                code: 201,
                document
            });
        }else{
            res.status(500).json({
                code: 500
            });
        }        
    });

    app.get('/document', authenticate(), async (req, res) => {
        let documents = await controller.get();
        if(documents){
            res.status(200).json({
                code:200,
                documents
            });
        }else{
            res.status(500).json({
                code: 500
            });
        }
    });

    app.get('/document/:id', authenticate(), async (req, res) => {
        let document = await controller.get(req.params.id);
        if(document){
            res.status(200).json({
                code:200,
                document
            });
        }else{
            res.status(500).json({
                code: 500
            })
        }
    });

    app.put('/document', authenticate(), async (req, res) => {        
        let {_id, ...data} = req.body;
        let document = await controller.update(_id, data);
        
        if(document){
            res.status(200).json({
                code:200,
                document
            });
        }else{
            res.status(500).json({
                code: 500
            })
        }
    });

    app.delete('/document/:id', authenticate(), async (req, res) => {
        let result = await controller.delete(req.params.id);
        if(result){
            res.status(200).json({
                code:200
            })
        }else{
            res.status(500).json({
                code:200
            })
        }
    });

    app.post('/document/section', authenticate(),async (req, res) => {
        let {_id, ...data} = req.body;
        let document = await controller.addSection(_id, data);
        
        if(document){
            res.status(201).json({
                code: 201,
                document
            });
        }else{
            res.status(500).json({
                code: 500
            });
        }        
    });
}