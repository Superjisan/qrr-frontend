import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { withStyles } from '@material-ui/core/styles';
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
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
});

const INITIAL_STATE = {
  login: '',
  password: '',
};

class SignInForm extends Component {
  state = { ...INITIAL_STATE };

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = (event, signIn) => {
    signIn().then(async ({ data }) => {
      this.setState({ ...INITIAL_STATE });

      localStorage.setItem('token', data.signIn.token);

      await this.props.refetch();

      this.props.history.push(routes.LANDING);
    }).catch(err => {
      throw new Error(err)
    });

    event.preventDefault();
  };

  render() {
    const { login, password } = this.state;
    const { classes } = this.props;

    const isInvalid = password === '' || login === '';

    return (
      <Mutation mutation={SIGN_IN} variables={{ login, password }}>
        {(signIn, { data, loading, error }) => (
          <form
            className={classes.root}
            onSubmit={(event) => this.onSubmit(event, signIn)}
          >
            <div>
              <TextField
                required
                id="login-filled-required"
                label="Email Or Username"
                variant="outlined"
                value={login}
                onChange={this.onChange}
                placeholder="Email or Username"
                name="login"
              />
              <TextField
                variant="outlined"
                required
                id="pw-filled-required"
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
              />
            </div>
            <Button disabled={isInvalid || loading} type="submit">
              Sign In
            </Button>

            {error && <ErrorMessage error={error} />}
          </form>
        )}
      </Mutation>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(SignInForm);
