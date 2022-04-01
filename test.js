var supertest = require("supertest");
var server = supertest.agent("http://localhost:3000");
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);
var expect = chai.expect;
// UNIT test begin

describe('Login', () => {
    it('should login and return Bearer Token', (done) => {
        token = server
            .post('/api/login')
            .send({ email: "arvinyardhika@gmail.com", password: "arvin@123" })
            .expect("Content-type", /json/)
            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
            .expect(200)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                expect(res.body.data.token).to.not.be.null;
                let token = res.body.data.token
                console.log(res.body)
                done();

                describe('View Cart', () => {
                    it('Should pass token to get user cart', (done) => {
                        server
                            .get('/api/view/cart')
                            .expect("Content-type", /json/)
                            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
                            .set('Authorization', 'Bearer ' + token)
                            .expect(200)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.data.should.be.a('array');
                                console.log(res.body)
                                done();
                            });
                    });
                });

                describe('Add Cart', () => {
                    it('Should pass product id and amount of items', (done) => {
                        server
                            .post('/api/addtocart')
                            .send({ product_id: 1, total_items: 5 })
                            .expect("Content-type", /json/)
                            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
                            .set('Authorization', 'Bearer ' + token)
                            .expect(200)
                            .end((err, res) => {
                                console.log(res.body)
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.data.should.be.a('object');
                                done();
                            });
                    });
                });

                describe('Delete Cart', () => {
                    it('Should pass product id to delete items', (done) => {
                        server
                            .post('/api/deletefromcart')
                            .send({ product_id: 1 })
                            .expect("Content-type", /json/)
                            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
                            .set('Authorization', 'Bearer ' + token)
                            .expect(200)
                            .end((err, res) => {
                                console.log(res.body)
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.data.should.be.a('object');
                                done();
                            });
                    });
                });

                describe('Re-Add Item', () => {
                    it('Should pass product id and amount of items', (done) => {
                        server
                            .post('/api/addtocart')
                            .send({ product_id: 1, total_items: 5 })
                            .expect("Content-type", /json/)
                            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
                            .set('Authorization', 'Bearer ' + token)
                            .expect(200)
                            .end((err, res) => {
                                console.log(res.body)
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.data.should.be.a('object');
                                done();
                            });
                    });
                });

                describe('View Cart', () => {
                    it('Check Cart to do Checkout', (done) => {
                        server
                            .get('/api/view/cart')
                            .expect("Content-type", /json/)
                            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
                            .set('Authorization', 'Bearer ' + token)
                            .expect(200)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.data.should.be.a('array');
                                let transaction_id = res.body.data[0].id
                                console.log(res.body)

                                describe('Checkout', () => {
                                    it('Pass transaction_id to Checkout cart for user', (done) => {
                                        server
                                            .post('/api/checkout')
                                            .send({ transaction_id: transaction_id })
                                            .expect("Content-type", /json/)
                                            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
                                            .set('Authorization', 'Bearer ' + token)
                                            .expect(200)
                                            .end((err, res) => {
                                                console.log(res.body)
                                                res.should.have.status(200);
                                                res.body.should.be.a('object');
                                                res.body.data.should.be.a('object');
                                                done();
                                            });
                                    });
                                });

                                describe('View Checkout Cart', () => {
                                    it('Should pass token to get item that use already checkouted', (done) => {
                                        server
                                            .get('/api/view/checkout')
                                            .expect("Content-type", /json/)
                                            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
                                            .set('Authorization', 'Bearer ' + token)
                                            .expect(200)
                                            .end((err, res) => {
                                                res.should.have.status(200);
                                                res.body.should.be.a('object');
                                                res.body.data.should.be.a('array');
                                                console.log(res.body)
                                                let transaction_id = res.body.data[0].id
                                                done();

                                                describe('Pay Checkout Cart', () => {
                                                    it('Pass transaction_id to do payment user cart', (done) => {
                                                        server
                                                            .post('/api/pay')
                                                            .send({ transaction_id: transaction_id })
                                                            .expect("Content-type", /json/)
                                                            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
                                                            .set('Authorization', 'Bearer ' + token)
                                                            .expect(200)
                                                            .end((err, res) => {
                                                                res.should.have.status(200);
                                                                res.body.should.be.a('object');
                                                                res.body.data.should.be.a('object');
                                                                console.log(res.body)
                                                                done();
                                                            });
                                                    });
                                                });


                                                describe('View Paid Cart', () => {
                                                    it('Pass Bearer Token to check cart that has already been paid', (done) => {
                                                        server
                                                            .get('/api/view/paid')
                                                            .expect("Content-type", /json/)
                                                            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
                                                            .set('Authorization', 'Bearer ' + token)
                                                            .expect(200)
                                                            .end((err, res) => {
                                                                res.should.have.status(200);
                                                                res.body.should.be.a('object');
                                                                res.body.data.should.be.a('array');
                                                                console.log(res.body)
                                                                done();
                                                            });
                                                    });
                                                });

                                                describe('View All Cart', () => {
                                                    it('Pass Bearer token to check status of all transactions user has', (done) => {
                                                        server
                                                            .get('/api/view/all')
                                                            .expect("Content-type", /json/)
                                                            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
                                                            .set('Authorization', 'Bearer ' + token)
                                                            .expect(200)
                                                            .end((err, res) => {
                                                                res.should.have.status(200);
                                                                res.body.should.be.a('object');
                                                                res.body.data.should.be.a('array');
                                                                console.log(res.body)
                                                                done();
                                                            });
                                                    });
                                                });

                                                describe('Find items', () => {
                                                    it('Find items based on param send', (done) => {
                                                        server
                                                            .post('/api/find')
                                                            .send({product_name:"sabu"})
                                                            .expect("Content-type", /json/)
                                                            .set('api_key', '76f8a1fab09bc13f2e48be45689dd074')
                                                            .set('Authorization', 'Bearer ' + token)
                                                            .expect(200)
                                                            .end((err, res) => {
                                                                res.should.have.status(200);
                                                                res.body.should.be.a('object');
                                                                res.body.data.should.be.a('array');
                                                                console.log(res.body)
                                                                done();
                                                            });
                                                    });
                                                });

                                            });
                                    });
                                });




                                done();

                            });
                    });
                });



            });
    });
});
