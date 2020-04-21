import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import { withStyles, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import withSession from '../../Session/withSession';
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

const useStyles = (theme) => ({
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
  const { session, classes } = props;
  const [name, setName] = useState('');

  const onChange = (event) => {
    const { name, value } = event.target;
    setName(value);
  };

  const onSubmit = async (event, addRecipe) => {
    event.preventDefault();

    try {
      await addRecipe();
      setName('');
    } catch (error) {
      console.error(error);
    }
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
            const { data, loading, error } = mutationProps;
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
    </Container>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withSession(RecipeCreate)
);
