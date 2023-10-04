import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../AppContext';
import axios from 'axios';
import ItemCard from './ItemCard';
import { useParams } from 'react-router-dom';
import { SpinnerWithText } from '../../Utils/Spinner';
import AddItemBtn from './Controllers/AddItemBtn';

const ItemsList = () => {
    // Context
    const ctx = useContext(AppContext);

    // Array of items
    const [items, setItems] = useState();

    // Error
    const [error, setError] = useState();

    // UseState for new Item added, (will be used to refresh the list when an item is added)
    const [newItem, setNewItem] = useState({});

    // params to get restaurant id
    const params = useParams();

    // checking for restaurant id in url (if its present then only items for that restaurant will be loaded)
    const restaurantId = params.restaurantId;

    useEffect(() => {
        axios

            // setting url based on wether requesting all items or of a restaurant
            .get(
                `${ctx.baseURL}/items?sort=name${restaurantId ? `&restaurant=${params.restaurantId}` : ''}`,
                ctx.headers
            )
            .then((response) => {
                // set items in variable
                setItems(response.data.items);

                // if no items available, show this error
                if (response.data.items.length === 0) {
                    setError('No items found');
                }
            })
            .catch((error) => {
                // setting error in case something goes wrong
                setError(ctx.computeError(error));
            });
    }, [newItem]);

    return (
        <div className='mt-4 mx-4'>
            <div className='flex justify-between items-center'>
                <div className='font-semibold text-neutral'>Item List</div>

                {/* button for adding new items */}
                <AddItemBtn setNewItem={setNewItem} />
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                {/* Show items when loaded */}
                {items &&
                    items.map((item, i) => {
                        return <ItemCard key={i} item={item} />;
                    })}
            </div>

            {/* If items are not loaded and there is no error, show loading */}
            {!items && !error && <SpinnerWithText>Loading</SpinnerWithText>}

            {/* Showing error */}
            {error && <div className='text-error text-center'>{error}</div>}
        </div>
    );
};

export default ItemsList;
