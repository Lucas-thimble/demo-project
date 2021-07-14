/* eslint-env node, mocha */
'use strict';
process.env.NODE_ENV = 'test';

const app = require('../app');
const co = require('co');
const request = require('supertest').agent(app.listen());
const expect = require('chai').expect;
const bookDB = require('../utils/db');
const Book = bookDB.get('book');
const moment = require('moment-timezone');
const logger = require('bunyan').createLogger({ name: 'myproject-test' });
const chai = require('chai');
const _ = require('lodash');
const dirtyChai = require('dirty-chai');

chai.use(dirtyChai);

let bookName = '';

const removeAll = done => {
    co(function *callback() {
      yield Book.remove({});
      done();
    }).then(() => {}, (err) => {
      logger.error(err);
      done(err);
    });
  };

describe('test book', () => {
    before(done =>{
        removeAll(done);
    });

  it('add a book', done => {
    co(function *callback() {
      const res = yield request
        .post('/book/add')
        .send({
          name: 'xinhua',
          category: 'doc',
          author: 'me'
        })
        .expect(200);

        bookName = res.body.name;
        const result = yield Book.findOne({
            name:bookName,
        });
        expect(result.category).to.equal('doc');
        expect(result.author).to.equal('me');
        done();

    }).then(() => {}, (err) => {
      logger.error(err);
      done(err);
    });
  });

  it('add anothor book', done => {
    co(function *callback() {
      const res = yield request
        .post('/book/add')
        .send({
          name: 'China',
          category: 'news',
          author: "you"
        })
        .expect(200);

        bookName = res.body.name;
        const result = yield Book.findOne({
            name:bookName
        });
        expect(result.category).to.equal('news');
        expect(result.author).to.equal('you');

        done();

    }).then(() => {}, (err) => {
      logger.error(err);
      done(err);
    });
});

it('search a book by name', done => {
  co(function *callback() {
    const res = yield request
      .post('/book/search')
      .send({
          name:'xinhua'
        })
      .expect(200);
      
      bookName = res.body.name;
      const result = yield Book.findOne({
        name:bookName
      });
      
      expect(result.category).to.equal('doc');
      expect(result.author).to.equal('me');

      done();

  }).then(() => {}, (err) => {
    logger.error(err);
    done(err);
  });
});

it('update a book by name', done => {
  co(function *callback() {
    const res = yield request
      .put('/book/update/xinhua')
      .send({
        name: 'peiqi',
        category: 'child',
        author: 'he'
      })
      .expect(200);

      bookName = res.body.name;
      const result = yield Book.findOne({
        name:bookName
      });

      expect(result.category).to.equal('child');
      expect(result.author).to.equal('he');

      done();

  }).then(() => {}, (err) => {
    logger.error(err);
    done(err);
  });
});



it('delete book by name', done => {
    co(function *callback() {
      const res = yield request
        .delete('/book/delete')
        .send({
            name:'peiqi',
          })
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err;
          }
        });

        bookName = res.body.name;
        const result = yield Book.count({
            name:bookName
        });

        expect(result).to.equal(0);

        done();
    }).then(() => {}, (err) => {
      logger.error(err);
      done(err);
    });
  });

});