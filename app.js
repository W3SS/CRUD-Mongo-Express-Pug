const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
const db = mongoose.connection;

//Check connection
db.once('open', () => {
    console.log('Connected to MongoDb');
});

//Check for db errors
db.on('error', function(err) {
    console.log(err);
});

const app = express();

//Bring in models
let Article = require('./models/article');


// view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parse middleware application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    Article.find({}, function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    });

});
// Add route
app.get('/articles/add', (req, res) => {
    res.render('add_article', {
        title: 'Add Article'

    });
});

//get single article
app.get('/article/:id', (req, res) => {
    Article.findById(req.params.id, function(err, article) {
        res.render('article', {
            article: article
        });
    });
});

//Add submit post route
app.post('/articles/add', (req, res) => {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    })
});


//Load Edit Form
app.get('/article/edit/:id', (req, res) => {
    Article.findById(req.params.id, function(err, article) {
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});

//Update submit post route
app.post('/articles/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = { _id: req.params.id }

    Article.update(query, article, function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            res.redirect('/');
        }
    })
});

//Detele request
app.delete('/article/:id', function(req, res) {
    let query = { _id: req.params.id }
    Article.remove(query, function(err) {
        if (err) {
            console.log(err);
        }
        res.send('Success');
    });
});

app.listen('3000', () => {
    console.log('Server Started on port 3000');
});