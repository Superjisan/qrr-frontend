import { get } from 'lodash';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { Link, useParams, withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import ErrorMessage from '../../Error';
import * as routes from '../../../constants/routes';

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
  saveButton: {
    width: '100%'
  }
});

const IngredientUpdateForm = (props) => {
  const {
    classes,
    history,
    data,
    error,
    loading,
    ingredientId
  } = props;
  const recipeId = data.ingredient.recipe.id;

  const [qty, setQty] = useState(data.ingredient.qty);
  const [itemName, setItemName] = useState(data.ingredient.item.name);
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
        console.log('updated ingredient');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async (event, deleteIngredient, recipeId) => {
    event.preventDefault();
    try {
      const deletedIngredient = await deleteIngredient();
      if(deletedIngredient) {
        history.push(`/edit-ingredients/${recipeId}`)
      }
    }catch (err) {
      console.error(err)
    }
  }

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
      <Mutation mutation={DELETE_INGREDIENT} variables={{ ingredientId, recipeId }}>
        {(deleteIngredient, deleteIngredientMutationProps) => {
          return (
            <Button
              variant="contained"
              bgcolor="error"
              className={classes.button}
              onClick={(event) => onDelete(event, deleteIngredient, recipeId)}
              style={{ marginTop: 10 }}
            >
              Delete Ingredient
            </Button>
          );
        }}
      </Mutation>
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
        {({ data, error, loading }) => {
          return get(data, 'ingredient') && !loading ? (
            <IngredientUpdateForm
              data={data}
              loading={loading}
              classes={classes}
              history={history}
              ingredientId={ingredientId}
            />
          ) : (
            'loading...'
          );
        }}
      </Query>
    </Container>
  );
};

export default withStyles(useStyles, { withTheme: true })(
  withRouter(IngredientUpdate)
);
