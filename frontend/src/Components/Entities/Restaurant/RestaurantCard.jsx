import React from 'react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ id, image, name }) => {
    return (
        <Link to={'/restaurant/' + id}>
            <div className='w-32 p-4 inline-block m-2 shadow rounded-lg transition-all ease-out hover:scale-105 hover:shadow-lg'>
                <img className='w-full h-28 object-scale-down' src={image} />
                <div className='font-medium mt-2 text-sm text-center truncate'>{name}</div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
