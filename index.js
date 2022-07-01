import { ApolloServer, UserInputError, gql } from 'apollo-server'
import { v1 as uuid } from 'uuid'
import axios from 'axios'

const persons = [
  {
    name: 'Midu',
    phone: '098-0980981',
    street: 'Calle Frontend',
    city: 'Barcelona',
    id: '123s34-23v234-23j456'
  },
  {
    name: 'Youseff',
    phone: '298-0980983',
    street: 'Avenida Fullstack',
    city: 'Mataro',
    id: '1238s4-234y34-2344h6'
  },
  {
    name: 'Itzi',
    street: 'Pasaje Testing',
    city: 'Ibiza',
    id: '12r234-23q234-2344g6'
  },
]

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
      phone: String!
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
    personCount : () => persons.length,
    allPersons: async (root, args) => {
      const {data: personsFromRestApi} = await axios.get('http://localhost:3000/persons')
      if (!args.phone) return personsFromRestApi

      const byPhone = person => args.phone === 'YES'
        ? person.phone : !person.phone
      
        return personsFromRestApi.filter(byPhone)
    },
    findPerson: (root, args) => {
      const {name} = args
      return persons.find(person => person.name === name)
    }
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find(p => p.name === args.name)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name
        })
      }
      const person = {...args, id: uuid()}
      persons.push(person)
      return person
    },
    editNumber: (root, args) => {
      const personIndex = persons.findIndex(p => p.name === args.name)
      if (personIndex === -1) return null

      const person = persons[personIndex]

      const updatedPerson = {...person, phone: args.phone}
      persons[personIndex] = updatedPerson

      return updatedPerson
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