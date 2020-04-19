import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import * as routes from '../../../constants/routes';

const UPDATE_RECIPE = gql`
    mutation(){
        updateRecipe() {
            
        }
    }
`