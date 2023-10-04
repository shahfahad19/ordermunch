import React, { useContext } from 'react';
import AppContext from '../AppContext';

const SettingSection = () => {
    const ctx = useContext(AppContext);
    return (
        <>
            <li className='px-5 hidden md:block'>
                <div className='flex flex-row items-center mt-5 h-8'>
                    <div className='text-sm font-light tracking-wide text-gray-400 uppercase'>Settings</div>
                </div>
            </li>
            <li onClick={ctx.logout}>
                <span className='relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6'>
                    <span className='inline-flex justify-center items-center ml-4'>
                        <svg
                            className='w-5 h-5'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                            ></path>
                        </svg>
                    </span>
                    <span className='ml-2 text-sm tracking-wide truncate'>Logout</span>
                </span>
            </li>
        </>
    );
};

export default SettingSection;
