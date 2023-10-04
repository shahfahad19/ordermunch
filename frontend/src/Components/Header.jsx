import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from './AppContext';

const Header = () => {
    const ctx = useContext(AppContext);

    const logout = () => {
        ctx.logout();
        ctx.navigate('/');
    };

    return (
        <>
            <div className='navbar shadow-md mb-2.5'>
                <div className='navbar-start'>
                    <Link to='/' className='navbar-item font-medium'>
                        <p className='font-bold'>
                            <span className='text-purple-600'>order</span>
                            <span className='text-pink-500'>munch</span>
                        </p>
                    </Link>
                </div>
                <div className='navbar-end'>
                    {ctx.isLoggedIn === true && (
                        <>
                            <div className='navbar-item'>
                                <Link to={'/'} className='text-sm' onClick={logout}>
                                    Logout
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Header;
