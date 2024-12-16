import mongoose from 'mongoose'
import 'dotenv/config'



const url = process.env.MONGODB_URI



mongoose.set('strictQuery',false)

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })
  

const numberValidator = (val) => {
  return /^\d{2,3}-\d{6,}$/.test(val)
}
  


const personSchema = new mongoose.Schema({
  id: String,
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    validate: {
      validator: numberValidator,
      message: props => `${props.value} is not a valid phone number!`
    },
    required: [true, 'User phone number required']
  }
  }
)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


export default mongoose.model('Person', personSchema);