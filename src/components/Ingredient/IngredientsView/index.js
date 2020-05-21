import { get } from 'lodash';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import React, { Component } from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import * as routes from '../../../constants/routes';
import withSession from '../../Session/withSession';

const GET_RECIPE_INGREDIENTS = gql`
  query($recipeId: ID!) {
    recipe(id: $recipeId) {
      name
      ingredients {
        id
        qty
        item {
          id
          name
        }
        uom {
          id
          name
          alias
        }
      }
    }
  }
`;

const useStyles = (theme) => ({
  linkButton: {
    width: '`100%'
  },
  paperRoot: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  viewRecipeButton: {
    marginLeft: 10
  }
});

const Ingredients = (props) => {
  const { data, error, classes } = props;
  return (
    <div>
      {data.recipe.ingredients.map((ingredient) => {
        return (
          <Paper
            variant="outlined"
            key={`ingredient-${ingredient.id}`}
            className={classes.paperRoot}
          >
            <Typography variant="h5">
              {`${get(ingredient, 'qty')} ${
                get(ingredient, 'uom') ? ingredient.uom.name : ''
              } ${get(ingredient, 'item.name')}`}
            </Typography>
          </Paper>
        );
      })}
    </div>
  );
};

const IngredientsView = (props) => {
  let { recipeId } = useParams();
  const { classes } = props;
  return (
    <Container maxWidth="sm">
      <Link to={routes.LANDING}>
        <Button variant="outlined" color="secondary">
          Back To Recipes
        </Button>
      </Link>
      <Link to={`/view-recipe/${recipeId}`}>
        <Button variant="outlined" color="secondary" className={classes.viewRecipeButton}>
          View Recipe
        </Button>
      </Link>

      <Query query={GET_RECIPE_INGREDIENTS} variables={{ recipeId }}>
        {({ data, loading, error }) => {
          return (
            <>
              <Typography variant="h4">
                {get(data, 'recipe.name')} Ingredients
              </Typography>
              {get(data, 'recipe.ingredients') && !loading ? (
                <Ingredients
                  data={data}
                  error={error}
                  classes={classes}
                />
              ) : (
                'loading'
              )}
            </>
          );
        }}
      </Query>
    </Container>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withRouter(withSession(IngredientsView))
);
