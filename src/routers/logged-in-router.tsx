import React from 'react';
import { isLoggedInVal } from '../apollo';

export const LoggedInRouter = () => <div>
  <h1>Logged In</h1>
  <button onClick={() => isLoggedInVal(false)}>Log Out</button>
</div>;