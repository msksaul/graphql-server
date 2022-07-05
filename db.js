import mongoose from 'mongoose'

const MONGODB_URI = `mongodb+srv://admin:NUKYwGUvzlts5ixC@cluster0.6wq83.mongodb.net/graphql?retryWrites=true&w=majority`

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('conected to MongoDB')
})
.catch(error => {
  console.error('error conection to MongoDB', error.message)
})