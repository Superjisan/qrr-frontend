import { get, find } from 'lodash';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Link, useParams, withRouter } from 'react-router-dom';

import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import LinearProgress from '@material-ui/core/LinearProgress';

import { getIngredientDisplay } from '../utils';
import Alert from '../../Alert';
import ErrorMessage from '../../Error';

const UPDATE_INSTRUCTION = gql`
  mutation(
    $text: String!
    $category: String
    $recipeId: ID!
    $id: ID!
    $ingredientIds: [ID]
    $textTimes: [InputTextTime]
    $textIngredients: [InputTextIngredient]
  ) {
    updateInstruction(
      id: $id
      text: $text
      category: $category
      recipeId: $recipeId
      ingredientIds: $ingredientIds
      textTimes: $textTimes
      textIngredients: $textIngredients
    ) {
      id
      category
      ingredients {
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

const GET_INSTRUCTION = gql`
  query($id: ID!) {
    instruction(id: $id) {
      id
      category
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
      recipe {
        id
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

const DELETE_INSTRUCTION = gql`
  mutation($id: ID!, $recipeId: ID!) {
    deleteInstruction(id: $id, recipeId: $recipeId)
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
  backRecipeButton: {
    marginBottom: 10,
    marginLeft: 10
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
  },
  deleteButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    width: '100%'
  },
  inputRoot: {
    '& .MuiInput-input' : {
      height: 40
    }
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

const InstructionUpdateForm = (props) => {
  const {
    classes,
    history,
    data,
    error,
    loading,
    instructionId,
    refetch
  } = props;
  const recipeId = data.instruction.recipe.id;

  const [isErrorOpen, setErrorOpen] = useState(false);
  const [isSuccessOpen, setSuccessOpen] = useState(false);

  const [text, setText] = useState(data.instruction.text);
  const [category, setCategory] = useState(data.instruction.category);
  const [ingredientIds, setIngredientIds] = useState(
    data.instruction.ingredients.map((ingredient) => ingredient.id)
  );

  const onTextChange = (event) => setText(event.target.value);
  const onCategoryChange = (event) => setCategory(event.target.value);

  const onIngredientIdsChange = (event) => {
    setIngredientIds(event.target.value);
  };

  const onSubmit = async (event, updateInstruction, recipeId) => {
    event.preventDefault();
    try {
      const newInsruction = await updateInstruction();
      if (newInsruction) {
        setSuccessOpen(true);
        refetch();
      }
    } catch (err) {
      setErrorOpen(true);
      console.error(err);
    }
  };

  const onDelete = async (event, deleteInstruction, recipeId) => {
    event.preventDefault();
    try {
      const deletedInstruction = await deleteInstruction();
      if (deletedInstruction) {
        history.push(`/edit-instructions/${recipeId}`);
      }
    } catch (err) {
      setErrorOpen(true);
      console.error(err);
    }
  };

  const handleSuccessClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSuccessOpen(false);
  };

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorOpen(false);
  };

  const isInvalid = text === '';
  return (
    <>
      <Link to={`/edit-instructions/${recipeId}`}>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.backButton}
        >
          Back To Edit Instructions
        </Button>
      </Link>
      <Link to={`/edit-instructions/${recipeId}`}>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.backRecipeButton}
        >
          Back To Edit Recipe
        </Button>
      </Link>
      <Mutation
        mutation={UPDATE_INSTRUCTION}
        variables={{
          id: instructionId,
          recipeId: Number(recipeId),
          text,
          ingredientIds,
          category
        }}
      >
        {(updateInstruction, mutationProps) => (
          <form
            onSubmit={(event) =>
              onSubmit(event, updateInstruction, recipeId)
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
            {get(data, 'instruction.recipe.ingredients') && (
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
                  className={classes.inputRoot}
                  multiple
                  value={ingredientIds}
                  onChange={onIngredientIdsChange}
                  input={
                    <Input
                      id="ingredient-ids-multiple-chip"
                    />
                  }
                  renderValue={(selected) => (
                    <div className={classes.chips}>
                      {selected.map((value) => {
                        const ingredientBasedOnId = find(
                          get(data, 'instruction.recipe.ingredients'),
                          (ingredient) => ingredient.id === value
                        );
                        if (ingredientBasedOnId) {
                          return (
                            <Chip
                              key={value}
                              label={`${getIngredientDisplay({
                                ingredient: ingredientBasedOnId
                              })}`}
                              className={classes.chip}
                            />
                          );
                        } else {
                          return null
                        }
                      })}
                    </div>
                  )}
                  MenuProps={MenuProps}
                >
                  {get(data, 'instruction.recipe.ingredients').map(
                    (ingredient) => (
                      <MenuItem
                        key={ingredient.id}
                        value={ingredient.id}
                      >
                        {`${getIngredientDisplay({ ingredient })}`}
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
      <Mutation
        mutation={DELETE_INSTRUCTION}
        variables={{ id: instructionId, recipeId }}
      >
        {(deleteInstruction, deleteIngredientMutationProps) => {
          return (
            <Button
              variant="contained"
              bgcolor="error"
              className={classes.deleteButton}
              onClick={(event) =>
                onDelete(event, deleteInstruction, recipeId)
              }
              style={{ marginTop: 10 }}
            >
              Delete Instruction
            </Button>
          );
        }}
      </Mutation>
      <Snackbar
        open={isSuccessOpen}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
      >
        <Alert onClose={handleSuccessClose} severity="success">
          Recipe Saved
        </Alert>
      </Snackbar>
      <Snackbar
        open={isErrorOpen}
        autoHideDuration={6000}
        onClose={handleErrorClose}
      >
        <Alert onClose={handleErrorClose} severity="error">
          Something Went Wrong
        </Alert>
      </Snackbar>
    </>
  );
};

const InstructionUpdate = (props) => {
  let { instructionId } = useParams();
  const { classes, history } = props;

  return (
    <Container maxWidth="sm">
      <Query
        query={GET_INSTRUCTION}
        variables={{ id: instructionId }}
      >
        {({ data, error, loading, refetch }) => {
          return !get(data, 'loading') && get(data, 'instruction') ? (
            <InstructionUpdateForm
              data={data}
              error={error}
              loading={loading}
              instructionId={instructionId}
              classes={classes}
              history={history}
              refetch={refetch}
            />
          ) : (
            <LinearProgress variant="query" />
          );
        }}
      </Query>
    </Container>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withRouter(InstructionUpdate)
);
