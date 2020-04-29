import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Edit, Cached, Visibility } from '@material-ui/icons';

import * as routes from '../../../constants/routes';

const GET_ALL_RECIPES = gql`
  query {
    recipes {
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
    width:'100%'
  },
  content: {
    flex: '1 0 auto'
  }
});

const RecipesBase = (props) => {
  const { classes, session } = props;

  return (
    <Query query={GET_ALL_RECIPES}>
      {({ data, loading, error, refetch }) => {
        return (
          <Container maxWidth="sm">
            <Typography variant="h3" align="center">
              Recipes
              <Button
                onClick={() => refetch()}
                color="secondary"
                variant="outlined"
                className={classes.fontIcon}
              >
                <Cached />
              </Button>
            </Typography>
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
              data.recipes &&
              data.recipes.map((recipe) => {
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
                          {session &&
                            session.me &&
                            recipe.author.id === session.me.id && (
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
