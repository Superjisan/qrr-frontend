import React from 'react';

import withSession from '../Session/withSession';
import Recipes from "../Recipe/Recipes/"


const Landing = ({ session }) => (
  <div>
    <h2>Recipes</h2>
    <Recipes session={session} />
  </div>
);

export default withSession(Landing);
