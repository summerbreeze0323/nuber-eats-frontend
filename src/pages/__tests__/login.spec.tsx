import React from "react";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { Login, LOGIN_MUTATION } from "../login";
import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe('<Login/>', () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;

  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockedClient}>
              <Login />
            </ApolloProvider>
          </Router>
        </HelmetProvider>
      );
    })
  });

  it('should render OK', async () => {
    await waitFor(() => {
      expect(document.title).toBe('Login | Nuber Eats');
    });
  });

  it('displays email validation errors', async () => {
    await waitFor(async () => {
      const { getByPlaceholderText, getByRole } = renderResult;
      const email = getByPlaceholderText(/email/i); // /email/i: 대소문자 구분 안함
      await waitFor(() => {
        userEvent.type(email, 'this@wont');
      });
      
      let errorMessage = getByRole('alert');
      expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
      await waitFor(() => {
        userEvent.clear(email);
      })
      errorMessage = getByRole('alert');
      expect(errorMessage).toHaveTextContent(/email is required/i);
    });

    it('display password required errors', async () => {
      const { getByPlaceholderText, debug, getByRole } = renderResult;
      const email = getByPlaceholderText(/email/i);
      const submitBtn = getByRole('button');
      await waitFor(() => {
        userEvent.type(email, 'this@wont.com');
        userEvent.click(submitBtn);
      });

      const errorMessage = getByRole('alert');
      expect(errorMessage).toHaveTextContent(/password is required/i);
    });
    
    it('submits form and calls mutation', async () => {
      const { getByPlaceholderText, debug, getByRole } = renderResult;
      const email = getByPlaceholderText(/email/i);
      const password = getByPlaceholderText(/password/i);
      const submitBtn = getByRole('button');
      const formData = {
        email: 'real@test.com',
        password: '123'
      };

      const mockedMutationResponse = jest.fn().mockResolvedValue({
        data: {
          login: {
            ok: true,
            token: 'xxx',
            error: null,
          }
        }
      });
      mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

      await waitFor(() => {
        userEvent.type(email, formData.email);
        userEvent.type(password, formData.password);
        userEvent.click(submitBtn);
      });

      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
      expect(mockedMutationResponse).toHaveBeenCalledWith({
        loginInput: {
          email: formData.email,
          password: formData.password,
        }
      });
    });
  });
});