import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
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
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: 'white',
    cursor: 'pointer'
  }
}));

const Navigation = ({ session }) => {
  const classes = useStyles();
  return (
    <div className={classes}>
      <AppBar>
        <Toolbar>
          <Link to={routes.LANDING} className={classes.title}>
            <Typography variant="h6">QR^2</Typography>
          </Link>
          <Typography>
            {session && session.me ? (
              <NavigationAuth session={session} />
            ) : (
              <NavigationNonAuth />
            )}
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </div>
  );
};

const NavigationAuth = ({ session }) => {
  return (
    <>
      {session.me.username}
      <SignOutButton />
    </>
  );
};

const NavigationNonAuth = () => {
  return (
    <Link to={routes.SIGN_IN}>
      <Button bgcolor="contrastText">Sign In</Button>
    </Link>
  );
};

export default Navigation;
