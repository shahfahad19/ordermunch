import React from 'react';

const OrderRow = () => {
    return (
        <tr className='bg-gray-50 hover:bg-gray-100 text-gray-700 '>
            <td className='px-4 py-3'>
                <div className='flex items-center text-sm'>
                    <div className='relative hidden w-8 h-8 mr-3 rounded-full md:block'>
                        <img
                            className='object-cover w-full h-full rounded-full'
                            src='https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&facepad=3&fit=facearea&s=707b9c33066bf8808c934c8ab394dff6'
                            alt=''
                            loading='lazy'
                        />
                        <div className='absolute inset-0 rounded-full shadow-inner' aria-hidden='true' />
                    </div>
                    <div>
                        <p className='font-semibold'>Jolina Angelie</p>
                        <p className='text-xs text-gray-600 '>Unemployed</p>
                    </div>
                </div>
            </td>
            <td className='px-4 py-3 text-sm'>$369.75</td>
            <td className='px-4 py-3 text-xs'>
                <span className='px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full'>
                    {' '}
                    Pending{' '}
                </span>
            </td>
            <td className='px-4 py-3 text-sm'>23-03-2021</td>
        </tr>
    );
};

export default OrderRow;
