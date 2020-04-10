import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

import { SignUpLink } from '../SignUp';
import SignInForm from './SignInForm';
import * as routes from '../../constants/routes';
import ErrorMessage from '../Error';

const SIGN_IN = gql`
  mutation($login: String!, $password: String!) {
    signIn(login: $login, password: $password) {
      token
    }
  }
`;

const SignInPage = ({ history, refetch }) => (
  <>
    <CssBaseline />
    <Container maxWidth="sm">
      <h1>SignIn</h1>
      <SignInForm history={history} refetch={refetch} />
      <SignUpLink />
    </Container>
  </>
);

export default withRouter(SignInPage);
