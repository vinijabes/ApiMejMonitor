let controller = require('../../controller/user');

module.exports = (app, authenticate) => {
    app.post('/user', authenticate(),async (req, res) => {
        let user = await controller.create(req.body);
        
        if(user){
            res.status(201).json({
                code: 201,
                user
            });
        }else{
            res.status(500).json({
                code: 500
            });
        }        
    })

    app.get('/user', authenticate(), async (req, res) => {
        let users = await controller.get();
        if(users){
            res.status(200).json({
                code:200,
                users
            });
        }else{
            res.status(500).json({
                code: 500
            });
        }
    })

    app.get('/user/:id', authenticate(), async (req, res) => {
        let user = await controller.get(req.params.id);
        if(user){
            res.status(200).json({
                code:200,
                user
            });
        }else{
            res.status(500).json({
                code: 500
            })
        }
    })

    app.put('/user', authenticate(), async (req, res) => {        
        let {_id, ...data} = req.body;
        let user = await controller.update(_id, data);
        
        if(user){
            res.status(200).json({
                code:200,
                user
            });
        }else{
            res.status(500).json({
                code: 500
            })
        }
    })

    app.delete('/user/:id', authenticate(), async (req, res) => {
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
    })
}