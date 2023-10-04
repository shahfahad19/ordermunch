import React from 'react';
import { AppContextProvider } from './Components/AppContext';
import { Outlet } from 'react-router-dom';

const App = () => {
    return (
        <AppContextProvider>
            <Outlet></Outlet>
        </AppContextProvider>
    );
};

export default App;
