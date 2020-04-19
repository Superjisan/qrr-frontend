import { get } from 'lodash';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import React, { Component } from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import * as routes from '../../../constants/routes';
import withSession from '../../Session/withSession';

const GET_RECIPE_INGREDIENTS = gql`
  query($recipeId: ID!) {
    recipe(id: $recipeId) {
      ingredients {
        qty
        item {
          name
        }
        uom {
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
});

const IngredientsView = (props) => {
  let { recipeId } = useParams();
  return (
    <>
      <Link to={routes.LANDING}>
        <Button variant="outlined" color="secondary">
          Back To Recipes
        </Button>
      </Link>
      <Query query={GET_RECIPE_INGREDIENTS} variables={{recipeId}}>
          {({data, loading, error}) => {
              return get(data, "recipe.ingredients") && !loading ? "we here" : "loading"
          }}
      </Query>
    </>
  );
};

export default withStyles(useStyles, { withTheme: true })(withRouter(withSession(IngredientsView)))
