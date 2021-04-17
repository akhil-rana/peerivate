// import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import Header from './components/header';
import ConnectPage from './containers/connect-page';

function App() {
  return (
    <BrowserRouter >
      <div className='App'>
        <Header></Header>
        <Switch>
          <Route path='/'>
            <ConnectPage />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
