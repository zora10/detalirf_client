import React, { createContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import App from './App';
import ItemStore from './store/itemStore'

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Context.Provider value={{
            catalogue: new ItemStore()
        }}>
            <App />
        </Context.Provider>
    </Router>
);