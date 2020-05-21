import gql from 'graphql-tag';
import { get } from 'lodash';
import { Query } from 'react-apollo';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { Edit, Cached, Visibility, Search } from '@material-ui/icons';
import LinearProgress from '@material-ui/core/LinearProgress';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import InputAdornment from '@material-ui/core/InputAdornment';

import * as routes from '../../../constants/routes';

const GET_RECIPE_BY_NAME = gql`
  query($name: String) {
    recipeSearchByName(name: $name) {
      id
      name
      cookingTime
      rating
      imageUrl
      author {
        id
        username
      }
      ingredients {
        id
      }
      instructions {
        id
      }
    }
  }
`;

const materialStyles = (theme) => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingTop: 0
  },
  inline: {
    display: 'inline'
  },
  paperRoot: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  fontIcon: {
    float: 'right',
    marginRight: 5,
    cursor: 'pointer'
  },
  paragraph: {
    marginTop: 10
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0
  },
  viewButton: {
    margin: 5
  },
  button: {
    width: '100%',
    marginTop: 10
  },
  card: {
    display: 'flex',
    marginTop: 10,
    marginBottom: 10
  },
  media: {
    width: 150
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  },
  content: {
    flex: '1 0 auto'
  },
  textField: {
    marginBottom: 10,
    width: `100%`,
    marginTop: 10
  }
});

const RecipesBase = (props) => {
  const { classes, session } = props;
  const [name, setName] = useState('');

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  return (
    <Query query={GET_RECIPE_BY_NAME} variables={{ name }}>
      {({ data, loading, error, refetch }) => {
        return (
          <Container maxWidth="sm">
            <Typography variant="h3" align="center">
              Quarantine Recipe Repository
            </Typography>
            <Typography variant="h3" align="center">
              <Button
                onClick={() => refetch()}
                color="secondary"
                variant="outlined"
                className={classes.fontIcon}
              >
                <Cached />
              </Button>
            </Typography>
            <TextField
              variant="outlined"
              label="Search for Recipe Name"
              placeholder="Recipe Name"
              className={classes.textField}
              onChange={(event) => onNameChange(event)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                )
              }}
            />
            {loading && <LinearProgress variant="query" />}
            {session && session.me && (
              <Link to={routes.ADD_RECIPE}>
                <Button
                  className={classes.button}
                  variant="contained"
                  color="secondary"
                >
                  Add Recipe
                </Button>
              </Link>
            )}
            {data &&
              data.recipeSearchByName &&
              data.recipeSearchByName.map((recipe) => {
                const isAllowedToEdit =
                  (session &&
                    session.me &&
                    recipe.author.id === session.me.id) ||
                  get(session, 'me.role') === 'ADMIN';
                return (
                  <Card className={classes.card} key={recipe.id}>
                    <div className={classes.details}>
                      <CardContent className={classes.content}>
                        <Typography variant="h5">
                          {recipe.name}
                          <Link to={`view-recipe/${recipe.id}`}>
                            <Visibility
                              className={classes.fontIcon}
                            />
                          </Link>
                          {isAllowedToEdit && (
                            <Link to={`update-recipe/${recipe.id}`}>
                              <Edit className={classes.fontIcon} />
                            </Link>
                          )}
                        </Typography>
                        <Typography>
                          {`No. of Ingredients: ${recipe.ingredients.length}`}
                        </Typography>
                        <Typography>
                          {`No. of Steps: ${recipe.instructions.length}`}
                        </Typography>
                        <Typography>
                          Author: {recipe.author.username}
                        </Typography>
                        {recipe.cookingTime && (
                          <Typography>
                            Cooking Time: {recipe.cookingTime}
                          </Typography>
                        )}
                        {recipe.rating && (
                          <Box
                            mb={3}
                            mt={1}
                            borderColor="transparent"
                          >
                            <Typography component="legend">
                              Rating
                            </Typography>
                            <Rating
                              name="rating"
                              value={recipe.rating}
                              disabled
                            />
                          </Box>
                        )}
                        <Link to={`/view-ingredients/${recipe.id}`}>
                          <Button
                            className={classes.viewButton}
                            variant="outlined"
                            color="secondary"
                          >
                            View Ingredients
                          </Button>
                        </Link>
                        <Link to={`/view-instructions/${recipe.id}`}>
                          <Button
                            className={classes.viewButton}
                            variant="outlined"
                            color="secondary"
                          >
                            View Instructions
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                    {recipe.imageUrl && (
                      <CardMedia
                        className={classes.media}
                        image={recipe.imageUrl}
                      />
                    )}
                  </Card>
                );
              })}
          </Container>
        );
      }}
    </Query>
  );
};

const Recipes = withStyles(materialStyles)(RecipesBase);

export default Recipes;
