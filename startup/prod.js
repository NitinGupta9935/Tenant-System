const compression = require('compression');     // compress http routes
const helmet = require('helmet');   // for protect from unwanted attack

module.exports = function (app) {
    app.use(helmet());
    app.use(compression());
};


// Heroku gmail:- nitingupta9935@gmail.com   pass:- Fake@6347

// On CMD
// npm i -g heroku
// npm uninstall -g heroku
// heruko -v
// heruko -b
// some setting on package.json on start and engine
// (install git)
// git --version

// add to git repository
// git init
// (do some work on .gitignore)
// git add .
// git commit -n "First commit."

// To run application => npm start

// if error occure go and watch mosh lecture 