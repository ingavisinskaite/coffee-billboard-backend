const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const coffeeData = require('./coffee-data')

let coffeeList = coffeeData;

app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:3000'
}))

let port = 3001;


app.get('/coffee', (req, res) => res.json({
    coffeeList
}))

app.post('/coffee', (req, res) => {
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

app.put('/coffee/:id', (req, res) => {
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

app.delete('/coffee/:id', (req, res) => {
    const id = Number(req.params.id);

    coffeeList = coffeeList.filter(coffee => coffee.id !== id);

    res.status(204).send({});
})


app.listen(port, () => {
    console.log('Started listening');
})