import { ApolloServer, gql } from 'apollo-server'
import './db.js'
import Person from './models/person.js'

const typeDefinitions = gql`
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone:String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson (
      name: String!
      phone: String
      street: String!
      city: String!
    ) : Person
    editNumber (
      name: String!
      phone: String!
    ): Person
  }
`

const resolvers = {
  Query: {
    personCount : () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) return Person.find({})
      return Person.find({phone: {$exists: args.phone === 'YES'}})
    },
    findPerson: async (root, args) => {
      const {name} = args
      return Person.findOne({name})
    }
  },
  Mutation: {
    addPerson: (root, args) => {
      const person = new Person({...args})
      return person.save()
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({name: args.name})
      person.phone = args.phone
      return person.save()
    }
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers
})

server.listen().then(({url}) => {
  console.log(`Serverready at ${url}`)
})