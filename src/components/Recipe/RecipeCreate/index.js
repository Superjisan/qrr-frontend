import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link, withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import { withStyles, Typography } from '@material-ui/core';

import Alert from "../../Alert";
import ErrorMessage from '../../Error';

import * as routes from '../../../constants/routes';

const ADD_RECIPE = gql`
  mutation($name: String!) {
    addRecipe(name: $name) {
      id
      name
      author {
        username
      }
    }
  }
`;

const useStyles = () => ({
  textField: {
    marginTop: 10,
    marginBottom: 10,
    width: `100%`
  },
  backButton: {
    marginBottom: 10
  },
  saveButton: {
    width: '100%'
  }
});

const RecipeCreate = (props) => {
  const { session, classes, history } = props;

  const [name, setName] = useState('');
  const [isSuccessOpen, setSuccessOpen] = useState(false);
  const [isErrorOpen, setErrorOpen] = useState(false);

  const onChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  const onSubmit = async (event, addRecipe) => {
    event.preventDefault();

    try {
      const recipe = await addRecipe();
      if(recipe) {

        setName('');
        setSuccessOpen(true)
        history.push(`update-recipe/${recipe.data.addRecipe.id}`)
      }
    } catch (error) {
      console.error(error);
      setErrorOpen(true)
    }
  };

  const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessOpen(false);
  };

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorOpen(false);
  };

  const isInvalid = name === '';

  return (
    <Container maxWidth="sm">
      <Link to={routes.LANDING}>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.backButton}
        >
          Back To Recipes
        </Button>
      </Link>
      <Typography variant="h4" align="center">
        Add A Recipe
      </Typography>
      {session && session.me ? (
        <Mutation mutation={ADD_RECIPE} variables={{ name }}>
          {(addRecipe, mutationProps) => {
            const { loading, error } = mutationProps;
            return (
              <form onSubmit={(event) => onSubmit(event, addRecipe)}>
                <TextField
                  required
                  id="name-filled-required"
                  label="Recipe Name"
                  variant="outlined"
                  value={name}
                  onChange={onChange}
                  placeholder="Recipe Name"
                  name="name"
                  className={classes.textField}
                />
                <Button
                  disabled={isInvalid || loading}
                  type="submit"
                  className={classes.saveButton}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
                {error && <ErrorMessage error={error} />}
              </form>
            );
          }}
        </Mutation>
      ) : (
        `Not Allowed To Add Recipe, You Must Sign In`
      )}
      <Snackbar
        open={isSuccessOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert onClose={handleSuccessClose} severity="success">
          Recipe Saved
        </Alert>
      </Snackbar>
      <Snackbar
        open={isErrorOpen}
        autoHideDuration={6000}
        onClose={handleErrorClose}
      >
        <Alert onClose={handleErrorClose} severity="error">
          Something Went Wrong
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withRouter(RecipeCreate)
);
