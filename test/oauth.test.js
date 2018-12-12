let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
let expect = chai.expect;
let should = chai.should;

let server = require('../loader.js');
let token = require('./token');

describe('Test OAuth is Working', function(done){
    it('should get Access Token with Password grant', function(done){
        this.timeout(5000);
        chai.request(server)
            .post('/api/v1/oauth/token')
            .type('form')
            .send({
                client_id:'democlient',
                client_secret:'democlientsecret',
                grant_type:'password',
                username:'teste',
                password:'testepassword',
                scope:'teste'
            })
            .end(function(err, res){                
                expect(res.status).to.eql(200);
                expect(res.body.accessToken).to.not.be.null;
                expect(res.body.accessTokenExpiresAt).to.not.be.null;

                token.set(res.body);
                done();      
            });
    });

    it('should get Access Token with Refresh Token grant', function(done){
        this.timeout(5000);
        chai.request(server)
            .post('/api/v1/oauth/token')
            .type('form')
            .send({
                client_id:'democlient',
                client_secret:'democlientsecret',
                grant_type:'refresh_token',
                refresh_token:token.get().refreshToken
            })
            .end(function(err, res){
                expect(res.status).to.eql(200);
                expect(res.body.accessToken).to.not.be.null;
                expect(res.body.accessTokenExpiresAt).to.not.be.null;

                token.set(res.body);
                done();      
            });
    });

    it('should do a request to API', function(done){
        this.timeout(2500);
        chai.request(server)
            .get('/api/v1/user')
            .set('authorization', `Bearer ${token.get().accessToken}`)
            .end(function(err, res){
                expect(res.status).to.eql(200);
                done();
            });
    })
});