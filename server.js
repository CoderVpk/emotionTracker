/*server.js*/
/*const http = require('http');
const fs = require('fs');

const server = http.createServer(function(req, res) {
  fs.readFile('emotion.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});*/

const hostname = '127.0.0.1';
const port = 3000;

const path = require('path')
const express = require('express')

const routes = require('./routes')
const app = express()

const mysql = require('mysql');

const bodyParser = require('body-parser')

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static('music_files'))

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'emotion'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

const middlewares = [
  //layout(),
  //express.static(path.join(__dirname, 'public'))
  bodyParser.urlencoded()
]

app.use('/', routes)

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000, () => {
  console.log('Server running at http://'+ hostname + ':' + port + '/');
})
