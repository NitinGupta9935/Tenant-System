const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const DB = require('./db');
const { name } = require('ejs');
const db = new DB();
const sendEmail = require('./sendEmail');
const upload = require('express-fileupload');
require('./startup/prod')(app);     // for production


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(upload());
app.use(express.static('uploads'));

app.get('/', (req, res) => {
    res.redirect('/adminLogin');
})

app.get('/login', (req, res) => {
    let error = req.cookies.loginError || '';
    if (error !== '')
        res.clearCookie('loginError');
    res.render('login', { "error": error });
});

app.post('/login',async (req, res) => {
    let { email, password } = req.body;
    if (!await db.isEmailExist(email)) {
        res.cookie('loginError', "Enter a valid email is invalid");
        res.redirect('/login');  
    }
    if (!await db.isPasswordExist(email, password)) {
        res.cookie('loginError', "Wrong password. Try again or click Forgot password to reset it.");
        res.redirect('/login');
    }
    let id = await db.login(email, password); 
    res.cookie('id', id);
    res.redirect('/logged');
});

app.get('/logged',async (req, res) => {
    let { id } = req.cookies;
    // let name = await db.getName(id);
    res.redirect(`/view/${id}`);
});

app.get('/login/forgetPassword', (req, res) => {
    let error = req.cookies.recoveryError || '';
    if (error !== '')
        res.clearCookie('recoveryError');
        res.render('forgetLoginpassword', {'error': error});
});

app.post('/login/forgetPassword',async (req, res) => {
    if (await db.isEmailExist(req.body.email)) {
        let error = res.cookie.recoveryError || '';
        if (error !== '')
            res.clearCookie('recoveryError');
        res.cookie('email', req.body.email);
        // await sendEmail(req.body.email) retur OTP
        res.cookie('otp', await sendEmail(req.body.email));
        res.redirect('/login/enterOtp');
    }
    else {
        res.cookie('recoveryError', "Enter a valid email is invalid");
        res.redirect('/login/forgetPassword');
    }
});

app.get('/login/enterOtp', (req, res) => {
    // res.send(req.cookies.otp);
    let error = req.cookies.otpError || '';
    if (error !== '')
        res.clearCookie('otpError');
    res.render('otp', {'error': error});
});

app.post('/login/enterOtp', (req, res) => {
    if (req.body.otp == req.cookies.otp) {
        res.clearCookie('otpError');
        res.redirect('/login/resetPassword');
    }
    else {
        res.cookie('otpError', 'Enter a valid otp');
        res.redirect('/login/enterOtp');
    }
});

app.get('/login/resetPassword', (req, res) => {
    let error = req.cookies.resetPasswordError || '';
    if (error !== '')
        res.clearCookie('resetPasswordError');
    res.render('resetPassword', { 'error': error });
});

app.post('/login/resetPassword', (req, res) => {
    if (req.body.password == '') {
        res.cookie('resetPasswordError', 'Enter a valid Password');
        res.redirect('/login/resetPassword');
    }
    else {
        db.reserPassword(req.cookies.email, req.body.password);
        res.redirect('/');
    }
});

app.get('/signUp', (req, res) => {
    let error = req.cookies.signUpError || '';
    if (error !== '')
        res.clearCookie('signUpError');
    res.render('signUp', { "error": error});
})

app.post('/signUp', async (req, res) => {
    const { firstName, lastName, email, password, married, people, job, vichele, number } = req.body;
    let photo = id = '';
    if (await db.isEmailExist(email)) {
        res.cookie('signUpError', 'That username is already taken. Try another.');
        res.redirect('/signUp');
    }
    else {
        let temp = married || '';
        let isMarried = true;
        if (temp === '')
            isMarried = false;
        if (req.files) {
            if (req.files.photo !== undefined) {
                photo = req.files.photo.name;
                req.files.photo.mv('./uploads/'+photo, function () { });
            }
            if (req.files.id !== undefined) {
                id = req.files.id.name;
                req.files.id.mv('./uploads/'+id, function () { });
            }
        }
        let userId = await db.signUp(firstName, lastName, email, password, isMarried, people, job, photo, id, vichele, number);
        res.cookie('id', userId);
        // console.log(await db.getName(id));
        // res.send(req.body);
        res.redirect('/logged');
    }
});

app.get('/adminLogin', (req, res) => {
    let error = req.cookies.adminLoginError || '';
    if (error !== '')
        res.clearCookie('adminLoginError');
    res.render('adminLogin', { 'error': error});
});

app.post('/adminLogin', async (req, res) => {
    if (await db.isAdminPasswordCorrect(req.body.password)) {
        res.cookie("adminLogin", "yes"); // try to know who redirect in /view
        res.render("home", { 'userData': await db.getUserData() });
    }
    else {
        res.cookie("adminLoginError", "Enter a valid password");
        res.redirect('/adminLogin');
    }
});

app.get('/view/:id', async (req, res) => {
    // modify url
    let url = req.url.slice(0, -1);
    while (url.slice(0, -1) !== '/')
        url = url.slice(0, -1);
    url = url.slice(0, -1);

    // button redirect to /edit:id
    // check is admin redirect or not
    let isAdminRedirect = req.cookies.adminLogin || '';
    if (isAdminRedirect === 'yes') {
        // console.log('Admin redirect');
        // res.clearCookie('adminLogin');
        ;
    }
    res.render('view', { 'userData': await db.getUserDataById(req.params.id), "url": url, 'isAdminRedirect': isAdminRedirect });
});

app.get('/edit/:id', async (req, res) => {
    res.render('edit', { 'userData' : await db.getUserDataById(req.params.id)});
});

app.post('/edit/:id', async (req, res) => {
    const { firstName, lastName, email, password, married, people, job, vichele, number } = req.body;
    let photo = id = '';
        let temp = married || '';
        let isMarried = true;
        if (temp === '')
            isMarried = false;
        if (req.files) {
            if (req.files.photo !== undefined) {
                photo = req.files.photo.name;
                req.files.photo.mv('./uploads/' + photo, function () { });
            }
            if (req.files.id !== undefined) {
                id = req.files.id.name;
                req.files.id.mv('./uploads/' + id, function () { });
            }
        }
        let userId = await db.update(req.params.id ,firstName, lastName, email, password, isMarried, people, job, photo, id, vichele, number);
    // console.log();
    res.redirect(`/view/${req.params.id}`);
    // res.send(req.body);
});

const port = process.env.PROT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

