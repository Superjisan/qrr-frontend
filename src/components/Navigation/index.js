import React from 'react';
// import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
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
            News
          </Typography>
          <SignOutButton />
        </Toolbar>
      </AppBar>
    </div>
  );
  //   <ul>
  //     <li>
  //       <Link to={routes.LANDING}>Landing</Link>
  //     </li>
  //     <li>
  //       <Link to={routes.ACCOUNT}>Account ({session.me.username})</Link>
  //     </li>
  //     {session &&
  //       session.me &&
  //       session.me.role === 'ADMIN' && (
  //         <li>
  //           <Link to={routes.ADMIN}>Admin</Link>
  //         </li>
  //       )}
  //     <li>
  //       <SignOutButton />
  //     </li>
  //   </ul>
  // )
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
            <Link href={`${routes.SIGN_IN}`}>
              <Button>Sign In</Button>
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navigation;
