import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import { Provider } from "react-redux";
import reducers from "./reducer"
import thunk from "redux-thunk";


import { createStore, applyMiddleware, compose } from "redux";


const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
