const express = require('express')
const app = express()
const bodyParser = require('body-parser')

module.exports = app

app.use(bodyParser.json())


const envelopes = []
let nextId = 1;

app.get('/', (req, res, next) => {
    res.send(envelopes)
})

app.post('/envelopes', (req, res, next) => {
    const newData = req.body;
    
    if (newData.title && newData.budget) {
        newData.id = nextId;
        nextId++;
        
        envelopes.push(newData)
        res.send(newData)
    } else {
        res.status(400).send("Make sure you include title and budget in the request")
    }
})

app.get('/envelopes/:id', (req, res, next) => {
    const envelopId = Number(req.params.id)
    const envelopeById = envelopes.filter(envelope => {
        return envelope.id === envelopId
    })

    res.send(envelopeById)
})