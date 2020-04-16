import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import * as routes from '../../../constants/routes';

const GET_ALL_RECIPES = gql`
  query {
    recipes {
      id
      name
      author {
        username
      }
      ingredients {
        qty
        item {
          name
        }
      }
      instructions {
        text
        ingredients {
          item {
            name
          }
        }
      }
    }
  }
`;

const materialStyles = (theme) => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingTop: 0,
  },
  inline: {
    display: 'inline',
  },
  paperRoot: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    widht: '100%',
  },
  fontIcon: {
    float: 'right',
    marginRight: 5,
    cursor: 'pointer',
  },
  paragraph: {
    marginTop: 10,
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    width: '100%',
  },
});

const RecipesBase = (props) => {
  const { classes, session } = props;
  return (
    <Query query={GET_ALL_RECIPES}>
      {(queryProps) => {
        const { data } = queryProps;
        console.log({ data });
        return (
          <div>
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
                  <>
                    <Paper
                      className={classes.paperRoot}
                      key={recipe.id}
                    >
                      <Typography variant="h5">
                        {recipe.name}
                      </Typography>
                      <Typography>
                        # of Ingredients: {recipe.ingredients.length}
                      </Typography>
                      <Typography>
                        # of Instructions:{' '}
                        {recipe.instructions.length}
                      </Typography>
                      <Typography>
                        Author: {recipe.author.username}
                      </Typography>
                    </Paper>
                  </>
                );
              })}
          </div>
        );
      }}
    </Query>
  );
};

const Recipes = withStyles(materialStyles)(RecipesBase);

export default Recipes;
