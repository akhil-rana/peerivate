import { BrowserRouter, Route } from 'react-router-dom';
import './App.scss';
// import Header from './components/header';
import CallPage from './containers/callPage';
import ConnectPage from './containers/connect-page';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Route exact path='/'>
          <ConnectPage />
        </Route>
        <Route path='/connect/:type/:id'>
          <CallPage />
        </Route>
      </div>
    </BrowserRouter>
  );
}

export default App;
