import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AppContext from '../../AppContext';
import { Outlet, useParams } from 'react-router-dom';
import ItemSidebar from '../../Sidebars/ItemSidebar';

const ViewItem = () => {
    // data object
    const [data, setData] = useState();

    // app context
    const ctx = useContext(AppContext);

    // url params
    const params = useParams();

    // useState for error
    const [error, setError] = useState();

    // getti
    useEffect(() => {
        axios
            .get(`${ctx.baseURL}/items/${params.itemId}`, ctx.headers)
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                setError(ctx.computeError(error));
            });
    }, []);
    return (
        <div>
            <div className='min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-white text-black'>
                <ItemSidebar />
                <div className='flex items-center text-white justify-start md:justify-center pl-3 w-full h-14 bg-blue-600 bitem-none'>
                    <p className='font-bold ml-14'>{data && data.item.name}</p>
                </div>
                <div className='h-full ml-14 mb-10 md:ml-64'>
                    {error && <div className='text-error text-center mt-12'>{error}</div>}

                    <Outlet context={[data, setData]} />
                </div>
            </div>
        </div>
    );
};

export default ViewItem;
