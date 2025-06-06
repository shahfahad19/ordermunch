import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SettingSection from './SettingSection';

const RestaurantSidebar = () => {
    const [active, setActive] = useState('Dashboard');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const path = location.pathname;

        if (path.includes('/items')) {
            setActive('Items');
        } else if (path.includes('/orders')) {
            setActive('Orders');
        } else {
            setActive('Stats');
        }
    }, [location]);

    const openPage = (page) => {
        if (page === 'items') {
            setActive('Items');
        } else if (page === 'orders') {
            setActive('Orders');
        } else {
            setActive('Stats');
        }
        navigate(page, { replace: true });
    };

    return (
        <div className='fixed flex flex-col left-0 w-14 md:w-64 bg-blue-600 h-full text-white transition-all duration-300 border-none z-10 sidebar'>
            <div className='flex items-center justify-center text-xs md:text-base mt-4'>
                <p className='font-bold text-center tracking-wide truncate'>
                    <span className='text-white block md:inline'>order</span>
                    <span className='text-pink-300'>munch</span>
                </p>
            </div>
            <div className='overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow'>
                <ul className='flex flex-col py-4 space-y-1'>
                    <li className='px-5 hidden md:block'>
                        <div className='flex flex-row items-center h-8'>
                            <div className='text-sm font-light tracking-wide text-gray-400 uppercase'>Menu</div>
                        </div>
                    </li>
                    <li onClick={() => openPage('')}>
                        <span
                            className={`cursor-pointer relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6 ${
                                active === 'Stats'
                                    ? 'bg-backgroundSecondary text-blue-800 hover:text-white border-blue-500'
                                    : ''
                            }`}
                        >
                            <span className='inline-flex justify-center items-center ml-4'>
                                <svg
                                    className='w-5 h-5'
                                    fill='currentColor'
                                    stroke='none'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path d='M19 21.0001H5C4.44772 21.0001 4 20.5524 4 20.0001V11.0001L1 11.0001L11.3273 1.61162C11.7087 1.26488 12.2913 1.26488 12.6727 1.61162L23 11.0001L20 11.0001V20.0001C20 20.5524 19.5523 21.0001 19 21.0001ZM6 19.0001H18V9.15757L12 3.70302L6 9.15757V19.0001ZM9 10.0001H15V16.0001H9V10.0001ZM11 12.0001V14.0001H13V12.0001H11Z'></path>
                                </svg>
                            </span>
                            <span className='ml-2 text-sm tracking-wide truncate'>Stats</span>
                        </span>
                    </li>

                    <li onClick={() => openPage('items')}>
                        <span
                            className={`cursor-pointer relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6 ${
                                active === 'Items'
                                    ? 'bg-backgroundSecondary text-blue-800 hover:text-white border-blue-500'
                                    : ''
                            }`}
                        >
                            <span className='inline-flex justify-center items-center ml-4'>
                                <svg
                                    className='w-5 h-5'
                                    fill='currentColor'
                                    stroke='none'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={1}
                                        d='M14.2683 12.1466L13.4147 13.0002L20.4858 20.0712L19.0716 21.4854L12.0005 14.4144L4.92946 21.4854L3.51525 20.0712L12.854 10.7324C12.2664 9.27549 12.8738 7.17715 14.4754 5.57554C16.428 3.62292 19.119 3.14805 20.4858 4.51488C21.8526 5.88172 21.3778 8.57267 19.4251 10.5253C17.8235 12.1269 15.7252 12.7343 14.2683 12.1466ZM4.22235 3.80777L10.9399 10.5253L8.11144 13.3537L4.22235 9.46463C2.66026 7.90253 2.66026 5.36987 4.22235 3.80777ZM18.0109 9.11107C19.2682 7.85386 19.5274 6.38488 19.0716 5.92909C18.6158 5.47331 17.1468 5.73254 15.8896 6.98975C14.6324 8.24697 14.3732 9.71595 14.829 10.1717C15.2847 10.6275 16.7537 10.3683 18.0109 9.11107Z'
                                    />
                                </svg>
                            </span>
                            <span className='ml-2 text-sm tracking-wide truncate'>Items</span>
                        </span>
                    </li>

                    <li onClick={() => openPage('orders')}>
                        <span
                            className={`cursor-pointer relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-600 text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500 pr-6 ${
                                active === 'Orders'
                                    ? 'bg-backgroundSecondary text-blue-800 hover:text-white border-blue-500'
                                    : ''
                            }`}
                        >
                            <span className='inline-flex justify-center items-center ml-4'>
                                <svg
                                    className='w-5 h-5'
                                    fill='currentColor'
                                    stroke='none'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                >
                                    <path d='M4.00488 16V4H2.00488V2H5.00488C5.55717 2 6.00488 2.44772 6.00488 3V15H18.4433L20.4433 7H8.00488V5H21.7241C22.2764 5 22.7241 5.44772 22.7241 6C22.7241 6.08176 22.7141 6.16322 22.6942 6.24254L20.1942 16.2425C20.083 16.6877 19.683 17 19.2241 17H5.00488C4.4526 17 4.00488 16.5523 4.00488 16ZM6.00488 23C4.90031 23 4.00488 22.1046 4.00488 21C4.00488 19.8954 4.90031 19 6.00488 19C7.10945 19 8.00488 19.8954 8.00488 21C8.00488 22.1046 7.10945 23 6.00488 23ZM18.0049 23C16.9003 23 16.0049 22.1046 16.0049 21C16.0049 19.8954 16.9003 19 18.0049 19C19.1095 19 20.0049 19.8954 20.0049 21C20.0049 22.1046 19.1095 23 18.0049 23Z'></path>
                                </svg>
                            </span>
                            <span className='ml-2 text-sm tracking-wide truncate'>Orders</span>
                        </span>
                    </li>

                    <SettingSection />
                </ul>
            </div>
        </div>
    );
};

export default RestaurantSidebar;
