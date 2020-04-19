import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import withSession from '../../Session/withSession';
import ErrorMessage from '../../Error';

import * as routes from '../../../constants/routes';

const ADD_RECIPE = gql`
  mutation($name: String!) {
    addRecipe(name: $name) {
      id
      name
      author {
        username
      }
    }
  }
`;

class RecipeCreate extends Component {
  state = {
    name: '',
  };

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  onSubmit = async (event, addRecipe) => {
    event.preventDefault();

    try {
      await addRecipe();
      this.setState({ name: '' });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { session } = this.props;
    const { name } = this.state;
    return (
      <>
        <Link to={routes.LANDING}>Back To Recipes</Link>
        {session && session.me ? (
          <Mutation mutation={ADD_RECIPE} variables={{ name }}>
            {(addRecipe, mutationProps) => {
              const { data, loading, error } = mutationProps;
              return (
                <form
                  onSubmit={(event) =>
                    this.onSubmit(event, addRecipe)
                  }
                >
                  <input
                    name="name"
                    value={name}
                    onChange={this.onChange}
                  />
                  <button type="submit">Send</button>
                  {error && <ErrorMessage error={error} />}
                </form>
              );
            }}
          </Mutation>
        ) : (
          `Not Allowed To Add Recipe, You Must Sign In`
        )}
      </>
    );
  }
}

export default withSession(RecipeCreate);
