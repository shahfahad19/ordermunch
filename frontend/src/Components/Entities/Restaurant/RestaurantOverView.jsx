import React from 'react';
import RestaurantStats from './RestaurantStats';
import ItemsList from '../Item/ItemsList';
import { useOutletContext } from 'react-router-dom';
import { SpinnerWithText } from '../../Utils/Spinner';
import OrderList from '../Order/OrderList';
import EditRestaurantBtn from './Controllers/EditRestaurantBtn';
import DeleteRestaurantBtn from './Controllers/DeleteRestaurantBtn';

const RestaurantOverView = () => {
    // getting restaurant from outlet
    const [data, setData] = useOutletContext();
    return (
        <>
            {!data && <SpinnerWithText>Loading</SpinnerWithText>}
            {data && (
                <>
                    <div className='ml-2 p-2 flex items-center'>
                        <img src={data.restaurant.image} className='w-28' />
                        <div className='flex flex-1'>
                            <div className='flex-1'>
                                <div className='text-4xl font-bold sm:text-5xl ml-5 sm:font-extrabold'>
                                    {data.restaurant.name}
                                </div>
                                <p className='text-sm ml-5 p-2'>{(data && data.restaurant.description) || ' '}</p>
                            </div>
                            <div className='flex flex-col justify-center items-center space-y-2 p-2'>
                                <EditRestaurantBtn resData={data} setData={setData} />
                                <DeleteRestaurantBtn />
                            </div>
                        </div>
                    </div>
                    <br />
                    <RestaurantStats data={data} />
                    <ItemsList />
                    <OrderList limit={5} />
                </>
            )}
        </>
    );
};

export default RestaurantOverView;
