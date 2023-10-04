import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../AppContext';
import axios from 'axios';
import { SpinnerWithText } from '../../Utils/Spinner';
import OrderInfo from './OrderInfo';
import { Link, useParams } from 'react-router-dom';
import UpdateOrderBtn from './UpdateOrderBtn';

const OrderList = (props) => {
    const params = useParams();

    // Context
    const ctx = useContext(AppContext);

    // Array for orders
    const [orders, setOrders] = useState();

    // Variable for error
    const [error, setError] = useState();

    // If limit is not set, set it to 30
    const limit = props.limit || 30;

    // Modal handler to decide to show modal or not
    const [showOrder, setShowOrder] = useState(false);

    // Current order id (will be set when an order is clicked)
    const [orderId, setOrderId] = useState('');

    // Current page (set to 1 by default)
    const [currentPage, setPage] = useState(1);

    // Total pages (set to 1 by default)
    const [totalPages, setTotalPages] = useState(1);

    // Total orders
    const [orderCount, setOrderCount] = useState(0);

    // Toggling modal
    const showOrderHandler = () => setShowOrder(!showOrder);

    // use state to check if an order is updated
    const [orderUpdated, setUpdatedOrder] = useState();

    useEffect(() => {
        // Empty orders array
        setOrders();

        // set url
        let url = `${ctx.baseURL}/orders?sort=-date,amount&limit=${limit}&page=${currentPage}`;

        // if restaurant Id is set, then change url to get only restaurant orders
        if (params.restaurantId) {
            url = `${ctx.baseURL}/orders/restaurant/${params.restaurantId}?limit=${limit}&page=${currentPage}`;
        }

        // if item Id is set, then get only orders for that item
        else if (params.itemId) {
            url = `${ctx.baseURL}/orders/item/${params.itemId}?limit=${limit}&page=${currentPage}`;
        }

        // else if customer Id is set, then get only orders for that customer only
        else if (params.customerId) {
            url = `${ctx.baseURL}/orders?sort=-date,amount&limit=${limit}&page=${currentPage}&placed_by=${params.customerId}`;
        }

        // Getting orders
        axios
            .get(url, ctx.headers)
            .then((response) => {
                // Getting total pages
                setTotalPages(response.data.pages);

                // Getting total orders
                setOrderCount(response.data.count);

                // If no orders found, show error
                if (response.data.orders.length === 0) {
                    setError('No orders found');
                } else {
                    // Setting orders array
                    setOrders(response.data.orders);
                }
            })
            .catch((error) => {
                // Show error if something went wrong
                setError(ctx.computeError(error));
            });
        // Request will be executed again if current page changed
    }, [currentPage, orderUpdated]);

    // Showing order info in modal
    const openOrder = (orderId) => {
        // Set order id
        setOrderId(orderId);

        // set show order to true
        setShowOrder(true);
    };

    // go to next page
    const nextPage = () => {
        setPage(currentPage + 1);
    };

    // go to previous page
    const previousPage = () => {
        setPage(currentPage - 1);
    };

    return (
        <>
            <div className='mt-4 mx-4'>
                <div className='flex justify-between items-center mb-2'>
                    <div className='font-semibold text-neutral'>Order List</div>
                </div>
                {/* Loading while orders are not loaded */}
                {!orders && !error && <SpinnerWithText>Loading</SpinnerWithText>}

                {/* Showing error incase something goes wrong */}
                {error && <div className='text-error text-center'>{error}</div>}

                {/* Order list */}
                {orders && (
                    <>
                        <p className='text-sm text-content1 mb-2'>
                            {orderCount} total order{orderCount > 1 ? 's' : ''}
                        </p>
                        <div className='w-full overflow-x-auto'>
                            <table className='table table-hover table-compact font-medium'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Date</th>
                                        <th>Placed by</th>
                                        <th>Items</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, i) => {
                                        return (
                                            // when row is clicked, open modal
                                            <tr key={i} className='cursor-pointer'>
                                                {/* Setting serial number */}
                                                <td onClick={() => openOrder(order._id)}>
                                                    {(currentPage - 1) * limit + (i + 1)}
                                                </td>
                                                <td onClick={() => openOrder(order._id)}>
                                                    {/* Formatting date */}
                                                    {new Date(order.date).toLocaleString('en-PK', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: '2-digit',
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}
                                                </td>
                                                {/* Showing rest of order info */}
                                                <td onClick={() => openOrder(order._id)}>{order.placed_by.name}</td>
                                                <td onClick={() => openOrder(order._id)}>{order.items_count}</td>
                                                <td onClick={() => openOrder(order._id)}>MYR {order.amount}</td>
                                                {order.status !== 'Completed' && (
                                                    <td onClick={() => openOrder(order._id)}>
                                                        <p
                                                            className={`px-2 py-1 text-center rounded ${
                                                                order.status === 'Pending'
                                                                    ? 'bg-yellow-500 text-white'
                                                                    : order.status === 'Confirmed'
                                                                    ? 'bg-green-500 text-white'
                                                                    : order.status === 'Preparing'
                                                                    ? 'bg-blue-500 text-white'
                                                                    : order.status === 'Dispatched'
                                                                    ? 'bg-indigo-500 text-white'
                                                                    : order.status === 'Completed'
                                                                    ? 'bg-green-700 text-white'
                                                                    : order.status === 'Cancelled'
                                                                    ? 'bg-red-500 text-white'
                                                                    : 'bg-gray-400 text-gray-800'
                                                            }`}
                                                        >
                                                            {order.status}
                                                        </p>
                                                    </td>
                                                )}
                                                <td>
                                                    <UpdateOrderBtn order={order} updateOrder={setUpdatedOrder} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* If limit is not 5 (which will mean the list is rendered in dashboard) and orders are loaded and total pages are more than 1, then show next and previous buttons */}
            {limit && limit !== 5 && orders && totalPages > 1 && (
                <div className='flex justify-center m-3'>
                    <button className='btn btn-sm btn-primary m-1' onClick={previousPage} disabled={currentPage === 1}>
                        Prevous
                    </button>

                    <button
                        className='btn btn-sm btn-primary m-1'
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Showing current page of total pages */}
            {orders && limit !== 5 && (
                <p className='text-center text-sm p-2'>
                    Page {currentPage} of {totalPages}
                </p>
            )}

            {/* If limit is set to 5, it means list is loaded from dashboard, and orders are loaded then show  the see all button, which will navigate the user to /orders page */}
            {orders && !error && limit && limit === 5 && (
                <div className='mt-2'>
                    <Link className='p-4 text-primary underline' to={'./orders'}>
                        See all orders
                    </Link>
                </div>
            )}

            {/* Modal for showing order info */}
            {showOrder && <OrderInfo showOrderHandler={showOrderHandler} id={orderId} />}
        </>
    );
};

export default OrderList;
