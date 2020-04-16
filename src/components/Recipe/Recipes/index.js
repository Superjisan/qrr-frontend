import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_ALL_RECIPES = gql`
  query {
    recipes {
        id
        name
        author{
          username
        }
        ingredients {
          qty
          item {
            name
          }
        }
        instructions {
          text
          ingredients {
            item {
              name
            }
          }
        }
      }
  }
`;


export const Recipes = props => {
    return (
        <Query query={GET_ALL_RECIPES}>
            {props => {
                const {data} = props;
                console.log({data, props})
                return(
                  <div>
                    {data.recipes && data.recipes.map(recipe => {
                      return (
                        <li key={recipe.id}>{recipe.name}</li>
                      )
                    })}
                    
                  </div>
                )
            }}
        </Query>
    )
}