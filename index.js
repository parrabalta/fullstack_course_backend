import express from 'express'
const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.use(express.json())

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (req, res) => {
    const phoneNumbers = persons.length;
    const time = new Date();
    res.send(`<p>Phonebook has info for ${phoneNumbers} people</p><p>${time}</p>`)
})


app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
    const newPerson = req.body;
    const id = Math.floor(Math.random() * 10000);
    newPerson.id = id;

    if(!persons.find(person => person.name === newPerson.name)) {
        persons = persons.concat(newPerson)

        res.json(persons)   
    } else {
        res.status(409).json({ 
            error: 'name must be unique'
          })
    } 
})


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})