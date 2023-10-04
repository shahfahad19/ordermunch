import React from 'react';
import { Link, useParams } from 'react-router-dom';

const ItemCard = ({ item }) => {
    // Getting params to get item id
    const params = useParams();

    return (
        <div className='w-40 sm:w-44 inline-block m-2 shadow rounded-lg hover:scale-105 hover:shadow-lg ease-in-out transition-all'>
            <Link to={'/item/' + item._id}>
                <div className='relative h-36 w-full'>
                    <img className='h-36 w-full object-cover rounded' src={item.image} />

                    {/* if url has restaurant id, then don't show the restaurant name
                    because user will know which restaurant it is
                    if no restaurant id is present show resturant name*/}
                    {!params.restaurantId && (
                        <div className='absolute top-0 right-0 m-0.5 text-xs text-center font-semibold text-white px-2 py-0.5 bg-red-600 rounded-lg'>
                            {item.restaurant.name}
                        </div>
                    )}
                </div>
                <div className='p-2'>
                    <div className='font-bold mt-2 text-content1 text-sm truncate'>{item.name}</div>
                    <div className='text-green-700 text-sm font-bold py-1'>MYR {item.price}</div>

                    <div className='text-sm flex justify-between'>
                        <div className='flex items-center justify-end'>
                            {item.rating === 'Not rated yet' ? '0' : item.rating ? item.rating : 0}
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='w-4 h-4 mx-1 mb-.5'
                                viewBox='0 0 24 24'
                                fill='#FFD700'
                            >
                                <path d='M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z'></path>
                            </svg>
                        </div>
                        ({item.rated_by} reviews)
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ItemCard;
