import './App.css';
import getGoogleOAuthURL from './utils/getGoogleUrl';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <a href={getGoogleOAuthURL()}>Google Login</a>
      </header>
    </div>
  );
}

export default App;
