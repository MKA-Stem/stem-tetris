import React from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';

import styles from 'pages/App.css';

import Submitter from 'pages/Submitter.jsx';
import AdminAuth from 'pages/AdminAuth.jsx';
import About from 'pages/About.jsx';
import Leaderboard from 'pages/Leaderboard.jsx';

const NotFound = props => (
  <div>
    <h1>404: Page not found</h1>
    <p>Go back, or try another link maybe?</p>
  </div>
);

export default function App(props) {
  const sep = <span className={styles.navSep}>{String.fromCharCode('8226')}</span>;
  return (
    <div className={styles.page}>
      <Helmet defaultTitle="STEM Tetris" titleTemplate="%s - STEM Tetris">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <html lang="en" />
        <body className={styles.body} />
      </Helmet>
      <div className={styles.header}>
        <Link to="/" className={styles.title}>
          STEM Tetris
        </Link>
        <nav className={styles.navLinksContainer}>
          {[['/', 'Leaderboard'], ['/about', 'About']].map((e, i, arr) => {
            const link = (
              <Link to={e[0]} className={styles.navLink}>
                {e[1]}
              </Link>
            );
            return i == 0 ? (
              <span key={i}>{link}</span>
            ) : (
              <span key={i}>
                {sep}
                {link}
              </span>
            );
          })}
        </nav>
      </div>

      <Switch>
        <Route exact path="/" component={Leaderboard} />
        <Route path="/about" component={About} />
        <Route path="/admin/auth/:token" component={AdminAuth} />
        <Route path="/admin/submit" component={Submitter} />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
}
