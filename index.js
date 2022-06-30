import { ApolloServer, gql } from 'apollo-server'

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
    allPersons: [Person]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount : () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => {
      const {name} = args
      return persons.find(person => person.name === name)
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