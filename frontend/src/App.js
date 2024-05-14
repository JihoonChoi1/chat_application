import './App.css';
import { Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";
import SignUpPage from "./Pages/SignUpPage";

function App() {
  return (
    <div className="App">
      <Route exact path="/" component={Homepage} />
      <Route path="/signup" component = {SignUpPage} />
      <Route path="/chats" component={ ChatPage } />
    </div>
  );
}

export default App;
