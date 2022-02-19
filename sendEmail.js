const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'fakenitin9935@gmail.com',
        pass: '9115275119'
    }
});

function randomNumber() {
    let num = 0;
    while (num < 1000 || num > 9999) {
        num = Math.floor((Math.random() * 10000) + 1000);
    }
    return num;
}

// Less secure app access myaccount.google.com/lesssecureapps
module.exports = function (userEmail) {
    let num = randomNumber().toString();
    // console.log(num);
    let mailOptions = {
        from: 'fakenitin9935@gmail.com',
        to: userEmail,
        subject: 'One time password',
        text: num
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error)
            console.log(error);
        // else
        // console.log('mail Sended: ' + info.response);
    });

    return num;
};
