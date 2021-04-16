import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import Header from './components/header';
import ConnectPage from './containers/connect-page';

function App() {
  return (
    <HashRouter basename={process.env.PUBLIC_URL}>
      <div className='App'>
        <Header></Header>
        <Switch>
          <Route path='/connect'>
            <ConnectPage />
          </Route>
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;
