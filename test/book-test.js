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

describe('book_test', () => {
    before(done =>{
        removeAll(done);
    });

  it('add a book', done => {
    co(function *callback() {
      const res = yield request
        .post('/books')
        .send({
          name: 'AA',
          category: 'BB',
          author: 'CC'
        })
        .expect(200);

        const bookID = res.body.book_id;
        const result = yield Book.findOne({
            _id: bookID
        });
        expect(result.category).to.equal('BB');
        expect(result.author).to.equal('CC');
        done();

    }).then(() => {}, (err) => {
      logger.error(err);
      done(err);
    });
  });

  it('add a book with correct name only', done => {
    co(function *callback() {
      const res = yield request
        .post('/books')
        .send({
          name: 'DD'
        })
        .expect(200);

        const bookID= res.body.book_id;
        const result = yield Book.findOne({
            _id: bookID
        });
        expect(result.category).to.be.null;
        expect(result.author).to.be.null;
        done();

    }).then(() => {}, (err) => {
      logger.error(err);
      done(err);
    });
  });

  it('add a book without name', done => {
    co(function *callback() {
      const res = yield request
        .post('/books')
        .send({
          category: 'BB',
          author: 'CC'
        })
        .expect(400);

        done();

    }).then(() => {}, (err) => {
      logger.error(err);
      done(err);
    });
  });

  it('add a name that is not a string type', done => {
    co(function *callback() {
      const res = yield request
        .post('/books')
        .send({
          name: 11,
          category: 'BB',
          author: 'CC'
        })
        .expect(400);

        done();

    }).then(() => {}, (err) => {
      logger.error(err);
      done(err);
    });
  });

  

 it('delete a book', done => {
   co(function *callback() {
    yield Book.remove({});

     const book = yield Book.insert({
       name: "A",
       category:"B",
       author:"C"
     });

     const bookID = book._id.toString();

     const res = yield request
       .delete(`/books/${bookID}`)
       .expect(200)
      
     const result = yield Book.findOne({ _id: bookID });

     expect(result).to.be.null;

     done();
   }).then(() => {}, (err) => {
     logger.error(err);
     done(err);
   });
  });

it('search a book by name ', done => {
  co(function *callback() {
    yield Book.remove({});

    const book = yield Book.insert([
        {
          name: "a",
          category:"b",
          author:"c"
        },
        {
          name: "a",
          category:"bb",
          author:"cc"
        },
        {
          name: "a",
          category:"bbb",
          author:"ccc"
        }
      ]);

    const res = yield request
      .post('/books/a')
      .expect(200)
      expect(res.body).to.have.lengthOf(3);
    
    done();

  }).then(() => {}, (err) => {
    logger.error(err);
    done(err);
  });
});

it('update a book', done => {
  co(function *callback() {
    yield Book.remove({});

    const book = yield Book.insert({
        name: "A",
        category:"B",
        author:"C"
      });
      
    const bookID = book._id;

    const res = yield request
      .put(`/books/${bookID}`)
      .send({
        name: 'a',
        category: 'b',
        author: 'c'
      })
      .expect(200);

    const result = yield Book.findOne({ _id:bookID });
      expect(result.name).to.equal('a');
      expect(result.category).to.equal('b');
      expect(result.author).to.equal('c');

    done();

  }).then(() => {}, (err) => {
    logger.error(err);
    done(err);
  });
});





});