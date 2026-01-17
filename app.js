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

    const budget = Number(newData.budget)
    
    if (newData.title && Number.isFinite(budget)&& budget > 0) {
        newData.id = nextId++;
        newData.budget = budget
        
        envelopes.push(newData)
        res.send(newData)
    } else {
        res.status(400).send("Make sure you include title and budget in the request")
    }
})

app.get('/envelopes/:id', (req, res, next) => {
    const envelopId = Number(req.params.id)
    const envelopeById = envelopes.find(envelope => {
        return envelope.id === envelopId
    })

    if (!envelopeById) {
        return res.status(404).send("Envelope not found")
    }

    res.send(envelopeById)
})

app.put("/envelopes/:id", (req, res, next) => {
    const envelopId = Number(req.params.id)
    const envelopeById = envelopes.find(e => {
        return e.id === envelopId
    })

    if (!envelopeById) {
        res.status(404).send("Envelope not found")
    }

    const expense = Number(req.body.expense);

    if (!Number.isFinite(expense) || expense <= 0) {
        res.status(400).send("Invalid expense amount")
    }

    if (expense > envelopeById.budget) {
        return res.status(400).send("Insufficient envelope budget")
    }

    envelopeById.budget -= expense
    res.send(envelopeById)
})

app.delete("/envelopes/:id", (req, res, next) => {
    const envelopId = Number(req.params.id)
    const index = envelopes.findIndex(e => {
        return e.id === envelopId
    })

    if (index === -1) {
        return res.status(404).send("Envelope not found")
    }

    envelopes.splice(index, 1)
    return res.status(204).send()
})

app.post("/envelopes/transfer/:from/:to", (req, res, next) => {
    const fromId = Number(req.params.from)
    const toId = Number(req.params.to)
    const amount = Number(req.headers["transfer-amount"])

    const fromEnvelope = envelopes.find(e => {
            return e.id === fromId
        })

    const toEnvelope = envelopes.find(e => {
        return e.id === toId
    })

    if (amount < fromEnvelope.budget) {

        const amountToAdd = fromEnvelope.budget - amount
        fromEnvelope.budget = amountToAdd

        let budget = toEnvelope.budget
        toEnvelope.budget = budget + amount

        res.send(toEnvelope)
    
    } else {
        return res.status(400).send(`Insufficient budget in id ${fromId}`)
    }

})