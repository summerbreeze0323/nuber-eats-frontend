import { ApolloClient, InMemoryCache, makeVar } from '@apollo/client';
import { LOCALSTORAGE_TOKEN } from './constants';

const token = localStorage.getItem(LOCALSTORAGE_TOKEN)
export const isLoggedInVal = makeVar(Boolean(token));
export const authToken = makeVar(token);

console.log("default value of isLoggedInVal is ", isLoggedInVal());
console.log("default value of authToken is ", authToken());

export const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVal();
            }
          },
          token: {
            read() {
              return authToken();
            }
          }
        }
      }
    }
  })
});