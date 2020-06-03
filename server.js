const express = require('express');
const app = express();
const mongoose = require('mongoose');
const shortURL = require('./models/shorturls');

mongoose.connect('mongodb://localhost/urlshortner', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    const shorturls = await shortURL.find();
    res.render('index.ejs', { shorturls: shorturls });
});

app.post('/shorturls', async (req, res) => {
    await shortURL.create({
        full: req.body.fullurl
    });
    res.redirect('/');
});

app.get('/:shorturl', async (req, res) => {
    const shorturl = await shortURL.findOne({ short: req.params.shorturl });
    if (shorturl == null) return res.sendStatus(404);

    shorturl.clicks++;
    shorturl.save();

    res.redirect(shorturl.full);
});

app.listen(process.env.PORT||5000);