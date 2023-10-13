import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../AppContext';
import axios from 'axios';
import { SpinnerWithText } from '../../Utils/Spinner';
import { Link, useParams } from 'react-router-dom';

const ReviewList = () => {
    const params = useParams();

    // Context
    const ctx = useContext(AppContext);

    // Array for reviews
    const [reviews, setReviews] = useState();

    // Variable for error
    const [error, setError] = useState();

    useEffect(() => {
        // Empty reviews array
        setReviews();

        // set url
        let url = `${ctx.baseURL}/reviews?sort=-date`;

        // if restaurant Id is set, then change url to get only restaurant reviews
        if (params.itemId) {
            url = `${ctx.baseURL}/reviews?item=${params.itemId}&sort=-date`;
        }

        // if item Id is set, then get only reviews for that item
        else if (params.orderId) {
            url = `${ctx.baseURL}/reviews?order=${params.orderId}&sort=-date`;
        }

        // else if customer Id is set, then get only reviews for that customer only
        else if (params.customerId) {
            url = `${ctx.baseURL}/reviews?posted_by=${params.customerId}&sort=-date,amount`;
        }

        // Getting reviews
        axios
            .get(url, ctx.headers)
            .then((response) => {
                // If no reviews found, show error
                if (response.data.reviews.length === 0) {
                    setError('No reviews found');
                } else {
                    // Setting reviews array
                    setReviews(response.data.reviews);
                }
            })
            .catch((error) => {
                // Show error if something went wrong
                setError(ctx.computeError(error));
            });
        // Request will be executed again if current page changed
    }, []);

    return (
        <>
            <div className='mt-4 mx-4'>
                <div className='flex justify-between items-center mb-2'>
                    <div className='font-semibold text-neutral'>Review List</div>
                </div>
                {/* Loading while reviews are not loaded */}
                {!reviews && !error && <SpinnerWithText>Loading</SpinnerWithText>}

                {/* Showing error incase something goes wrong */}
                {error && <div className='text-error text-center'>{error}</div>}

                {/* Review list */}
                {reviews && (
                    <>
                        <p className='text-sm text-content1 mb-2'>
                            {reviews.length} total review{reviews.length > 1 ? 's' : ''}
                        </p>
                        <div className='w-full overflow-x-auto'>
                            <table className='table table-hover table-compact font-medium'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        {!params.itemId && <th>Item</th>}
                                        <th>Rating</th>
                                        <th>Review</th>
                                        <th>Posted by</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((review, i) => {
                                        return (
                                            // when row is clicked, open modal
                                            <tr key={i} className='cursor-pointer'>
                                                {/* Setting serial number */}
                                                <td>{i + 1}</td>
                                                {!params.itemId && (
                                                    <td>
                                                        <Link className='underline' to={'/item/' + review.item._id}>
                                                            {review.item.name}
                                                        </Link>
                                                    </td>
                                                )}
                                                <td>{review.stars}</td>
                                                <td>{review.review}</td>
                                                <td>
                                                    <Link
                                                        className='underline'
                                                        to={`/customer/${review.posted_by._id}`}
                                                    >
                                                        {review.posted_by.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {/* Formatting date */}
                                                    {new Date(review.date).toLocaleString('en-PK', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: '2-digit',
                                                        hour: 'numeric',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}
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
        </>
    );
};

export default ReviewList;
