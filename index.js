const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("server up");
});

app.use(express.json());
app.use(express.urlencoded());
app.use(bodyParser.json());

const mongoose = require('mongoose');
const { application } = require('express');

const db = mongoose.connection
const url = "mongodb://127.0.0.1:27017/apod"

db.once('open', _ => {
  console.log('Database connected')
})

db.once('error', err => {
  console.log('connection error', err)
})

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

const apodSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
}, {collection: 'images'});

const APOD = mongoose.model('APOD', apodSchema);

app.get('/', async function (req, res) {
    const apods = await APOD.find();
    res.json(apods);
});

app.get('/favorite', function (req, res) {
  // GET "/favorite" should return our favorite image by highest rating
    APOD.find().sort({'rating': 'desc'}).exec((error, images) => {
    if (error) {
      console.log(error);
      res.send(500);
    } else {
      res.json({favorite: images[0]});
    }
  });
});

app.post('/add', async function (req, res) {
    const apod = new APOD({
    title: req.body.title,
    url: req.body.url,
    rating: req.body.rating
  });
  savedAPOD = await apod.save();
  res.json(savedAPOD);
});

app.delete('/delete', async function (req, res) {
  const remove = await APOD.remove({title: req.body.title});
  res.json(remove);
  // DELETE "/delete" deletes an image according to the title
});

