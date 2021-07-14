'use strict';

const bookDB = require('../utils/db');
const Book = bookDB.get('book');

module.exports = (app, route) => {

    app.use(route.post('/book/add', function* addbook(next){
        if (this.method !== 'POST') return yield next;

        const input = this.request.fields;
        const name = input.name;
        const category = input.category;
        const author = input.author;

        const inserted = yield Book.insert({ name, category, author});
        if (!inserted) {
            this.throw(500, 'failed to insert book');
          }

        this.body = {
            name: name,
            category: category,
            author: author
        };
        return this.body;
    }));
    
    app.use(route.delete('/book/delete', function* deletebook(next){
        if (this.method !== 'DELETE') return yield next;
    
        const input = this.request.fields;
        const name = input.name;

        const deleted = yield Book.remove({ name});
        if (!deleted) {
            this.throw(500, 'failed to delete book');
          }

          this.body = 'delete book successfully\n';
          return this.body;
    }));

    app.use(route.post('/book/search', function* searchbook(next){
        if (this.method !== 'POST') return yield next;

        const input = this.request.fields;
        const name = input.name;
      

        const book = yield Book.findOne({ name: name });
        if (!book) {
            this.throw(404, `cannot find book ${name}`);
        }
       
        this.body = book;

        return this.body;
    }));

    app.use(route.put('/book/update/:name0', function* updatebook(name0, next){
        if (this.method !== 'PUT') return yield next;

        const input = this.request.fields;
        const name = input.name;
        const category = input.category;
        const author = input.author;
        
        const book0 = yield Book.find({ name: name0 });
        if (!book0) {
            this.throw(404, 'can not find book, please add first');
          }
        //console.log(book);
        
        const updated = yield Book.update({ name: name0}, {
            $set: {
                name: name,
                category: category,
                author: author
            },
            });
        if (!updated.nModified) {
            this.throw(500, 'failed to update book');
        }
        const book = yield Book.findOne({ name: name });
        this.body = book;
        return this.body;
    }));
    
};