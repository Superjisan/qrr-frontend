import React from 'react';
import { withRouter } from 'react-router-dom';

import Container from '@material-ui/core/Container';

import { SignUpLink } from '../SignUp';
import SignInForm from './SignInForm';

const SignInPage = ({ history, refetch }) => (
  <>
    <Container maxWidth="sm">
      <SignInForm history={history} refetch={refetch} />
      <SignUpLink />
    </Container>
  </>
);

export default withRouter(SignInPage);
