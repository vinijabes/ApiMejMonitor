let controller = require('../../controller/document');
let pdfTemplate = require('../../documents');
let pdf = require('html-pdf');
var path = require('path');

module.exports = (app, authenticate) => {
    app.post('/document', authenticate(), async (req, res) => {
        let document = await controller.create(req.body);

        if (document) {
            res.status(201).json({
                code: 201,
                document
            });
        } else {
            res.status(500).json({
                code: 500
            });
        }
    });

    app.get('/document/fetch-pdf', (req, res) => {
        res.sendFile(path.resolve(`${__dirname}/../../public/uploads/resultado.pdf`));
    });

    app.get('/document', authenticate(), async (req, res) => {
        let documents = await controller.get();
        if (documents) {
            res.status(200).json({
                code: 200,
                documents
            });
        } else {
            res.status(500).json({
                code: 500
            });
        }
    });

    app.get('/document/:id', async (req, res) => {
        let document = await controller.get(req.params.id);
        if (document) {
            res.status(200).json({
                code: 200,
                document
            });
        } else {
            res.status(500).json({
                code: 500
            })
        }
    });

    app.put('/document', authenticate(), async (req, res) => {
        let { _id, ...data } = req.body;
        let document = await controller.update(_id, data);

        if (document) {
            res.status(200).json({
                code: 200,
                document
            });
        } else {
            res.status(500).json({
                code: 500
            })
        }
    });


    app.delete('/document/:id/alias/:aliasId', authenticate(), async (req, res) => {        
        let result = await controller.deleteAlias(req.params.id, req.params.aliasId);
        if (result) {
            res.status(200).json({
                code: 200
            })
        } else {
            res.status(500).json({
                code: 200
            })
        }
    });

    app.delete('/document/:id', authenticate(), async (req, res) => {
        let result = await controller.delete(req.params.id);
        if (result) {
            res.status(200).json({
                code: 200
            })
        } else {
            res.status(500).json({
                code: 200
            })
        }
    });

    app.post('/document/section', authenticate(), async (req, res) => {
        let { _id, ...data } = req.body;
        let document = await controller.addSection(_id, data);

        if (document) {
            res.status(201).json({
                code: 201,
                document
            });
        } else {
            res.status(500).json({
                code: 500
            });
        }
    });

    app.put('/document/section', authenticate(), async (req, res) => {
        let { _id, ...data } = req.body;
        let document = await controller.updateSection(_id, data);

        if (document) {
            res.status(201).json({
                code: 201,
                document
            });
        } else {
            res.status(500).json({
                code: 500
            });
        }
    });


    app.post('/document/alias', authenticate(), async (req, res) => {
        let { _id, ...data } = req.body;
        let document = await controller.addAlias(_id, data);

        if (document) {
            res.status(201).json({
                code: 201,
                document
            });
        } else {
            res.status(500).json({
                code: 500
            });
        }
    });

    app.put('/document/alias', authenticate(), async (req, res) => {
        let { _id, ...data } = req.body;
        let document = await controller.updateAlias(_id, data);

        if (document) {
            res.status(201).json({
                code: 201,
                document
            });
        } else {
            res.status(500).json({
                code: 500
            });
        }
    });

    app.post('/document/create-pdf', (req, res) => {
        pdf.create(pdfTemplate(req.body), {
            format: 'A4',
            orientation: 'portrait',
            border: {
                "top": "2.5cm",            // default is 0, units: mm, cm, in, px
                "right": "3cm",
                "bottom": "2.5cm",
                "left": "3cm"
            },
        }).toFile('./public/uploads/resultado.pdf', (err) => {
            if (err) return console.log('error');
            res.send(Promise.resolve())
        })
    })

    
}