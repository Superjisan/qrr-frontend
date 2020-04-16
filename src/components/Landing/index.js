import React from 'react';

import withSession from '../Session/withSession';
import {Recipes} from "../Recipe/Recipes/"


const Landing = ({ session }) => (
  <div>
    <h2>Recipes</h2>
    <Recipes />
  </div>
);

export default withSession(Landing);
