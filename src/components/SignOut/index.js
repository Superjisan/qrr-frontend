import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import Button from '@material-ui/core/Button';

import * as routes from '../../constants/routes';
import history from '../../constants/history';

const SignOutButton = () => (
  <ApolloConsumer>
    {(client) => (
      <Button color="inherit" type="button" onClick={() => signOut(client)}>
        Sign Out
      </Button>
    )}
  </ApolloConsumer>
);

const signOut = (client) => {
  localStorage.removeItem('token');
  client.resetStore();
  history.push(routes.SIGN_IN);
};

export { signOut };

export default SignOutButton;
