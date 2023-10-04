import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SpinnerWithText } from '../../Utils/Spinner';
import OrderList from '../Order/OrderList';
import CustomerStats from './CustomerStats';
import CustomerInfo from './CustomerInfo';

const CustomerOverview = () => {
    // getting item from outlet
    const [data] = useOutletContext();
    return (
        <>
            {!data && <SpinnerWithText>Loading</SpinnerWithText>}
            {data && (
                <>
                    <CustomerStats data={data} />

                    <CustomerInfo customer={data.customer} />

                    <OrderList limit={5} />
                </>
            )}
        </>
    );
};

export default CustomerOverview;
