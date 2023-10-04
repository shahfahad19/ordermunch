import React, { useContext } from 'react';
import AppContext from './AppContext';
import Login from './Auth/Login';
import { Outlet } from 'react-router-dom';

const Welcome = () => {
    const ctx = useContext(AppContext);
    console.log(ctx.isLoggedIn);
    return (
        <>
            {/* Showing loading when user login is being checked */}
            {ctx.isLoggedIn === 'wait' && (
                <div className='flex items-center flex-col justify-center h-screen'>
                    <div className='font-semibold text-lg animate-pulse'>
                        <span className='text-blue-500'>order</span>
                        <span className='text-pink-500'>munch</span>
                    </div>
                </div>
            )}

            {/* If not logged in, render Login component*/}
            {!ctx.isLoggedIn && <Login />}

            {/* If logged in, render component from router  in outlet*/}
            {ctx.isLoggedIn === true && <Outlet />}
        </>
    );
};

export default Welcome;
