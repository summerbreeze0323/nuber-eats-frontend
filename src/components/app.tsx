import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { isLoggedInVal } from '../apollo';
import { LoggedInRouter } from '../routers/logged-in-router';
import { LoggedOutRouter } from '../routers/logged-out-router';

export const App = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVal);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}
