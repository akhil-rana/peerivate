import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import Header from './components/header';
import ConnectPage from './containers/connect-page';

function App() {
  return (
    <div className='App'>
      <Header></Header>
      <BrowserRouter>
        <Switch>
          <Route path='/connect'>
            <ConnectPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
