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
// if error occure go and watch mosh lecture
// some setting on package.json on start and engine
// (install git)
// git --version

// add to git repository
// git init
// (do some work on .gitignore)
// git add .
// git commit -m "First commit."

// heroku create
// OR heroku create renting
// git remote -v
// git push heroku master {push our changes}
// https://powerful-sea-80754.herokuapp.com/    copy
// heroku logs or dashboard.heroku.com
// heroku config:set NODE_ENV=production

// To run application => npm start
