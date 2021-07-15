'use strict';

const bookDB = require('../utils/db');
const Book = bookDB.get('book');

module.exports = (app, route) => {

    app.use(route.post('/books', function* addBooks(next){
        if (this.method !== 'POST') return yield next;
        const input = this.request.fields;
        const name = input.name;
        const category = input.category;
        const author = input.author;

        if(!name || typeof(name) != "string"){
            this.throw(400, 'must include a not null name of type string')
        }

        const inserted = yield Book.insert({name, category, author}); 
        if (!inserted) {
            this.throw(400, 'failed to insert book');
          }

        const bookID = inserted._id.toString();
        this.body = {
            book_id: bookID
        };
        return this.body;
    }));
    
    app.use(route.delete('/books/:id', function* deleteBooks(id, next){
        if (this.method !== 'DELETE') return yield next;

        const bookID = id.toString();
        const removed = yield Book.remove({ _id: bookID });

        if (removed.deletedCount == 0 ) {
            this.throw(400, 'failed to delete book');
          }
          this.body = '';
          return this.body;
    }));

    app.use(route.post('/books/:name', function* searchBooks(name, next){
        if (this.method !== 'POST') return yield next;
        const bookName = name;  
        const books = yield Book.find({ name: bookName });
        console.log(bookName);
        
        if (!books) {
            this.throw(404, 'failed to find book');
        }
       
        this.body = books;
        return this.body;
    }));

    app.use(route.put('/books/:id', function* updateBooks(id, next){
        if (this.method !== 'PUT') return yield next;

        const input = this.request.fields;
        const name = input.name;
        const category = input.category;
        const author = input.author;

        const bookID = id.toString();
        const book0 = yield Book.findOne({ _id: bookID });
        if (!book0) {
            this.throw(404, 'can not find book, please add first');
          }
        
        const updated = yield Book.update({ _id: bookID }, {
            $set: {
                name: name,
                category: category,
                author: author
            },
            });
        if (!updated.nModified) {
            this.throw(400, 'failed to update book');
        }

        const book = yield Book.findOne({ _id: bookID });
        this.body = book;
        return this.body;
    }));

};