import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../AppContext';
import axios from 'axios';
import { SpinnerWithText } from '../../Utils/Spinner';
import { Link } from 'react-router-dom';

const CustomerList = (props) => {
    // Context
    const ctx = useContext(AppContext);

    // Array for customers
    const [customers, setCustomers] = useState();

    // Variable for error
    const [error, setError] = useState();

    // If limit is not set, set it to 30
    const limit = props.limit || 30;

    // Modal handler to decide to show modal or not

    // Current customer id (will be set when an customer is clicked)

    // Current page (set to 1 by default)
    const [currentPage, setPage] = useState(1);

    // Total pages (set to 1 by default)
    const [totalPages, setTotalPages] = useState(1);

    // Total registered users
    const [totalCustomers, setTotalCustomers] = useState(0);

    // Toggling modal

    useEffect(() => {
        // Empty customers array
        setCustomers();

        // Getting customers
        axios
            .get(`${ctx.baseURL}/user/customers?limit=${limit}&page=${currentPage}`, ctx.headers)
            .then((response) => {
                // Setting customers array
                setCustomers(response.data.users);

                // Getting total pages
                setTotalPages(response.data.pages);

                // Total users
                setTotalCustomers(response.data.count);

                // If no customers found, show error
                if (response.data.users.length === 0) {
                    setError('No customers found');
                }
            })
            .catch((error) => {
                // Show error if something went wrong
                setError(ctx.computeError(error));
            });
        // Request will be executed again if current page changed
    }, [currentPage]);

    // go to next page
    const nextPage = () => {
        setPage(currentPage + 1);
    };

    // go to previous page
    const previousPage = () => {
        setPage(currentPage - 1);
    };

    // view customer
    const viewCustomer = (id) => {
        ctx.navigate('/customer/' + id);
    };

    return (
        <>
            <div className='mt-4 mx-4'>
                <div className='flex justify-between items-center mb-2'>
                    <div className='font-semibold text-neutral'>Customer List</div>
                </div>
                {/* Loading while customers are not loaded */}
                {!customers && !error && <SpinnerWithText>Loading</SpinnerWithText>}

                {/* Showing error incase something goes wrong */}
                {error && <div className='text-error text-center'>{error}</div>}

                {/* Customer list */}
                {customers && (
                    <>
                        <p className='text-sm text-content1 mb-2'>
                            {totalCustomers} registered customer{totalCustomers > 1 ? 's' : ''}
                        </p>
                        <div className='w-full overflow-x-auto'>
                            <table className='table table-hover table-compact font-medium'>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Contact</th>
                                        <th>Address</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer, i) => {
                                        return (
                                            // when row is clicked, open modal
                                            <tr
                                                key={i}
                                                className='cursor-pointer'
                                                onClick={() => viewCustomer(customer._id)}
                                            >
                                                {/* Setting serial number */}
                                                <td>{(currentPage - 1) * limit + (i + 1)}</td>
                                                <td>{customer.name}</td>
                                                <td>{customer.email}</td>
                                                <td>{customer.contact}</td>
                                                <td>{customer.address}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* If limit is not 5 (which will mean the list is rendered in dashboard) and customers are loaded and total pages are more than 1, then show next and previous buttons */}
            {limit && limit !== 5 && customers && totalPages > 1 && (
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
            {customers && limit !== 5 && (
                <p className='text-center text-sm p-2'>
                    Page {currentPage} of {totalPages}
                </p>
            )}

            {/* If limit is set to 5, it means list is loaded from dashboard, and customers are loaded then show  the see all button, which will navigate the user to /customers page */}
            {customers && !error && limit && limit === 5 && (
                <div className='mt-2'>
                    <Link className='p-4 text-primary underline' to={'/customers'}>
                        See all customers
                    </Link>
                </div>
            )}

            {/* Modal for showing customer info */}
        </>
    );
};

export default CustomerList;
