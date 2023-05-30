const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortulrs');
const app = express(); 

mongoose.set('strictQuery', true);

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set("view engine", "ejs");
//built in middleware for handling form data
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const shortulrs = await ShortUrl.find();
    res.render('index', {shortUrls: shortulrs});


})

app.post('/shortenedurl', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)
  
    shortUrl.clicks++
    shortUrl.save()
  
    res.redirect(shortUrl.full)
  })
app.listen(process.env.PORT || 3000);
