const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const coffeeData = require('./coffee-data')

let coffeeList = coffeeData;

app.use(bodyParser.json())

const allowedOrigins = ['http://localhost:3000', 'https://ingavisinskaite.github.io'];
const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }

let port = 3001;

app.options('*', cors(corsOptions))
app.get('/', (req, res) => {
    res.json({welcome: "Welcome to Coffee Billboard backend!"})
})

app.get('/coffee', cors(corsOptions), (req, res) => res.json({
    coffeeList
}))

app.post('/coffee', cors(corsOptions), (req, res) => {
    const imgUrl = req.body.imgUrl;
    const title = req.body.title;
    const price = req.body.price;
    const id = coffeeList[coffeeList.length - 1].id + 1;

    let newCoffee = {
        id,
        imgUrl,
        title,
        price,
    }

    coffeeList.push(newCoffee);

    res.json({
        newCoffee
    })
})

app.put('/coffee/:id', cors(corsOptions), (req, res) => {
    const id = Number(req.params.id);
    const imgUrl = req.body.imgUrl;
    const title = req.body.title;
    const price = req.body.price;

    let editedCoffee = {
        id,
        imgUrl,
        title,
        price
    }

    let indexInArray = coffeeList.findIndex(coffee => coffee.id === id);
    coffeeList[indexInArray] = editedCoffee;

    res.json({
        editedCoffee
    })
})

app.delete('/coffee/:id', cors(corsOptions), (req, res) => {
    const id = Number(req.params.id);

    coffeeList = coffeeList.filter(coffee => coffee.id !== id);

    res.status(204).send({});
})


app.listen(process.env.PORT || port, () => {
    console.log('Started listening');
})