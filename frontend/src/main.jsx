import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import Welcome from './Components/Welcome';
import ViewRestaurant from './Components/Entities/Restaurant/ViewRestaurant';
import MainScreen from './Components/MainScreen';
import Overview from './Components/Overview';
import RestaurantList from './Components/Entities/Restaurant/RestaurantList';
import ItemsList from './Components/Entities/Item/ItemsList';
import OrderList from './Components/Entities/Order/OrderList';
import CustomerList from './Components/Entities/Customer/CustomerList';
import RestaurantOverView from './Components/Entities/Restaurant/RestaurantOverView';
import ViewItem from './Components/Entities/Item/ViewItem';
import ItemOverview from './Components/Entities/Item/ItemOverview';
import ViewCustomer from './Components/Entities/Customer/ViewCustomer';
import CustomerOverview from './Components/Entities/Customer/CustomerOverview';
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <></>,
        children: [
            {
                path: '/',
                element: <Welcome />,
                children: [
                    {
                        path: '/',
                        element: <MainScreen />,
                        children: [
                            {
                                path: '/',
                                element: <Overview />,
                            },
                            {
                                path: '/restaurants',
                                element: <RestaurantList />,
                            },
                            {
                                path: '/items',
                                element: <ItemsList />,
                            },
                            {
                                path: '/orders',
                                element: <OrderList />,
                            },
                            {
                                path: '/customers',
                                element: <CustomerList />,
                            },
                        ],
                    },
                    {
                        path: '/restaurant/:restaurantId',
                        element: <ViewRestaurant />,
                        children: [
                            {
                                path: '',
                                element: <RestaurantOverView />,
                            },
                            {
                                path: 'items',
                                element: <ItemsList />,
                            },
                            {
                                path: 'orders',
                                element: <OrderList />,
                            },
                        ],
                    },
                    {
                        path: '/item/:itemId',
                        element: <ViewItem />,
                        children: [
                            {
                                path: '',
                                element: <ItemOverview />,
                            },
                            {
                                path: 'orders',
                                element: <OrderList />,
                            },
                        ],
                    },
                    {
                        path: '/customer/:customerId',
                        element: <ViewCustomer />,
                        children: [
                            {
                                path: '',
                                element: <CustomerOverview />,
                            },
                            {
                                path: 'orders',
                                element: <OrderList />,
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
