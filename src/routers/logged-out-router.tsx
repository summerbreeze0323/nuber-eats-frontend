import React from 'react';
import { isLoggedInVal } from '../apollo';

export const LoggedOutRouter = () => {
  const onClick = () => {
    isLoggedInVal(true);
  }

  return (
    <div>
      <h1>Logged Out</h1>
      <button onClick={onClick}>click to login</button>
    </div>
  )
};