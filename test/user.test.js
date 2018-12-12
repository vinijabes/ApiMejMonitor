let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let expect = chai.expect;
let should = chai.should;

let server = require('../loader.js');
let token = require('./token');

describe('Test User CRUD is Working', function(done){
    let user;
    it('should create User', function(done){
        chai.request(server)
            .post('/api/v1/user')
            .set('authorization', `Bearer ${token.get().accessToken}`)
            .send({                
                username:'user@test.com',
                password:'testpassword',
                firstname:'Test',
                lastname:'User',
                scope:'teste'
            })
            .end(function(err, res){                
                expect(res.status).to.eql(201);
                expect(res.body.code).to.eql(201);
                expect(res.body.user).to.not.be.null;

                user = res.body.user;
                done();      
            });
    }); 

    it('should get an array of Users', function(done){
        chai.request(server)
            .get(`/api/v1/user`)
            .set('authorization', `Bearer ${token.get().accessToken}`)
            .end(function(err, res){                
                expect(res.status).to.eql(200);
                expect(res.body.code).to.eql(200);
                expect(res.body.users).to.not.be.null;
                expect(res.body.users).to.be.an('array');

                done();      
            });
    });

    it('should get an User', function(done){
        chai.request(server)
            .get(`/api/v1/user/${user._id}`)
            .set('authorization', `Bearer ${token.get().accessToken}`)
            .end(function(err, res){                
                expect(res.status).to.eql(200);
                expect(res.body.code).to.eql(200);
                expect(res.body.user).to.not.be.null;

                done();      
            });
    });

    it('should update User', function(done){
        chai.request(server)
            .put('/api/v1/user')
            .set('authorization', `Bearer ${token.get().accessToken}`)
            .send({
                ...user,
                firstname: 'Updated Test'
            })
            .end(function(err, res){                
                expect(res.status).to.eql(200);
                expect(res.body.code).to.eql(200);
                expect(res.body.user).to.not.be.null;

                expect(res.body.user.firstname).to.eql('Updated Test');
                done();      
            });
    });
    
    it('should delete User', function(done){
        chai.request(server)
            .delete(`/api/v1/user/${user._id}`)
            .set('authorization', `Bearer ${token.get().accessToken}`)
            .end(function(err, res){                
                expect(res.status).to.eql(200);
                expect(res.body.code).to.eql(200);
                
                done();      
            });
    });
});