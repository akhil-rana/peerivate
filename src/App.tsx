import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import Header from './components/header';
import ConnectPage from './containers/connect-page';

function App() {
  return (
    <div className='App'>
      <Header></Header>
      <HashRouter>
        <Switch>
          <Route path='/connect'>
            <ConnectPage />
          </Route>
        </Switch>
      </HashRouter>
    </div>
  );
}

export default App;
