import React, { useContext, useEffect, useState } from 'react';
import { ModalCloseBtn, ModalTitle, ModalWrapper } from '../../Utils/Modal';
import axios from 'axios';
import AppContext from '../../AppContext';
import { SpinnerWithText } from '../../Utils/Spinner';
import { useParams } from 'react-router-dom';

// Getting showOrderHandler function and order id in props
const OrderInfo = ({ showOrderHandler, id }) => {
    // Getting app context
    const ctx = useContext(AppContext);

    // Order object
    const [order, setOrder] = useState();

    // Error message
    const [error, setError] = useState();

    // restaurant id
    const params = useParams();
    const restaurantId = params.restaurantId;

    useEffect(() => {
        // Get order details
        axios
            .get(`${ctx.baseURL}/orders/${id}`, ctx.headers)
            .then((response) => {
                // set order details
                setOrder(response.data.order);
            })
            .catch((error) => {
                // if something went wrong, set error
                setError(ctx.computeError(error));
            });
    }, []);

    return (
        // Modal
        <ModalWrapper closeHandler={showOrderHandler}>
            <ModalCloseBtn handler={showOrderHandler} />
            <ModalTitle>Order Info</ModalTitle>

            {/* show loading if there is no error and order is not loaded yet */}
            {!error && !order && <SpinnerWithText>Loading</SpinnerWithText>}

            {/* For width */}
            {!error && !order && <div className='w-44'></div>}

            {/* showing error if something went wrong */}
            {error && <div className='text-error p-5'>{error}</div>}

            {/* showing order details */}
            {order && (
                <div>
                    <div style={{ minWidth: '320px' }}>
                        <div className='p-2'>
                            <p className='text-center text-sm font-medium bg-backgroundSecondary'>Name</p>
                            <p className='text-sm mt-2'>{order.placed_by.name}</p>
                        </div>

                        <div className='p-2'>
                            <p className='text-center text-sm font-medium bg-backgroundSecondary'>Contact</p>
                            <p className='text-sm mt-2'>{order.placed_by.contact}</p>
                        </div>

                        <div className='p-2'>
                            <p className='text-center text-sm font-medium bg-backgroundSecondary'>Address</p>
                            <p className='text-sm mt-2'>{order.placed_by.address}</p>
                        </div>

                        <p className='text-center font-medium bg-backgroundSecondary mt-3'>Items List</p>

                        {order.items.map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <div className='border-t flex justify-between items-center'>
                                        <div className='flex items-center my-2'>
                                            <img
                                                src={item.item.image}
                                                className='w-20 h-20 rounded-xl mr-2 object-cover'
                                            />
                                            <span className='font-medium text-sm'>
                                                {item.item.name}
                                                {restaurantId && item.item.restaurant === restaurantId && (
                                                    <span className='text-sm text-error font-bold'> *</span>
                                                )}
                                            </span>
                                        </div>
                                        <p className='text-content2 text-right font-bold'>x {item.count}</p>

                                        <p className='text-content2 font-semibold'>MYR {item.item.price}</p>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                        {restaurantId && (
                            <p className='text-sm text-content2 font-semibold'>
                                <span className='text-error'>*</span>: Ordered items which are in this restaurant
                            </p>
                        )}
                        <div className='flex justify-between'>
                            <p className='font-semibold text-content1'>Amount</p>

                            <p className='text-green-800 text-right font-bold'>MYR {order.amount}</p>
                        </div>
                    </div>
                </div>
            )}
        </ModalWrapper>
    );
};

export default OrderInfo;
