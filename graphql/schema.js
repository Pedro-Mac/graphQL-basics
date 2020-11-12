const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type TestData {
    test: String!
    views: Int!
  }

  type RootQuery {
    hello: TestData!
  }
  
  schema {
    query: RootQuery
  }
`);