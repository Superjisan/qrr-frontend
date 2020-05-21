import { get } from 'lodash';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Link, useParams, withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';

import Alert from '../../Alert';
import ErrorMessage from '../../Error';

const UPDATE_INGREDIENT = gql`
  mutation(
    $recipeId: ID!
    $qty: Float!
    $itemName: String
    $itemId: ID
    $uomId: ID
    $id: ID!
  ) {
    updateIngredient(
      recipeId: $recipeId
      qty: $qty
      itemName: $itemName
      itemId: $itemId
      uomId: $uomId
      id: $id
    ) {
      id
      item {
        id
        name
      }
    }
  }
`;

const DELETE_INGREDIENT = gql`
  mutation($ingredientId: ID!, $recipeId: ID!) {
    deleteIngredient(id: $ingredientId, recipeId: $recipeId)
  }
`;

const GET_INGREDIENT_ITEMS_UOMS = gql`
  query($id: ID!) {
    ingredient(id: $id) {
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
      recipe {
        id
      }
    }
    items {
      id
      name
    }
    uoms {
      id
      name
      alias
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
  backRecipeButton: {
    marginBottom: 10,
    marginLeft: 10
  },
  saveButton: {
    width: '100%'
  },
  deleteButton: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    width: '100%',
    marginTop: 10
  }
});

const IngredientUpdateForm = (props) => {
  const {
    classes,
    history,
    data,
    error,
    loading,
    ingredientId,
    refetch
  } = props;
  const recipeId = data.ingredient.recipe.id;

  const [isSuccessOpen, setSuccessOpen] = useState(false);
  const [isErrorOpen, setErrorOpen] = useState(false);

  const [qty, setQty] = useState(data.ingredient.qty);
  const [itemName, setItemName] = useState('');
  const [itemId, setItemId] = useState(data.ingredient.item.id);
  const [uomId, setUomId] = useState(get(data, 'ingredient.uom.id'));

  const onQtyChange = (event) => {
    setQty(Number(event.target.value));
  };
  const onItemNameChange = (event) => {
    setItemName(event.target.value);
  };
  const onItemIdChange = (event) => {
    if (event.target.value) {
      setItemName('');
    }
    setItemId(Number(event.target.value));
  };
  const onUomIdChange = (event) => {
    setUomId(event.target.value);
  };

  const onSubmit = async (event, updateIngredient) => {
    event.preventDefault();
    try {
      const updatedIngredient = await updateIngredient();
      if (updatedIngredient) {
        setSuccessOpen(true);
        refetch();
      }
    } catch (err) {
      setErrorOpen(true);
      console.error(err);
    }
  };

  const onDelete = async (event, deleteIngredient, recipeId) => {
    event.preventDefault();
    try {
      const deletedIngredient = await deleteIngredient();
      if (deletedIngredient) {
        history.push(`/edit-ingredients/${recipeId}`);
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

  const isItemNameDisabled = !!itemId;
  const isInvalid = qty === '';

  return (
    <>
      <Link to={`/edit-ingredients/${recipeId}`}>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.backButton}
        >
          Back To Edit Ingredients
        </Button>
      </Link>
      <Link to={`/update-recipe/${recipeId}`}>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.backRecipeButton}
        >
          Back To Edit Recipe
        </Button>
      </Link>
      <Mutation
        mutation={UPDATE_INGREDIENT}
        variables={{
          recipeId: recipeId,
          qty,
          itemName,
          itemId,
          uomId,
          id: ingredientId
        }}
      >
        {(updateIngredient, mutationProps) => (
          <>
            <form
              onSubmit={(event) =>
                onSubmit(event, updateIngredient, recipeId)
              }
            >
              <TextField
                required
                id="qty-filled-required"
                label="Ingredient Quantity"
                variant="outlined"
                value={qty}
                onChange={onQtyChange}
                placeholder="Ingredient Quantity"
                name="qty"
                type="number"
                className={classes.textField}
                inputProps={{
                  step: '0.01'
                }}
              />
              <TextField
                id="itemName-filled-required"
                label="Item Name (For New Items)"
                variant="outlined"
                value={itemName}
                onChange={onItemNameChange}
                placeholder="Item Name"
                name="itemName"
                disabled={isItemNameDisabled}
                className={classes.textField}
              />
              {/* TODO: replace with AutoComplete and Fix Control & Uncontrolled Error */}
              <TextField
                id="item-id-filled"
                select
                label="Item"
                value={itemId}
                name="itemId"
                variant="outlined"
                onChange={onItemIdChange}
                className={classes.textField}
                helperText="Select Item For Ingredient"
              >
                <MenuItem value={undefined}>
                  <em>None</em>
                </MenuItem>
                {get(data, 'items', []).map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="uom-id-filled"
                select
                label="Unit of Measure"
                value={uomId}
                name="uomId"
                variant="outlined"
                onChange={onUomIdChange}
                className={classes.textField}
                helperText="Select Unit of Measure"
              >
                <MenuItem value={undefined}>
                  <em>None</em>
                </MenuItem>
                {get(data, 'uoms', []).map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}{' '}
                    {option.alias && `- ${option.alias}`}
                  </MenuItem>
                ))}
              </TextField>
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
          </>
        )}
      </Mutation>
      <Mutation
        mutation={DELETE_INGREDIENT}
        variables={{ ingredientId, recipeId }}
      >
        {(deleteIngredient, deleteIngredientMutationProps) => {
          return (
            <Button
              variant="contained"
              bgcolor="error"
              className={classes.deleteButton}
              onClick={(event) =>
                onDelete(event, deleteIngredient, recipeId)
              }
            >
              Delete Ingredient
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

const IngredientUpdate = (props) => {
  const { classes, history } = props;
  const { ingredientId } = useParams();

  return (
    <Container maxWidth="sm">
      <Query
        query={GET_INGREDIENT_ITEMS_UOMS}
        variables={{ id: ingredientId }}
      >
        {({ data, error, loading, refetch }) => {
          return get(data, 'ingredient') && !loading ? (
            <IngredientUpdateForm
              data={data}
              loading={loading}
              classes={classes}
              history={history}
              refetch={refetch}
              ingredientId={ingredientId}
            />
          ) : (
            <LinearProgress  variant="query"/>
          );
        }}
      </Query>
    </Container>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withRouter(IngredientUpdate)
);
