import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../AppContext';
import axios from 'axios';
import AddRestaurantBtn from './Controllers/AddRestaurantBtn';
import { SpinnerWithText } from '../../Utils/Spinner';
import { Link } from 'react-router-dom';
import RestaurantCard from './RestaurantCard';

const RestaurantList = (props) => {
    const ctx = useContext(AppContext);

    // Array for restaurants
    const [restaurants, setRestaurants] = useState();

    // Error
    const [error, setError] = useState();

    // Object for new restaurant added, (when changed, it will trigger useEffect to refresh restaurants)
    const [newRestaurant, setNewRestaurant] = useState({});
    const limit = props.limit || 30;

    // Current page (set to 1 by default)
    const [currentPage, setPage] = useState(1);

    // Total pages (set to 1 by default)
    const [totalPages, setTotalPages] = useState(1);

    // Total restaurants in database
    const [restaurantCount, setRestaurantCount] = useState(0);

    useEffect(() => {
        // emptying restaurants array
        setRestaurants();
        axios
            .get(`${ctx.baseURL}/restaurants?sort=name&limit=${limit}&page=${currentPage}`, ctx.headers)
            .then((response) => {
                // setting restaurants
                setRestaurants(response.data.restaurants);

                // Getting total pages
                setTotalPages(response.data.pages);

                // setting restaurant count
                setRestaurantCount(response.data.count);

                // if no restaurants found, show error
                if (response.data.restaurants.length === 0) {
                    setError('No restaurants found');
                }
            })
            .catch((error) => {
                // if something went wrong, show error
                setError(ctx.computeError(error));
            });

        // useEffect will be triggered when new restaurant is added or page is changed
    }, [newRestaurant, currentPage]);

    // go to next page
    const nextPage = () => {
        setPage(currentPage + 1);
    };

    // go to previous page
    const previousPage = () => {
        setPage(currentPage - 1);
    };

    return (
        <div className='mt-4 mx-4'>
            <div className='flex justify-between items-center mb-2'>
                <div className='font-semibold text-neutral'>Restaurant List</div>
                <br />
                <AddRestaurantBtn setNewRestaurant={setNewRestaurant} />
            </div>

            {/* showing loading when there is no error and restaurants are not loaded */}
            {!restaurants && !error && <SpinnerWithText>Loading</SpinnerWithText>}

            {/* Showing error incase something goes wrong */}
            {error && <div className='text-error text-center'>{error}</div>}

            {/* showing restaurant count */}
            {restaurants && (
                <p className='text-sm text-content1 mb-2'>
                    {restaurantCount} total restaurant{restaurantCount > 1 ? 's' : ''}
                </p>
            )}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2'>
                {/* if restaurants are loaded, show restaurants cards */}
                {restaurants &&
                    restaurants.map((restaurant, i) => {
                        return (
                            <RestaurantCard
                                key={i}
                                id={restaurant._id}
                                name={restaurant.name}
                                image={restaurant.image}
                            />
                        );
                    })}
            </div>

            {/* If limit is set to 5, it means list is loaded from dashboard, and restaurants are loaded then show  the see all button, which will navigate the user to /restaurants page */}
            {restaurants && !error && limit === 5 && (
                <div className='mt-2'>
                    <Link className='text-primary underline' to={'/restaurants'}>
                        See all restaurants
                    </Link>
                </div>
            )}

            <div className='text-error text-center'>{error}</div>
            {/* If limit is not 5 (which will mean the list is rendered in dashboard) and restaurants are loaded and total pages are more than 1, then show next and previous buttons */}
            {limit && limit !== 5 && restaurants && totalPages > 1 && (
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
            {restaurants && limit !== 5 && (
                <p className='text-center text-sm p-2'>
                    Page {currentPage} of {totalPages}
                </p>
            )}
        </div>
    );
};

export default RestaurantList;
