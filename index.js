import 'dotenv/config' 
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import Person from './models/person.js'

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.date(req,res),
    tokens.res(req, res, 'Content-Length'), '-',
    tokens['response-time'](req, res), 'ms', JSON.stringify(req.body)
  ].join(' ')
}))



app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (req, res) => {
  const time = new Date();
  Person.find({}).then(persons => {
    const phoneNumbers = persons.length;
    res.send(`<p>Phonebook has info for ${phoneNumbers} people</p><p>${time}</p>`)
  })

    
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
      if (person) {
          response.json(person.toJSON())
        } else {
          response.status(404).end()
        }
  })
  .catch(error => next(error))
})



app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (body.name === undefined) {
  return res.status(400).json({ error: 'content missing' })
  }

  const newPerson = new Person({
    name: body.name, 
    number: body.number
})


newPerson.save().then(savedPerson => {
  console.log(savedPerson.toJSON(), ' was succesfully saved')
  res.json(savedPerson)
})
.catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(deletedPerson => {
    const deletedName = deletedPerson.name
    response.status(200).send(`${deletedName} was deleted`).end()
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const newPerson = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(404).send({ error: 'The number does not exist' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)




const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})