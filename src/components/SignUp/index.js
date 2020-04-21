import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyles, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';

import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';

const SIGN_UP = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signUp(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

const useStyles = (theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%'
    }
  },
  textField: {
    marginTop: 10,
    marginBottom: 10,
    width: `100%`
  }
});

const SignUpPage = ({ history, refetch, classes }) => (
  <Container maxWidth="sm">
    <Typography
      align="center"
      variant="h3"
      classes={classes.textField}
    >
      Sign Up
    </Typography>
    <SignUpForm
      history={history}
      refetch={refetch}
      classes={classes}
    />
  </Container>
);

const SignUpForm = (props) => {
  const { classes } = props;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState(
    ''
  );

  const onUsernameChange = (event) => {
    const { value } = event.target;
    setUsername(value);
  };

  const onEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const onPasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
  };

  const onPasswordConfirmationChange = (event) => {
    const { value } = event.target;
    setPasswordConfirmation(value);
  };

  const onSubmit = (event, signUp) => {
    signUp().then(async ({ data }) => {
      localStorage.setItem('token', data.signUp.token);

      await props.refetch();

      props.history.push(routes.LANDING);
    });

    event.preventDefault();
  };

  const isInvalid =
    password !== passwordConfirmation ||
    password === '' ||
    email === '' ||
    username === '';

  return (
    <Mutation
      mutation={SIGN_UP}
      variables={{ username, email, password }}
    >
      {(signUp, { data, loading, error }) => (
        <form onSubmit={(event) => onSubmit(event, signUp)}>
          <TextField
            className={classes.textField}
            required
            variant="outlined"
            className={classes.textField}
            name="username"
            value={username}
            onChange={onUsernameChange}
            type="text"
            placeholder="username"
          />
          <TextField
            className={classes.textField}
            required
            variant="outlined"
            className={classes.textField}
            name="email"
            value={email}
            onChange={onEmailChange}
            type="text"
            placeholder="Email Address"
          />
          <TextField
            className={classes.textField}
            required
            variant="outlined"
            className={classes.textField}
            name="password"
            value={password}
            onChange={onPasswordChange}
            type="password"
            placeholder="Password"
          />
          <TextField
            className={classes.textField}
            required
            variant="outlined"
            className={classes.textField}
            name="passwordConfirmation"
            value={passwordConfirmation}
            onChange={onPasswordConfirmationChange}
            type="password"
            placeholder="Confirm Password"
          />
          <Button
            variant="contained"
            disabled={isInvalid || loading}
            type="submit"
          >
            Sign Up
          </Button>

          {error && <ErrorMessage error={error} />}
        </form>
      )}
    </Mutation>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>
);

export default withStyles(useStyles, { withTheme: true })(
  withRouter(SignUpPage)
);

export { SignUpForm, SignUpLink };
