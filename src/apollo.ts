import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { LOCALSTORAGE_TOKEN } from "./constants";

const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
export const isLoggedInVal = makeVar(Boolean(token));
export const authTokenVal = makeVar(token);

const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      "x-jwt": authTokenVal() || "",
    },
  },
});

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "x-jwt": authTokenVal() || "",
    },
  };
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    // TRUE return => wsLink
    // FALSE return => authLink(httpLink)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVal();
            },
          },
          token: {
            read() {
              return authTokenVal();
            },
          },
        },
      },
    },
  }),
});
