import React from 'react';
import Sidebar from './Sidebars/MainSidebar';
import { Outlet } from 'react-router-dom';
import UpdateProfile from './Auth/UpdateProfile';

const MainScreen = () => {
    return (
        <div>
            <div className='min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white text-black'>
                <Sidebar />
                <div className='flex w-full items-center text-white justify-between pl-3 h-14 bg-blue-600 border-none'>
                    <div></div>
                    <p className='font-bold ml-14'>Dashboard</p>
                    <UpdateProfile />
                </div>
                <div className='h-full ml-14 mb-10 md:ml-64'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MainScreen;
