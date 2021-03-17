import React from 'react';
import { gql, useMutation } from "@apollo/client";
import Helmet from 'react-helmet';
import { Button } from '../components/button';
import { useForm } from 'react-hook-form';
import nuberLogo from '../images/logo.svg';
import { Link } from 'react-router-dom';
import { FormError } from '../components/form-error';
import { UserRole } from '../__generated__/globalTypes';

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
  const [createAccountMutation] = useMutation(CREATE_ACCOUNT_MUTATION);
  const onSubmit = () => {};
  console.log(watch())
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Create Account | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} className="w-52 mb-10" alt="nuber logo" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">Let's get started</h4>
        <form className="grid gap-3 mt5 w-full mb-5">
          <input
            ref={register({required: "Email is required"})}
            type="text"
            name="email"
            className="input"
            placeholder="Email"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
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
            {Object.keys(UserRole).map((role, index) => <option value={index}>{role}</option>)}
          </select>
          <Button
            canClick={formState.isValid}
            loading={false}
            actionText={"Create Account"}
          />
        </form>
        <div>
          Already have an account?{" "}
          <Link to="/login" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};