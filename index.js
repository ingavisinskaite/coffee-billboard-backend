const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(bodyParser.json())

var port = 3001;

var coffeeList = [{
        imgUrl: "./latte.jpg",
        title: "Latte",
        price: "2.00€"
    },
    {
        imgUrl: "./cappuccino.jpg",
        title: "Cappuccino",
        price: "2.20€"
    },
    {
        imgUrl: "./mocha.jpg",
        title: "Mocha",
        price: "2.50€"
    },
    {
        imgUrl: "./cold-brew.jpg",
        title: "Cold brew",
        price: "3.00€"
    }
];

app.get('/coffee', (req, res) => res.json({
    coffeeList: coffeeList
}))

app.post('/coffee', (req, res) => {
    const name = req.body.name;

    res.json({
        receivedName: name
    })
})

app.delete('/coffee/:id', (req, res) => {
    const id = Number(req.params.id);

    res.json({
        receivedId: id
    })
})


app.listen(port, () => {
    console.log('Hi')
})