import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SpinnerWithText } from '../../Utils/Spinner';
import OrderList from '../Order/OrderList';
import ItemStats from './ItemStats';
import EditItemBtn from './Controllers/EditItemBtn';
import DeleteItemBtn from './Controllers/DeleteItemBtn';

const ItemOverview = () => {
    // getting item from outlet
    const [data, setData] = useOutletContext();
    return (
        <>
            {!data && <SpinnerWithText>Loading</SpinnerWithText>}
            {data && (
                <>
                    <div className='ml-2 p-2 flex items-center'>
                        <img src={data.item.image} className='w-28' />
                        <div className='flex flex-1 flex-col sm:flex-row'>
                            <div className='flex-1 flex flex-col space-y-2'>
                                <div className='text-xl font-bold sm:text-3xl ml-5 sm:font-extrabold'>
                                    {data.item.name}
                                </div>
                                <p className='text-sm ml-5'>{(data && data.item.description) || ' '}</p>
                                <p className='text-sm ml-5 font-bold text-green-800'>
                                    Price: {data && 'MYR ' + data.item.price}
                                </p>
                            </div>
                            <div className='flex flex-col justify-center items-center space-y-2 p-2'>
                                <EditItemBtn itemData={data} setData={setData} />
                                <DeleteItemBtn />
                            </div>
                        </div>
                    </div>
                    <br />
                    <ItemStats data={data} />
                    <OrderList limit={5} />
                </>
            )}
        </>
    );
};

export default ItemOverview;
