import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import rootReducer from './reducers';
import createSagaMiddleware from '@redux-saga/core';
import rootSaga from './sagas/Index';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { initializeIcons } from '@fluentui/react/lib/Icons';

initializeIcons();

const root = ReactDOM.createRoot(document.getElementById('root'));
const sagaMiddleware = createSagaMiddleware();
let middleware=[sagaMiddleware];
export const store = createStore(rootReducer, applyMiddleware(...middleware));
store.subscribe(() => {
 // console.log(store.getState());
});
sagaMiddleware.run(rootSaga);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
