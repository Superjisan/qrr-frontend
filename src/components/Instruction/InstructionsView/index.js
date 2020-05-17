import { get, isEmpty } from 'lodash';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import React from 'react';
import { Link, useParams, withRouter } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Container from '@material-ui/core/Container';
import Checkbox from '@material-ui/core/Checkbox';

import * as routes from '../../../constants/routes';
import withSession from '../../Session/withSession';

import { getIngredientDisplay } from '../utils';

const GET_RECIPE_INSTRUCTIONS = gql`
  query($recipeId: ID!) {
    recipe(id: $recipeId) {
      name
      instructions {
        text
        textIngredients {
          wordIndex
          ingredientId
        }
        textTimes {
          wordIndex
          timeValue
        }
        ingredients {
          id
          category

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
  }
});

export const InstructionIngredients = (props) => {
  const { instruction } = props;
  return (
    <>
      {!isEmpty(get(instruction, 'ingredients')) && (
        <List>
          <Typography variant="subtitle2">Ingredients</Typography>
          {get(instruction, 'ingredients').map((ingredient) => {
            return (
              <ListItem
                key={`instruction-${instruction.id}-ingredients-${ingredient.id}`}
              >
                <ListItemIcon>
                  <Checkbox />
                </ListItemIcon>
                <ListItemText
                  primary={`Item: ${getIngredientDisplay({
                    ingredient
                  })}`}
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
};

const Instructions = (props) => {
  const { data, error, classes } = props;
  return (
    <div>
      {data.recipe.instructions.map((instruction) => {
        return (
          <Paper
            variant="outlined"
            key={`instruction-${instruction.id}`}
            className={classes.paperRoot}
          >
            <Typography variant="body1">
              {get(instruction, 'text')}
            </Typography>

            <InstructionIngredients instruction={instruction} />
          </Paper>
        );
      })}
    </div>
  );
};

const InstructionsView = (props) => {
  let { recipeId } = useParams();
  const { classes } = props;
  return (
    <Container maxWidth="sm">
      <Link to={routes.LANDING}>
        <Button variant="outlined" color="secondary">
          Back To Recipes
        </Button>
      </Link>

      <Query query={GET_RECIPE_INSTRUCTIONS} variables={{ recipeId }}>
        {({ data, loading, error }) => {
          return (
            <>
              <Typography variant="h4">
                {get(data, 'recipe.name')} Instructions
              </Typography>
              {get(data, 'recipe.instructions') && !loading ? (
                <Instructions
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
  withRouter(withSession(InstructionsView))
);
