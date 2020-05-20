import { get } from 'lodash';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Link, useParams, withRouter } from 'react-router-dom';

import { withStyles, Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

import * as routes from '../../../constants/routes';
import withSession from '../../Session/withSession';
import ErrorMessage from '../../Error';
import Alert from '../../Alert';

const UPDATE_RECIPE = gql`
  mutation(
    $id: ID!
    $name: String!
    $rating: Int
    $originUrl: String
    $originText: String
    $cookingTime: String
    $imageUrl: String
  ) {
    updateRecipe(
      id: $id
      name: $name
      rating: $rating
      originUrl: $originUrl
      originText: $originText
      cookingTime: $cookingTime
      imageUrl: $imageUrl
    ) {
      id
      name
      rating
      originUrl
      originText
      cookingTime
      imageUrl
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
      imageUrl
      ingredients {
        id
      }
      instructions {
        id
      }
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation($id: ID!) {
    deleteRecipe(id: $id)
  }
`;
const useStyles = (theme) => {
  return {
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%'
      }
    },
    button: {
      width: `100%`
    },
    editButton: {
      width: `49%`,
      marginBottom: 10,
      marginTop: 10
    },
    backButton: {
      marginBottom: 20,
      marginTop: 10
    },
    textField: {
      marginBottom: 10,
      width: `100%`
    },
    h4: {
      marginBottom: 10
    },
    deleteButton: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      width: '100%'
    },
    imgPreview: {},
    box: {}
  };
};

const RecipeUpdateForm = (props) => {
  const { data, loading, error, classes, refetch } = props;

  const [isSuccessOpen, setSuccessOpen] = useState(false);
  const [isErrorOpen, setErrorOpen] = useState(false);

  const [id, setId] = useState(get(data, 'recipe.id'));
  const [name, setName] = useState(get(data, 'recipe.name'));
  const [rating, setRating] = useState(get(data, 'recipe.rating'));
  const [originUrl, setOriginUrl] = useState(
    get(data, 'recipe.originUrl')
  );
  const [originText, setOriginText] = useState(
    get(data, 'recipe.originText')
  );
  const [cookingTime, setCookingTime] = useState(
    get(data, 'recipe.cookingTime')
  );
  const [imageUrl, setImageUrl] = useState(
    get(data, 'recipe.imageUrl')
  );

  const onNameChange = (event) => setName(event.target.value);
  const onRatingChange = (event, newRating) => setRating(newRating);
  const onOriginUrlChange = (event) =>
    setOriginUrl(event.target.value);
  const onOriginTextChange = (event) =>
    setOriginText(event.target.value);
  const onCookingTimeChange = (event) =>
    setCookingTime(event.target.value);
  const onImageUrlChange = (event) => setImageUrl(event.target.value);

  const onSubmit = async (event, updateRecipe, refetch) => {
    event.preventDefault();
    try {
      const recipe = await updateRecipe();
      if (recipe) {
        setSuccessOpen(true);
        refetch();
        return recipe;
      }
    } catch (error) {
      setErrorOpen(true);
      console.error(error);
    }
  };

  const onDelete = async (event, deleteRecipe) => {
    event.preventDefault();
    try {
      const deleted = await deleteRecipe();
      if (deleted) {
        props.history.push(routes.LANDING);
      }
    } catch (error) {
      console.error(error);
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
      <Mutation
        mutation={UPDATE_RECIPE}
        variables={{
          id,
          name,
          rating,
          originUrl,
          originText,
          cookingTime,
          imageUrl
        }}
      >
        {(updateRecipe) => {
          return (
            <>
              <Link to={routes.LANDING}>
                <Button
                  className={classes.backButton}
                  variant="outlined"
                  color="secondary"
                >
                  Back To Recipes
                </Button>
              </Link>
              <Typography
                align="center"
                variant="h4"
                className={classes.h4}
              >
                Recipe Update
              </Typography>
              <form
                onSubmit={(event) => onSubmit(event, updateRecipe,refetch )}
              >
                <TextField
                  required
                  id="name-filled-required"
                  label="Recipe Name"
                  variant="outlined"
                  value={name}
                  onChange={onNameChange}
                  placeholder="Recipe Name"
                  name="name"
                  className={classes.textField}
                />
                <Box
                  mb={3}
                  borderColor="transparent"
                >
                  <Typography component="legend">Rating</Typography>
                  <Rating value={rating} onChange={onRatingChange} />
                </Box>

                {/* TODO: figure out nulling */}
                <TextField
                  id="cooking-time-filled"
                  label="Recipe Cooking Time"
                  variant="outlined"
                  value={cookingTime}
                  onChange={onCookingTimeChange}
                  placeholder="Recipe Cooking Time"
                  name="cookingTime"
                  className={classes.textField}
                />
                <TextField
                  id="origin-url-filled"
                  label="Recipe URL"
                  variant="outlined"
                  value={originUrl}
                  onChange={onOriginUrlChange}
                  placeholder="Recipe URL"
                  name="originUrl"
                  className={classes.textField}
                />
                <TextField
                  id="origin-text-filled"
                  label="Recipe Origin"
                  variant="outlined"
                  value={originText}
                  onChange={onOriginTextChange}
                  placeholder="Recipe URL"
                  name="originText"
                  className={classes.textField}
                />
                <TextField
                  id="origin-text-filled"
                  label="Image URL"
                  variant="outlined"
                  value={imageUrl}
                  onChange={onImageUrlChange}
                  placeholder="IMG URL"
                  name="imageUrl"
                  className={classes.textField}
                />
                {imageUrl && (
                  <div>
                    <Typography
                      variant="caption"
                      display="block"
                      className={classes.textField}
                    >
                      Image Preview
                    </Typography>
                    <img
                      alt="recipe"
                      className={classes.imgPreview}
                      src={imageUrl}
                    />
                  </div>
                )}
                {error && <ErrorMessage error={error} />}

                <Button
                  disabled={isInvalid || loading}
                  type="submit"
                  className={classes.button}
                  variant="contained"
                  color="primary"
                >
                  Save
                </Button>
              </form>
            </>
          );
        }}
      </Mutation>
      <Mutation mutation={DELETE_RECIPE} variables={{ id }}>
        {(deleteRecipe, deleteRecipeMutationProps) => {
          return (
            <Button
              variant="contained"
              className={classes.deleteButton}
              onClick={(event) => onDelete(event, deleteRecipe)}
              style={{ marginTop: 10 }}
            >
              Delete Recipe
            </Button>
          );
        }}
      </Mutation>
      <Link to={`/edit-ingredients/${id}`}>
        <Button
          color="secondary"
          variant="contained"
          className={classes.editButton}
          style={{ marginRight: 10 }}
        >
          Edit Ingredients
        </Button>
      </Link>
      <Link to={`/edit-instructions/${id}`}>
        <Button
          color="secondary"
          variant="contained"
          className={classes.editButton}
        >
          Edit Instructions
        </Button>
      </Link>
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

const RecipeUpdate = (props) => {
  let { id } = useParams();
  const { classes, history } = props;
  return (
    <Query query={GET_RECIPE} variables={{ id }}>
      {(queryProps) => {
        return get(queryProps, 'data.recipe') &&
          !get(queryProps, 'loading') ? (
          <RecipeUpdateForm
            {...queryProps}
            classes={classes}
            history={history}
          />
        ) : (
          <div>Loading...</div>
        );
      }}
    </Query>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withRouter(withSession(RecipeUpdate))
);
