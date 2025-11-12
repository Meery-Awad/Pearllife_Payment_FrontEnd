import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers/index';
import App from './App'
import './index.css'


const root = ReactDOM.createRoot(document.getElementById('root'));

const store = createStore(reducers);

root.render(

    <Provider store={store}>
      <App />
    </Provider>
);



// measure and report performance
// reportWebVitals(console.log);
