import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const GET_ALL_RECIPES = gql`
  query() {
    recipes {
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


const Recipes = props => {
    return (
        <Query query={GET_ALL_RECIPES}>
            {props => {
                
            }}
        </Query>
    )
}