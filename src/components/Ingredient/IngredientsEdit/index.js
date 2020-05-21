import { get } from 'lodash';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import React from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';

import { Edit, Cached } from '@material-ui/icons';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import * as routes from '../../../constants/routes';
import { getIngredientDisplay } from '../../Instruction/utils';

const GET_RECIPE_INGREDIENTS = gql`
  query($recipeId: ID!) {
    recipe(id: $recipeId) {
      id
      author {
        id
      }
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
    marginLeft: 10
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
  addButton: {
    width: '100%'
  },
  headerText: {
    marginBottom: 10
  }
});

const Ingredients = (props) => {
  const { data, error, classes, me } = props;
  const isAllowedToEdit = me && data.recipe.author.id === me.id;
  return (
    <div>
      {isAllowedToEdit && (
        <Link to={`/add-ingredient/${data.recipe.id}`}>
          <Button
            className={classes.addButton}
            variant="contained"
            color="secondary"
          >
            Add Ingredient
          </Button>
        </Link>
      )}
      {data.recipe.ingredients.map((ingredient) => {
        return (
          <Paper
            key={`ingredient-${ingredient.id}`}
            className={classes.paperRoot}
            variant="outlined"
          >
            <Typography>
              {getIngredientDisplay({ ingredient })}
              {isAllowedToEdit && (
                <Link to={`/update-ingredient/${ingredient.id}`}>
                  <Edit className={classes.fontIcon} />
                </Link>
              )}
            </Typography>
          </Paper>
        );
      })}
      
    </div>
  );
};

const IngredientsQuery = (props) => {
  const { recipeId, classes, session, titleName } = props;
  return (
    <Query query={GET_RECIPE_INGREDIENTS} variables={{ recipeId }}>
      {({ data, loading, error, refetch }) => {
        const headerText =
          titleName || `${get(data, 'recipe.name')} Ingredients`;
        return (
          <>
            <Typography variant="h4" className={classes.headerText}>
              {headerText}
              <Button
                onClick={() => refetch()}
                color="secondary"
                variant="outlined"
                className={classes.fontIcon}
              >
                <Cached />
              </Button>
            </Typography>
            {get(data, 'recipe.ingredients') && !loading ? (
              <Ingredients
                data={data}
                error={error}
                classes={classes}
                me={session.me}
              />
            ) : (
              <LinearProgress variant="query" />
            )}
          </>
        );
      }}
    </Query>
  );
};

const IngredientsEdit = (props) => {
  let { recipeId } = useParams();
  const { classes, session } = props;
  return (
    <Container maxWidth="sm">
      <Link to={routes.LANDING}>
        <Button variant="outlined" color="secondary">
          Back To Recipes
        </Button>
      </Link>
      <Link to={`/update-recipe/${recipeId}`}>
        <Button
          className={classes.linkButton}
          variant="outlined"
          color="secondary"
        >
          Back To Recipe Edit
        </Button>
      </Link>

      <IngredientsQuery
        recipeId={recipeId}
        classes={classes}
        session={session}
      />
    </Container>
  );
};

export { IngredientsQuery };

export default withStyles(useStyles, { withTheme: true })(
  withRouter(IngredientsEdit)
);
