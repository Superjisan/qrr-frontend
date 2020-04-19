import React from 'react';
import { Router, Route} from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import RecipeCreate from '../Recipe/RecipeCreate';
import RecipeUpdate from '../Recipe/RecipeUpdate';

import IngredientsView from '../Ingredient/IngredientsView';
import IngredientsEdit from '../Ingredient/IngredientsEdit';
import IngredientCreate from '../Ingredient/IngredientCreate';

import InstructionsView from '../Instruction/InstructionsView';

import withSession from '../Session/withSession';

import * as routes from '../../constants/routes';
import history from '../../constants/history';

const App = ({ session, refetch }) => (
  <Router history={history} basename={process.env.PUBLIC_URL}>
    <div>
      <Navigation session={session} />
      <Route
        exact
        path={routes.LANDING}
        component={() => <LandingPage />}
      />
      <Route
        exact
        path={routes.SIGN_UP}
        component={() => <SignUpPage refetch={refetch} />}
      />
      <Route
        exact
        path={routes.SIGN_IN}
        component={() => <SignInPage refetch={refetch} />}
      />
      <Route
        exact
        path={routes.ACCOUNT}
        component={() => <AccountPage />}
      />
      <Route
        exact
        path={routes.ADMIN}
        component={() => <AdminPage />}
      />
      <Route
        exact
        path={routes.ADD_RECIPE}
        component={() => <RecipeCreate />}
      />
      <Route
        path={routes.UPDATE_RECIPE}
        component={() => <RecipeUpdate />}
      />
      <Route 
        path={routes.VIEW_INGREDIENTS}
        component={() => <IngredientsView /> }
      />
      <Route 
        path={routes.EDIT_INGREDIENTS}
        component={() => <IngredientsEdit session={session} />}
      />
      <Route 
        path={routes.ADD_INGREDIENT}
        component={() => <IngredientCreate />}
      />
      <Route 
        path={routes.VIEW_INSTRUCTIONS}
        component={() => <InstructionsView /> }
      />
      
    </div>
  </Router>
);

export default withSession(App);
