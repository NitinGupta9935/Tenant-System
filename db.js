const mongoose = require('mongoose');
let adminPassword = '123';

mongoose.connect('mongodb+srv://nitingupta9935:9115275119@cluster0.ci83y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to Database', err));

const loginSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    name: String,
    email: String,
    password: String,
    married: Boolean,
    people: Number,
    job: String,
    photo: String,
    id: String,
    vichele: String,
    number: Number
});

const UserData = mongoose.model('UserData', loginSchema);

class DB {
    async signUp(firstName, lastName, email, password, married, people, job, photo, id, vichele, number) {
        let name = firstName + ' ' + lastName;
        let userData = new UserData({
            firstName,
            lastName,
            name,
            email,
            password,
            married,
            people,
            job,
            photo,
            id, 
            vichele,
            number
        });

        await userData.save();
        userData = await UserData.find();
        for (let i = 0; i < userData.length; i++){
            if (userData[i].email === email)
                return userData[i]._id;
        }
    };

    async getName(_id) {
        const userData = await UserData.findById(_id);
        return userData.name;
    }

    async isEmailExist(email) {
        const userData = await UserData.find();
        for (let i = 0; i < userData.length; i++){
            if (userData[i].email === email)
                return true;
        }
        return false;
    }

    async isPasswordExist(email, password) {
        const userData = await UserData.find();
        for (let i = 0; i < userData.length; i++){
            if (userData[i].email === email && userData[i].password === password)
                return true;
        }
        return false;
    }

    async login(email, password) {
        const userData = await UserData.find();
        for (let i = 0; i < userData.length; i++){
            if (userData[i].email === email && userData[i].password === password)
                return userData[i]._id;
        }
    }

    async reserPassword(email, password) {
        const userData = await UserData.findOneAndUpdate({ email: email }, { password: password });
        // return false;
    }

    async isAdminPasswordCorrect(password) {
        // const userData = await UserData.findById("620d1755663565745a07c64d");
        // console.log(userData);
        // console.log(userData._id);
        // console.log(userData.admin);
        if (adminPassword === password) {
                return true;
        }
        return false;
    }

    async getUserData() {
        return await UserData.find();
    }

    async getUserDataById(_id) {
        return await UserData.findById(_id);
    }

    async update(_id ,firstName, lastName, email, password, isMarried, people, job, photo, id, vichele, number) {
        const userData = await UserData.findById(_id);
        userData.firstName = firstName;
        userData.lastName = lastName;
        userData.email = email;
        userData.password = password;
        userData.isMarried = isMarried;
        userData.people = people;
        userData.job = job;
        if (photo !== '')
            userData.photo = photo;
        if (id !== '')
            userData.id = id;
        userData.vichele = vichele;
        userData.number = number;

        await userData.save();
    }
}

module.exports = DB;