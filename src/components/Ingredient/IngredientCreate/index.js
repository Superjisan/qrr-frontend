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

const ADD_INGREDIENT_TO_RECIPE = gql`
  mutation(
    $recipeId: ID!
    $qty: Float!
    $itemName: String
    $itemId: Int
    $recipeId: Int!
    $uomId: Int
  ) {
    addIngredient(
      recipeId: $recipeId
      qty: $qty
      itemName: $itemName
      itemId: $itemId
    ) {
      id
      item {
        name
      }
    }
  }
`;

const GET_ITEMS_AND_UOMS = gql`
  query {
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
  }
});

const IngredientCreate = (props) => {
  let { recipeId } = useParams();
  const { classes, history } = props;
  const [qty, setQty] = useState();
  const [itemName, setItemName] = useState('');
  const [itemId, setItemId] = useState('');
  const [uomId, setUomId] = useState('');

  const onQtyChange = (event) => {
    setQty(Number(event.target.value));
  };
  const onItemNameChange = (event) => {
    setItemName(event.target.value);
  };
  const onItemIdChange = (event) => {
    console.log({ value: event.target.value });
    setItemId(Number(event.target.value));
  };
  const onUomIdChange = (event) => {
    setUomId(Number(event.target.value));
  };

  const onSubmit = (event, addIngredient) => {
    event.preventDefault();
  };

  const isItemNameDisabled = !!itemId;

  return (
    <Container maxWidth="sm">
      <Link to={`/edit-ingredients/${recipeId}`}>
        <Button variant="outlined" color="secondary">
          Back To Edit Ingredients
        </Button>
      </Link>
      <Query query={GET_ITEMS_AND_UOMS}>
        {({ data, error, loading }) => {
          return (
            <Mutation
              mutation={ADD_INGREDIENT_TO_RECIPE}
              variables={{
                recipeId,
                qty,
                itemName,
                itemId,
                uomId
              }}
            >
              {(addIngredient, mutationProps) => (
                <form
                  onSubmit={(event) => onSubmit(event, addIngredient)}
                >
                  <TextField
                    id="qty-filled-required"
                    label="Ingredient Quantity"
                    variant="outlined"
                    value={qty}
                    onChange={onQtyChange}
                    placeholder="Ingredient Quantity"
                    name="qty"
                    type="number"
                    className={classes.textField}
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
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {get(data, 'items', []).map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    disabled={loading}
                    type="submit"
                    className={classes.button}
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
  withRouter(IngredientCreate)
);
