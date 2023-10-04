import React from 'react';

const RestaurantStats = ({ data }) => {
    return (
        <>
            <div className='font-semibold text-neutral ml-4'>Restaurant Stats</div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-4 gap-4'>
                <div className='bg-blue-500 shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-blue-600 text-white font-medium group'>
                    <div className='flex justify-center items-center w-14 h-14 bg-white rounded-full transition-all duration-300 transform group-hover:rotate-12'>
                        <svg
                            width={30}
                            height={30}
                            className='strokeCurrent text-blue-800 transform transition-transform duration-500 ease-in-out'
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
                    </div>
                    <div className='text-right'>
                        <p className='text-2xl'>{data && data.items}</p>
                        <p>Items</p>
                    </div>
                </div>
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
                        <p className='text-2xl'>{data && data.sales}</p>
                        <p>Orders</p>
                    </div>
                </div>
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
                        <p className='text-2xl'>MYR {data && data.amount}</p>
                        <p>Amount</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RestaurantStats;
