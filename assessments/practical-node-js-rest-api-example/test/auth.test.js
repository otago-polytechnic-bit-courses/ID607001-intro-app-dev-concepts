import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../app.js'

process.env.NODE_ENV = 'testing'

/** Provide an interface for live testing */
chai.use(chaiHttp)

/**
 * Sample test. The it() function's first argument is
 * a description of the test
 */
it('should register user with valid input and login user', (done) => {
  /**
   * Payload that is sent with when registering a user
   */
  let user = {
    name: {
      first: 'John',
      last: 'Doe'
    },
    email: 'john.doe@email.com',
    password: 'P@ssw0rd123'
  }

  chai
    .request(app) /** Chai needs to run the Express server */
    .post('/api/register') /** Making a request to the register route */
    .send(user)
    .end((error, res) => {
      chai
        .expect(res.status)
        .to.be.equal(201) /** Checking if the status is 201: Created */
      chai
        .expect(res.body)
        .to.be.a('object') /** We expect the response to be an object */
      chai
        .expect(res.body.msg)
        .to.be.equal(
          'User successfully registered'
        ) /** We expect the msg's value to be as described */
      chai
        .request(app)
        .post('/api/login') /** Making a request to the login route */
        .send({
          /** Sending only the user's email and password */ email: user.email,
          password: user.password
        })
        .end((error, res) => {
          /** Much the same as above */
          chai.expect(res.status).to.be.equal(200)
          chai.expect(res.body).to.be.a('object')
          chai.expect(res.body.msg).to.be.equal('User successfully logged in')
        })
      done() /** Call the afterEach() function then move onto the next test */
    })
})
