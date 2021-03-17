import React from 'react';
import { useForm } from 'react-hook-form';
import { ApolloError, gql, useMutation } from "@apollo/client";
import { FormError } from '../components/form-error';
import { login, loginVariables } from '../__generated__/login';

const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();
  const onCompleted = (data: login) => {
    const { login: { ok, token } } = data;
    if (ok) {
      console.log(token)
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    login, loginVariables
    >(LOGIN_MUTATION, {
    onCompleted,
    });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: { email, password }
        }
      });
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-5 pb-7 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800">Log In</h3>
        <form
          className="grid gap-3 mt-5 px-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            ref={register({ required: "Email is required" })}
            name="email"
            type="email"
            className="input"
            placeholder="Email"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message}/>
          )}
          <input
            ref={register({ required: "Password is required" })}
            name="password"
            type="password"
            className="input"
            placeholder="Password"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message}/>
          )}
          {errors.password?.type === 'minLength' && (
            <FormError errorMessage={"Password must be more than 10 chars."}/>
          )}
          <button className="btn">{loading ? "Loading" : 'Log In'}</button>
          {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
        </form>
      </div>
    </div>
  )
};