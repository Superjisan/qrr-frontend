import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { withStyles, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';

const SIGN_IN = gql`
  mutation($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      token
    }
  }
`;

const useStyles = (theme) => ({
  textField: {
    marginBottom: 10,
    width: `100%`
  },
  saveButton: {
    width: '100%'
  }
});

const SignInForm = (props) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const onLoginChange = (event) => {
    const { value } = event.target;
    setLogin(value);
  };

  const onPasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
  };

  const onSubmit = (event, signIn) => {
    localStorage.removeItem('token');
    signIn()
      .then(async ({ data }) => {
        localStorage.setItem('token', data.signIn.token);

        await props.refetch();

        props.history.push(routes.LANDING);
      })
      .catch((err) => {
        throw new Error(err);
      });

    event.preventDefault();
  };

  const { classes } = props;

  const isInvalid = password === '' || login === '';

  return (
    <>
      <Typography className={classes.textField} variant="h3" align="center">
        Sign In
      </Typography>
      <Mutation mutation={SIGN_IN} variables={{ login, password }}>
        {(signIn, { data, loading, error }) => (
          <form
            className={classes.root}
            onSubmit={(event) => onSubmit(event, signIn)}
          >
            <div>
              <TextField
                className={classes.textField}
                required
                id="login-filled-required"
                label="Email Or Username"
                variant="outlined"
                value={login}
                onChange={onLoginChange}
                placeholder="Email or Username"
                name="login"
              />
              <TextField
                className={classes.textField}
                variant="outlined"
                required
                id="pw-filled-required"
                name="password"
                value={password}
                onChange={onPasswordChange}
                type="password"
                placeholder="Password"
              />
            </div>
            <Button
              className={classes.saveButton}
              disabled={isInvalid || loading}
              type="submit"
              variant="contained"
              color="primary"
            >
              Sign In
            </Button>

            {error && <ErrorMessage error={error} />}
          </form>
        )}
      </Mutation>
    </>
  );
};

export default withStyles(useStyles, { withTheme: true })(SignInForm);
