import React from 'react';

const CustomerInfo = ({ customer }) => {
    return (
        <div className='ml-2 p-2 flex items-center'>
            <table className='table'>
                <tbody>
                    <th colSpan={2}>
                        <p className='text-center bg-backgroundSecondary p-3 font-semibold'>Customer Info</p>
                    </th>
                    <tr>
                        <th>Name</th>
                        <td>{customer.name}</td>
                    </tr>
                    <tr>
                        <th>Contact</th>
                        <td>{customer.contact}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{customer.email}</td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td>{customer.address}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CustomerInfo;
