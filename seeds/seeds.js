const mongoose = require('mongoose');
const Campground = require('../campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/YelpCamp')
    .then(() => {
        console.log('Successfully Connected with MongoDB');
    })
    .catch(() => {
        console.log("Couldn't Establish Connection with MongoDB");
    })
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const randDescriptor = Math.floor(Math.random() * descriptors.length);
        const randPlace = Math.floor(Math.random() * places.length);
        const randPrice = Math.floor(Math.random() * 21) + 15;
        const camp = new Campground({
            title: `${descriptors[randDescriptor]} ${places[randPlace]}`,
            // https://source.unsplash.com/collection/483251
            imageSrc: 'https://images.unsplash.com/photo-1520095972714-909e91b038e5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTN8fGNhbXBncm91bmRzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60',
            price: randPrice,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque vel soluta dicta ex eum mollitia corrupti ratione non, harum vitae at debitis provident totam tenetur sapiente accusantium maxime sint temporibus.',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`
        });
        await camp.save();
    }
};
seedDB()
    .then(() => {
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log(err);
    })
