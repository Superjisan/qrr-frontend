import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { get, isEmpty } from 'lodash';
import { Link, useParams, withRouter } from 'react-router-dom';

import List from '@material-ui/core/List';
import { Edit, Cached } from '@material-ui/icons';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import ListItemText from '@material-ui/core/ListItemText';

import * as routes from '../../../constants/routes';
import withSession from '../../Session/withSession';

const GET_RECIPE_INSTRUCTIONS = gql`
  query($recipeId: ID!) {
    recipe(id: $recipeId) {
      id
      name
      author {
        id
      }
      instructions {
        id
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
  },
  fontIcon: {
    float: 'right',
    marginRight: 5,
    cursor: 'pointer'
  }
});

const Instructions = (props) => {
  const { data, error, classes, me } = props;
  const isAllowedToEdit = me && data.recipe.author.id === me.id;
  return (
    <div>
      {data.recipe.instructions.map((instruction) => {
        return (
          <Paper
            variant="outlined"
            key={`instruction-${instruction.id}`}
            className={classes.paperRoot}
          >
            <Typography>
              {isAllowedToEdit && (
                <Link to={`/update-instruction/${instruction.id}`}>
                  <Edit className={classes.fontIcon} />
                </Link>
              )}
            </Typography>
            <Typography variant="body1">
              {get(instruction, 'text')}
            </Typography>

            {!isEmpty(get(instruction, 'ingredients')) && (
              <List>
                <Typography variant="subtitle2">
                  Ingredients
                </Typography>
                {get(instruction, 'ingredients').map((ingredient) => {
                  return (
                    <ListItem
                      key={`instruction-${instruction.id}-${ingredient.id}`}
                    >
                      <ListItemText
                        primary={`Item: ${get(
                          ingredient,
                          'item.name'
                        )}`}
                        secondary={`Quantity: ${get(
                          ingredient,
                          'qty'
                        )} ${
                          get(ingredient, 'uom')
                            ? ` 
                                ${get(ingredient, 'uom.name')} - 
                                ${get(ingredient, 'uom.alias')}`
                            : ''
                        }`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Paper>
        );
      })}
      <Link to={`/add-instruction/${data.recipe.id}`}>
        <Button
          className={classes.linkButton}
          variant="contained"
          color="secondary"
        >
          Add Instruction
        </Button>
      </Link>
    </div>
  );
};

const InstructionsEdit = (props) => {
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
        <Button variant="outlined" color="secondary">
          Back To Recipe Edit
        </Button>
      </Link>

      <Query query={GET_RECIPE_INSTRUCTIONS} variables={{ recipeId }}>
        {({ data, loading, error, refetch }) => {
          return (
            <>
              <Typography variant="h4">
                {get(data, 'recipe.name')} Instructions
                <Button
                  onClick={() => refetch()}
                  color="secondary"
                  variant="outlined"
                  className={classes.fontIcon}
                >
                  <Cached />
                </Button>
              </Typography>
              {get(data, 'recipe.instructions') && !loading ? (
                <Instructions
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
    </Container>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withRouter(withSession(InstructionsEdit))
);
