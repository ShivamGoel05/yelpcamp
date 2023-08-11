const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Campground = require('./campground');
const cities = require('./seeds/cities');
const { descriptors, places } = require('./seeds/seedHelpers');
const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(methodOverride('_method'))
mongoose.connect('mongodb://localhost:27017/YelpCamp')
    .then(() => {
        console.log('Express App Successfully Connected with MongoDB');
    })
    .catch(() => {
        console.log("Couldn't Establish Connection between Express App and MongoDB");
    })

// Index
app.get('/campgrounds', async (req, res) => {
    res.locals.title = 'Campgrounds';
    const campgrounds = await Campground.find({});
    res.render('index', { campgrounds });
});

// New
app.get('/campgrounds/new', (req, res) => {
    res.locals.title = 'Adding New Campground';
    res.render('new', { cities, descriptors, places });
});
app.use(express.urlencoded({ extended: true }));
app.post('/campgrounds', async (req, res) => {
    const { first, last, location, price, description, imageSrc } = req.body;
    const campground = new Campground({ title: `${first} ${last}`, location, price, description, imageSrc });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

// Show
app.get('/campgrounds/:id', (req, res) => {
    const { id } = req.params;
    Campground.findById(id)
        .then((data) => {
            const campground = data;
            res.locals.title = campground.title;
            res.render('show', { campground });
        })
        .catch(() => {
            res.send('<h2>Invalid ID</h2>');
        })
});

// Edit
app.get('/campgrounds/:id/edit', (req, res) => {
    const { id } = req.params;
    Campground.findById(id)
        .then((data) => {
            const campground = data;
            res.locals.title = `Editting - ${campground.title}`;
            res.render('edit', { campground, cities, descriptors, places });
        })
        .catch(() => {
            res.send('<h2>Invalid ID</h2>');
        })
});
app.post('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const { first, last, location, price, description, imageSrc } = req.body;
    await Campground.updateOne({ _id: id }, { title: `${first} ${last}`, location, price, description, imageSrc });
    res.redirect(`/campgrounds/${id}`);
});

// Delete
app.get('/campgrounds/:id/delete', (req, res) => {
    res.locals.title = 'Delete';
    const { id } = req.params;
    res.render('delete', { id });
});
app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.deleteOne({ _id: id });
    res.redirect('/campgrounds');
});

app.use((req, res) => {
    res.status(404).send("<h1>Uh Oh! 'Error 404' - Page Not Found :(</h1>");
});

app.listen(3000, () => {
    console.log('Listening on Port 3000');
});