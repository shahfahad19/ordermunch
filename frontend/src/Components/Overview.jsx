import React, { useContext, useEffect, useState } from 'react';
import Statistics from './Statistics';
import RestaurantList from './Entities/Restaurant/RestaurantList';
import OrderList from './Entities/Order/OrderList';
import axios from 'axios';
import AppContext from './AppContext';
import CustomerList from './Entities/Customer/CustomerList';

const Overview = () => {
    //context
    const ctx = useContext(AppContext);

    // overview data object
    const [data, setData] = useState();

    useEffect(() => {
        axios.get(`${ctx.baseURL}/overview`, ctx.headers).then((response) => {
            setData(response.data);
        });
    }, []);
    return (
        <>
            <Statistics data={data} />

            <RestaurantList limit={5} />

            <OrderList limit={5} />

            <CustomerList limit={5} />
        </>
    );
};

export default Overview;
