import { get } from 'lodash';
import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { Link, useParams, withRouter } from 'react-router-dom';

import { Visibility } from '@material-ui/icons';
import Paper from '@material-ui/core/Paper';
import { withStyles, Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import MuiLink from '@material-ui/core/Link';

import * as routes from '../../../constants/routes';

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
      instructions {
        id
        text
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
    }
  };
};

const RecipeView = (props) => {
  let { id } = useParams();
  const { classes } = props;
  return (
    <Container maxWidth="sm">
      <Link to={routes.LANDING}>
        <Button variant="outlined" color="secondary">
          Back To Recipes
        </Button>
      </Link>
      <Query query={GET_RECIPE} variables={{ id }}>
        {({ data, loading, refetch }) => {
          return !data.loading && data.recipe ? (
            <>
              <Paper className={classes.paperRoot} variant="outlined">
                <Typography variant="h4">
                  Recipe - {get(data.recipe, 'name')}
                </Typography>
                {get(data, 'recipe.cookingTime') && (
                  <Typography variant="h5">
                    Cooking Time: {get(data, 'recipe.cookingTIme')}
                  </Typography>
                )}
                {get(data, 'recipe.originUrl') && (
                  <Typography>
                    <MuiLink
                      href={get(data, 'recipe.originUrl')}
                      target="_blank"
                    >
                      Recipe Website
                    </MuiLink>
                  </Typography>
                )}
              </Paper>
              <Paper className={classes.paperRoot} variant="outlined">
                <Typography variant="h4">
                  Ingredients
                  <Link to={`/view-ingredients/${id}`}>
                    <Visibility className={classes.fontIcon} />
                  </Link>
                </Typography>
                {data.recipe.ingredients.map((ingredient) => {
                  return (
                    <Paper
                      className={classes.paperRoot}
                      variant="elevation"
                      key={`ingredient-${ingredient.id}`}
                    >
                      <Typography variant="h5">
                        {`${get(ingredient, 'qty')} ${
                          get(ingredient, 'uom')
                            ? ingredient.uom.name
                            : ''
                        } ${get(ingredient, 'item.name')}`}
                      </Typography>
                    </Paper>
                  );
                })}
              </Paper>
              <Paper className={classes.paperRoot} variant="outlined">
                <Typography variant="h4">
                  Instructions
                  <Link to={`/view-instructions/${id}`}>
                    <Visibility className={classes.fontIcon} />
                  </Link>
                </Typography>
                {data.recipe.instructions.map((instruction) => {
                  return (
                    <Paper
                      className={classes.paperRoot}
                      variant="elevation"
                      key={`instruction-${instruction.id}`}
                    >
                      <Typography variant="body1">
                        {get(instruction, 'text')}
                      </Typography>
                    </Paper>
                  );
                })}
              </Paper>
            </>
          ) : (
            <div>Loading...</div>
          );
        }}
      </Query>
    </Container>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withRouter(RecipeView)
);
