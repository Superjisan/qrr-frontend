import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import * as routes from '../../constants/routes';
import SignOutButton from '../SignOut';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navigation = ({ session }) => (
  <div>
    {session && session.me ? (
      <NavigationAuth session={session} />
    ) : (
      <NavigationNonAuth />
    )}
  </div>
);

const NavigationAuth = ({ session }) => {
  const classes = useStyles();
  return (
    <div className={classes}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            QR^2
          </Typography>
          <SignOutButton />
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
};

const NavigationNonAuth = () => {
  const classes = useStyles();
  return (
    <div className={classes}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            QR^2
          </Typography>
          <Typography>
            <Button color="primary.contrastText" href={`${routes.SIGN_IN}`}>Sign In</Button>
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
};

export default Navigation;
