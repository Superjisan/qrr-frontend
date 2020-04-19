import { get } from 'lodash';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import React, { Component } from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';

import { Edit } from '@material-ui/icons';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import * as routes from '../../../constants/routes';
import withSession from '../../Session/withSession';

const GET_RECIPE_INGREDIENTS = gql`
  query($recipeId: ID!) {
    recipe(id: $recipeId) {
      author {
        id
      }
      name
      ingredients {
        id
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
    width: '`100%',
  },
  paperRoot: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  fontIcon: {
    float: 'right',
    marginRight: 5,
    cursor: 'pointer',
  },
  addButton: {
    width: '100%',
  },
});

const Ingredients = (props) => {
  const { data, error, classes, me } = props;
  const isAllowedToEdit = me && data.recipe.author.id === me.id;
  return (
    <div>
      {data.recipe.ingredients.map((ingredient) => {
        return (
          <Paper
            key={`ingredient-${ingredient.id}`}
            className={classes.paperRoot}
            variant="outlined"
          >
            <Typography>
              Item: {get(ingredient, 'item.name')}
              {isAllowedToEdit && (
                <Link to={`update-ingredient/${ingredient.id}`}>
                  <Edit className={classes.fontIcon} />
                </Link>
              )}
            </Typography>
            <Typography>
              Quantity: {get(ingredient, 'qty')}
            </Typography>
            {get(ingredient, 'uom') && (
              <Typography>
                Unit Of Measure: {get(ingredient, 'uom.name')} -{' '}
                {get(ingredient, 'uom.alias')}
              </Typography>
            )}
          </Paper>
        );
      })}
      {isAllowedToEdit && (
        <Link to={`/add-ingredient/${data.recipe.id}`}>
          <Button
            className={classes.linkButton}
            variant="contained"
            color="secondary"
          >
            Add Ingredient
          </Button>
        </Link>
      )}
    </div>
  );
};

const IngredientsEdit = (props) => {
  console.log('coming here');
  let { recipeId } = useParams();
  const { classes, session } = props;
  return (
    <>
      <Link to={routes.LANDING}>
        <Button variant="outlined" color="secondary">
          Back To Recipes
        </Button>
      </Link>

      <Query query={GET_RECIPE_INGREDIENTS} variables={{ recipeId }}>
        {({ data, loading, error }) => {
          return (
            <>
              <Typography variant="h3">
                {get(data, 'recipe.name')} Ingredients
              </Typography>
              {get(data, 'recipe.ingredients') && !loading ? (
                <Ingredients
                  data={data}
                  error={error}
                  classes={classes}
                  me={session.me}
                />
              ) : (
                'loading'
              )}
            </>
          );
        }}
      </Query>
    </>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withRouter(IngredientsEdit),
);
