const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323532",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
  ]

app.get('/', (req, res) => {
res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
    })

app.get('/api/persons', (req, res) => {
res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
      response.json(person)
    } else {
      response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
      persons = persons.filter(person => person.id !== id)
      response.status(204).end()
    } else {
      response.status(404).end()
  }
    
})

const generateId = () => {
  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  return getRandomInt(99999)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const duplicate = persons.find(person => person.name === body.name)

  if (duplicate) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})