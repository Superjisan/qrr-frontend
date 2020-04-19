import { get } from 'lodash';
import gql from 'graphql-tag';
import React, { Component, useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Link, useParams } from 'react-router-dom';

import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import * as routes from '../../../constants/routes';
import withSession from '../../Session/withSession';

const UPDATE_RECIPE = gql`
  mutation(
    $id: ID!
    $name: String!
    $rating: Int
    $originUrl: String
    $originText: String
    $cookingTime: String
  ) {
    updateRecipe(
      id: $id
      name: $name
      rating: $rating
      originUrl: $originUrl
      originText: $originText
      cookingTime: $cookingTime
    ) {
      id
      name
      rating
      originUrl
      originText
      cookingTime
      ingredients {
        id
      }
      instructions {
        id
      }
    }
  }
`;

const GET_RECIPE = gql`
  query($id: ID!) {
    recipe(id: $id) {
      id
      name
      rating
      originUrl
      originText
      cookingTime
      ingredients {
        id
      }
      instructions {
        id
      }
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

const RecipeUpdateForm = (props) => {
  const { data, loading, error } = props;
  const [id, setId] = useState(get(data, 'recipe.id'));
  const [name, setName] = useState(get(data, 'recipe.name'));
  const [rating, setRating] = useState(get(data, 'recipe.rating'));
  const [originUrl, setOriginUrl] = useState(
    get(data, 'recipe.originUrl'),
  );
  const [originText, setOriginText] = useState(
    get(data, 'recipe.originText'),
  );
  const [cookingTime, setCookingTime] = useState(
    get(data, 'recipe.cookingTime'),
  );

  const onIdChange = (event) => setId(event.target.value);
  const onNameChange = (event) => setName(event.target.value);
  const onRatingChange = (event) => setRating(event.target.value);
  const onOriginUrlChange = (event) =>
    setOriginUrl(event.target.value);
  const onOriginTextChange = (event) =>
    setOriginUrl(event.target.value);
  const onCookingTimeChange = (event) =>
    setCookingTime(event.target.value);

  const onSubmit = async (event, updateRecipe) => {
    event.preventDefault();
    try {
      const recipe = await updateRecipe();
      if (recipe) {
        console.log('update worked');
        return recipe
      }
    } catch (error) {
      console.error(error);
    }
    
  };

  const isInvalid = name === '';

  return (
    <Mutation
      mutation={UPDATE_RECIPE}
      variables={{
        id,
        name,
        rating,
        originUrl,
        originText,
        cookingTime,
      }}
    >
      {(updateRecipe, mutationProps) => {
        return (
          <>
            <CssBaseline />
            <Container maxWidth="sm">
              <form
                onSubmit={(event) => onSubmit(event, updateRecipe)}
              >
                <TextField
                  required
                  id="login-filled-required"
                  label="Recipe Name"
                  variant="outlined"
                  value={name}
                  onChange={onNameChange}
                  placeholder="Recipe Name"
                  name="name"
                />
                <Button disabled={isInvalid || loading} type="submit">
                  Save
                </Button>
              </form>
            </Container>
          </>
        );
      }}
    </Mutation>
  );
};

const RecipeUpdate = (props) => {
  let { id } = useParams();
  return (
    <>
      <Link to={routes.LANDING}>Back To Recipes</Link>
      <Query query={GET_RECIPE} variables={{ id }}>
        {(queryProps) => {
          return get(queryProps, 'data.recipe') &&
            !get(queryProps, 'loading') ? (
            <RecipeUpdateForm {...queryProps} />
          ) : (
            <div>Loading...</div>
          );
        }}
      </Query>
    </>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withSession(RecipeUpdate),
);
