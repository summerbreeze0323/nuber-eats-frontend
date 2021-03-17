import React from 'react';
import { gql, useMutation } from "@apollo/client";
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/button';
import { useForm } from 'react-hook-form';
import nuberLogo from '../images/logo.svg';
import { Link, useHistory } from 'react-router-dom';
import { FormError } from '../components/form-error';
import { UserRole } from '../__generated__/globalTypes';
import { createAccountMutation, createAccountMutationVariables } from '../__generated__/createAccountMutation';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {
  const {
    register,
    getValues,
    watch,
    errors,
    handleSubmit,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client
    }
  });
  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const { createAccount: { ok } } = data;
    if (ok) history.push('/');
  }
  const [
    createAccountMutation, { loading, data: createAccountMutationResult }
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );
  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: { email, password, role }
        }
      })
    }
  };
  
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" alt="nuber logo" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">Let's get started</h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 w-full mb-5"
        >
          <input
            ref={register({
              required: "Email is required",
              pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type="text"
            name="email"
            className="input"
            placeholder="Email"
          />
          {errors.email?.type === 'pattern' && (
            <FormError errorMessage={"Place enter a valid email"} />
          )}
          <input
            ref={register({required: "Password is required"})}
            type="password"
            name="password"
            className="input"
            placeholder="Password"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <select ref={register({required: true})} name="role" className="input">
            {Object.keys(UserRole).map((role, index) => <option key={index}>{role}</option>)}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"Create Account"}
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          Already have an account?{" "}
          <Link to="/" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};