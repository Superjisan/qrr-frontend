import { get, uniqBy, find } from 'lodash';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Link, useParams, withRouter } from 'react-router-dom';

import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import ErrorMessage from '../../Error';
import * as routes from '../../../constants/routes';

const ADD_INSTRUCTION_TO_RECIPE = gql`
  mutation(
    $text: String!
    $category: String
    $recipeId: ID!
    $ingredientIds: [ID]
    $textTimes: [InputTextTime]
    $textIngredients: [InputTextIngredient]
  ) {
    addInstruction(
      text: $text
      category: $category
      recipeId: $recipeId
      ingredientIds: $ingredientIds
      textTimes: $textTimes
      textIngredients: $textIngredients
    ) {
      id
      ingredients {
        item {
          name
        }
      }
    }
  }
`;

const GET_RECIPE_INGREDIENTS = gql`
  query($recipeId: ID!) {
    recipe(id: $recipeId) {
      id
      ingredients {
        id
        qty
        item {
          id
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
  textField: {
    marginBottom: 10,
    width: `100%`
  },
  backButton: {
    marginBottom: 10
  },
  saveButton: {
    width: '100%'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%'
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const InstructionCreate = (props) => {
  let { recipeId } = useParams();
  const { classes, history } = props;
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [ingredientIds, setIngredientIds] = useState([]);
  const onTextChange = (event) => setText(event.target.value);
  const onCategoryChange = (event) => setCategory(event.target.value);

  const onIngredientIdsChange = (event) => {
    setIngredientIds(event.target.value);
  };

  const onSubmit = async (event, addInstruction, recipeId) => {
    event.preventDefault();
    try {
      const newInsruction = await addInstruction();
      if (newInsruction) {
        history.push(`/edit-instructions/${recipeId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isInvalid = text === '';

  return (
    <Container maxWidth="sm">
      <Link to={`/edit-instructions/${recipeId}`}>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.backButton}
        >
          Back To Edit Instructions
        </Button>
      </Link>
      <Query query={GET_RECIPE_INGREDIENTS} variables={{ recipeId }}>
        {({ data, error, loading }) => {
          return (
            <Mutation
              mutation={ADD_INSTRUCTION_TO_RECIPE}
              variables={{
                recipeId: Number(recipeId),
                text,
                ingredientIds
              }}
            >
              {(addInstruction, mutationProps) => (
                <form
                  onSubmit={(event) =>
                    onSubmit(event, addInstruction, recipeId)
                  }
                >
                  <TextField
                    required
                    id="text-filled-required"
                    label="Instruction Text"
                    variant="outlined"
                    value={text}
                    onChange={onTextChange}
                    placeholder="Instruction Text"
                    name="text"
                    multiline
                    rows={4}
                    className={classes.textField}
                  />

                  <TextField
                    id="category-filled-required"
                    label="Instruction category"
                    variant="outlined"
                    value={category}
                    onChange={onCategoryChange}
                    placeholder="Instruction Category"
                    name="category"
                    className={classes.textField}
                  />
                  {get(data, 'recipe.ingredients') && (
                    <FormControl
                      variant="outlined"
                      className={classes.formControl}
                    >
                      <InputLabel id="ingredient-multiple-chip-label">
                        Ingredients
                      </InputLabel>
                      <Select
                        style={{ width: '100%' }}
                        variant="outlined"
                        labelId="ingredient-multiple-chip-label"
                        id="ingredient-ids-chip"
                        multiple
                        value={ingredientIds}
                        onChange={onIngredientIdsChange}
                        input={
                          <Input id="ingredient-ids-multiple-chip" />
                        }
                        renderValue={(selected) => (
                          <div className={classes.chips}>
                            {selected.map((value) => {
                              const ingredientBasedOnId = find(
                                get(data, 'recipe.ingredients'),
                                (ingredient) =>
                                  ingredient.id === value
                              );
                              console.log({ ingredientBasedOnId });
                              return (
                                <Chip
                                  key={value}
                                  label={`${
                                    ingredientBasedOnId.item.name
                                  } - ${ingredientBasedOnId.qty} ${
                                    ingredientBasedOnId.uom &&
                                    `- ${ingredientBasedOnId.uom.name}`
                                  } `}
                                  className={classes.chip}
                                />
                              );
                            })}
                          </div>
                        )}
                        MenuProps={MenuProps}
                      >
                        {get(data, 'recipe.ingredients').map(
                          (ingredient) => (
                            <MenuItem
                              key={ingredient.id}
                              value={ingredient.id}
                            >
                              {`${ingredient.item.name} - ${
                                ingredient.qty
                              } ${
                                ingredient.uom &&
                                `- ${ingredient.uom.name}`
                              } `}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  )}
                  {error && <ErrorMessage error={error} />}
                  <Button
                    disabled={isInvalid || loading}
                    type="submit"
                    className={classes.saveButton}
                    variant="contained"
                    color="primary"
                  >
                    Save
                  </Button>
                </form>
              )}
            </Mutation>
          );
        }}
      </Query>
    </Container>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withRouter(InstructionCreate)
);
