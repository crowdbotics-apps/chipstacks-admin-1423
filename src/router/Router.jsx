import React from 'react';
import cn from 'classnames';
import { Link, Switch, Route, Redirect } from 'react-router-dom';

import UsersListContainer from '../containers/Users/List';
import UsersEditContainer from '../containers/Users/Edit';
import UsersAddContainer from '../containers/Users/Add';

import GamesListContainer from '../containers/Games/List';

import GamesAddContainer from '../containers/Games/Add';

import styles from './Router.module.scss';

class Router extends React.Component {
  render() {
    let selectedMenuItem = 0;

    if (window.location.pathname.startsWith('/users')) {
      selectedMenuItem = 0;
    } else {
      selectedMenuItem = 0; // default
    }

    return (
      <div className={styles.wrapper}>
        <header>Chipstacks</header>
        <div className={styles.container}>
          <div className={styles.sidebar}>
            <Link
              to='/users'
              className={cn(
                styles.menuitem,
                selectedMenuItem === 0 && styles['menuitem-selected']
              )}
            >
              Users
            </Link>
            <Link
              to='/games'
              className={cn(
                styles.menuitem,
                selectedMenuItem === 0 && styles['menuitem-selected']
              )}
            >
              Games
            </Link>
          </div>
          <div className={styles.content}>
            <Switch>
              <Route path='/users/edit/:id' component={UsersEditContainer} />
              <Route path='/users/add' component={UsersAddContainer} />
              <Route path='/users' component={UsersListContainer} />

              <Route path='/games/edit/:id' component={UsersEditContainer} />
              <Route path='/games/add' component={GamesAddContainer} />
              <Route path='/games' component={GamesListContainer} />

              <Redirect to='/users' />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default Router;
