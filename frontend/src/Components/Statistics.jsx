import React from 'react';

const Statistics = ({ data }) => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 p-4 gap-4'>
            {/* Number Of Restaurants */}
            <div className='bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group'>
                <div className='flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12'>
                    <svg
                        width={30}
                        height={30}
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        stroke='none'
                        className='strokeCurrent text-blue-800 transform transition-transform duration-500 ease-in-out'
                    >
                        <path d='M21 13.2422V20H22V22H2V20H3V13.2422C1.79401 12.435 1 11.0602 1 9.5C1 8.67286 1.22443 7.87621 1.63322 7.19746L4.3453 2.5C4.52393 2.1906 4.85406 2 5.21132 2H18.7887C19.1459 2 19.4761 2.1906 19.6547 2.5L22.3575 7.18172C22.7756 7.87621 23 8.67286 23 9.5C23 11.0602 22.206 12.435 21 13.2422ZM19 13.9725C18.8358 13.9907 18.669 14 18.5 14C17.2409 14 16.0789 13.478 15.25 12.6132C14.4211 13.478 13.2591 14 12 14C10.7409 14 9.5789 13.478 8.75 12.6132C7.9211 13.478 6.75911 14 5.5 14C5.331 14 5.16417 13.9907 5 13.9725V20H19V13.9725ZM5.78865 4L3.35598 8.21321C3.12409 8.59843 3 9.0389 3 9.5C3 10.8807 4.11929 12 5.5 12C6.53096 12 7.44467 11.3703 7.82179 10.4295C8.1574 9.59223 9.3426 9.59223 9.67821 10.4295C10.0553 11.3703 10.969 12 12 12C13.031 12 13.9447 11.3703 14.3218 10.4295C14.6574 9.59223 15.8426 9.59223 16.1782 10.4295C16.5553 11.3703 17.469 12 18.5 12C19.8807 12 21 10.8807 21 9.5C21 9.0389 20.8759 8.59843 20.6347 8.19746L18.2113 4H5.78865Z'></path>
                    </svg>
                </div>
                <div className='text-right'>
                    <p className='text-2xl'>{data ? data.restaurants : '...'}</p>
                    <p>Restaurants</p>
                </div>
            </div>

            {/* Number of items in all restaurants */}
            <div className='bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group'>
                <div className='flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12'>
                    <svg
                        width={30}
                        height={30}
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        stroke='none'
                        className='strokeCurrent text-blue-800 transform transition-transform duration-500 ease-in-out'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1}
                            d='M14.2683 12.1466L13.4147 13.0002L20.4858 20.0712L19.0716 21.4854L12.0005 14.4144L4.92946 21.4854L3.51525 20.0712L12.854 10.7324C12.2664 9.27549 12.8738 7.17715 14.4754 5.57554C16.428 3.62292 19.119 3.14805 20.4858 4.51488C21.8526 5.88172 21.3778 8.57267 19.4251 10.5253C17.8235 12.1269 15.7252 12.7343 14.2683 12.1466ZM4.22235 3.80777L10.9399 10.5253L8.11144 13.3537L4.22235 9.46463C2.66026 7.90253 2.66026 5.36987 4.22235 3.80777ZM18.0109 9.11107C19.2682 7.85386 19.5274 6.38488 19.0716 5.92909C18.6158 5.47331 17.1468 5.73254 15.8896 6.98975C14.6324 8.24697 14.3732 9.71595 14.829 10.1717C15.2847 10.6275 16.7537 10.3683 18.0109 9.11107Z'
                        />
                    </svg>
                </div>
                <div className='text-right'>
                    <p className='text-2xl'>{data ? data.items : '...'}</p>
                    <p>Items</p>
                </div>
            </div>

            {/* Number of items sold */}
            <div className='bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group'>
                <div className='flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12'>
                    <svg
                        width={30}
                        height={30}
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='strokeCurrent text-blue-800 transform transition-transform duration-500 ease-in-out'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                        />
                    </svg>
                </div>
                <div className='text-right'>
                    <p className='text-2xl'>{data ? data.sales : '...'}</p>
                    <p>Sales</p>
                </div>
            </div>

            {/* Amount */}
            <div className='bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group'>
                <div className='flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12'>
                    <svg
                        width={30}
                        height={30}
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        stroke='none'
                        className='strokeCurrent text-blue-800 transform transition-transform duration-500 ease-in-out'
                    >
                        <path d='M12.0049 22.0029C6.48204 22.0029 2.00488 17.5258 2.00488 12.0029C2.00488 6.48008 6.48204 2.00293 12.0049 2.00293C17.5277 2.00293 22.0049 6.48008 22.0049 12.0029C22.0049 17.5258 17.5277 22.0029 12.0049 22.0029ZM12.0049 20.0029C16.4232 20.0029 20.0049 16.4212 20.0049 12.0029C20.0049 7.58465 16.4232 4.00293 12.0049 4.00293C7.5866 4.00293 4.00488 7.58465 4.00488 12.0029C4.00488 16.4212 7.5866 20.0029 12.0049 20.0029ZM8.50488 14.0029H14.0049C14.281 14.0029 14.5049 13.7791 14.5049 13.5029C14.5049 13.2268 14.281 13.0029 14.0049 13.0029H10.0049C8.62417 13.0029 7.50488 11.8836 7.50488 10.5029C7.50488 9.12222 8.62417 8.00293 10.0049 8.00293H11.0049V6.00293H13.0049V8.00293H15.5049V10.0029H10.0049C9.72874 10.0029 9.50488 10.2268 9.50488 10.5029C9.50488 10.7791 9.72874 11.0029 10.0049 11.0029H14.0049C15.3856 11.0029 16.5049 12.1222 16.5049 13.5029C16.5049 14.8836 15.3856 16.0029 14.0049 16.0029H13.0049V18.0029H11.0049V16.0029H8.50488V14.0029Z'></path>
                    </svg>
                </div>
                <div className='text-right'>
                    <p className='text-2xl'>{data ? 'MYR ' + data.amount : '...'}</p>
                    <p>Earned</p>
                </div>
            </div>

            {/* Customer registered */}
            <div className='bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group'>
                <div className='flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12'>
                    <svg
                        width={30}
                        height={30}
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='strokeCurrent text-blue-800 transform transition-transform duration-500 ease-in-out'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                        />
                    </svg>
                </div>
                <div className='text-right'>
                    <p className='text-2xl'>{data ? data.customers : '...'}</p>
                    <p>Customers</p>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
