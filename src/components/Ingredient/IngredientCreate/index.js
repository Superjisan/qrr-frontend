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
    $recipeId: Int!
    $qty: Float!
    $itemName: String
    $itemId: Int
    $uomId: Int
  ) {
    addIngredient(
      recipeId: $recipeId
      qty: $qty
      itemName: $itemName
      itemId: $itemId
      uomId: $uomId
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
  },
  backButton: {
    marginBottom: 10
  },
  saveButton : {
      width: '100%'
  }
});

const IngredientCreate = (props) => {
  let { recipeId } = useParams();
  const { classes, history } = props;
  const [qty, setQty] = useState(1);
  const [itemName, setItemName] = useState('');
  const [itemId, setItemId] = useState();
  const [uomId, setUomId] = useState();

  const onQtyChange = (event) => {
    setQty(Number(event.target.value));
  };
  const onItemNameChange = (event) => {
    setItemName(event.target.value);
  };
  const onItemIdChange = (event) => {
    if(event.target.value) {
        setItemName("")
    }
    setItemId(Number(event.target.value));
  };
  const onUomIdChange = (event) => {
    setUomId(Number(event.target.value));
  };

  const onSubmit = async (event, addIngredient, recipeId) => {
    event.preventDefault();
    try {
        const newIngredient = await addIngredient()
        if(newIngredient){
            history.push(`/edit-ingredients/${recipeId}`)
        }
    } catch(err) {
        console.error(err)
    }
  };

  const isItemNameDisabled = !!itemId;
  const isInvalid = qty === '';

  return (
    <Container maxWidth="sm">
      <Link to={`/edit-ingredients/${recipeId}`}>
        <Button
          variant="outlined"
          color="secondary"
          className={classes.backButton}
        >
          Back To Edit Ingredients
        </Button>
      </Link>
      <Query query={GET_ITEMS_AND_UOMS}>
        {({ data, error, loading }) => {
          return (
            <Mutation
              mutation={ADD_INGREDIENT_TO_RECIPE}
              variables={{
                recipeId: Number(recipeId),
                qty,
                itemName,
                itemId,
                uomId
              }}
            >
              {(addIngredient, mutationProps) => (
                <form
                  onSubmit={(event) => onSubmit(event, addIngredient, recipeId)}
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
                        step: "0.01"
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
                  {/* TODO: replace with AutoComplete and Control & Uncontrolled Error */}
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
