import {get} from "lodash";

export const getIngredientDisplay = ({ingredient}) => {
    return `${get(
        ingredient,
        'qty'
      )} ${
        get(ingredient, 'uom') ?
        `${get(ingredient, 'uom.name')}` : ""
      } ${get(
        ingredient,
        'item.name'
      )}`
}