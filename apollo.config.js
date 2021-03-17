module.exports = {
  client: {
    includes: ["./src/**/*.tsx"], // src에 있는 모든폴더(/**)의 모든tsx파일(/*.tsx)
    tagName: "gql",
    service: {
      name: "nuber-eats-backend",
      url: "http://localhost:4000/graphql",
    },
  },
};