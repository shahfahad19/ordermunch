import React, { useContext, useEffect, useRef, useState } from 'react';
import AppContext from '../../../AppContext';
import {
    AlertModal,
    ModalButton,
    ModalCloseBtn,
    ModalFormButton,
    ModalTitle,
    ModalWrapper,
} from '../../../Utils/Modal';
import Form, { FormControl, FormField, FormGroup, FormLabel, FormLabelAlt } from '../../../Utils/Form';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AddItemBtn = ({ setNewItem }) => {
    // Context
    const ctx = useContext(AppContext);

    // UseState to show modal or not
    const [showAddForm, setShowAddForm] = useState(false);

    // State of add button, when form is submitted, it will be set to loading (class name)
    const [btnState, setBtnState] = useState('');
    const params = useParams();

    // Use states for validation
    const [restaurantError, setRestaurantError] = useState('');
    const [itemNameError, setItemNameError] = useState('');
    const [itemImageError, setItemImageError] = useState('');
    const [itemPriceError, setItemPriceError] = useState('');
    const [itemCategoryError, setItemCategoryError] = useState('');

    // Alert modal to show info if item was added or not
    const [alertModal, setAlertModal] = useState({
        show: false,
    });

    // Refs for form
    const restaurant = useRef();
    const itemName = useRef();
    const itemImage = useRef();
    const itemCategroy = useRef();
    const itemPrice = useRef();
    const itemDescription = useRef();

    // SHow/Hide form function
    const showAddFormHandler = () => setShowAddForm(!showAddForm);

    // function to hide alert form
    const hideAlertModal = () => setAlertModal({ show: false });

    // Restaurant list
    const [restaurantList, setRestaurantList] = useState();

    useEffect(() => {
        // If url doesn't have a restaurant id, load the restaurants so user can select from it.
        // this will not be executed if user open a restaurant and then adds an item
        if (!params.restaurantId) {
            axios
                .get(`${ctx.baseURL}/restaurants`, ctx.headers)
                .then((response) => {
                    setRestaurantList(response.data.restaurants);
                })
                .catch(() => {});
        }
    }, []);

    const submitForm = async (event) => {
        // Restricting default form behaviour to prevent page from loading
        event.preventDefault();

        // Setting all errors to ''
        setItemNameError('');
        setItemImageError('');
        setRestaurantError('');
        setItemPriceError('');
        setItemCategoryError('');

        // Getting values from refs
        const name = itemName.current.value || '';
        const image = itemImage.current.value || '';
        const category = itemCategroy.current.value || '';
        const price = itemPrice.current.value || '';
        const description = itemDescription.current.value || '';

        // If url has restaurant id, set it to that other wise get id from selected restuarant
        const restaurantId = params.restaurantId ? params.restaurantId : restaurant.current.value;

        // Validating
        if (name === '') {
            setItemNameError('Enter item name');
            return;
        }
        if (image === '') {
            setItemImageError('Enter item image link');
            return;
        }
        if (category === '') {
            setItemCategoryError('Enter item category');
            return;
        }
        if (price === '') {
            setItemPriceError('Enter item price');
            return;
        }
        if (restaurantId === '') {
            setRestaurantError('Select a restaurant');
            return;
        }

        // Set button class to loading
        setBtnState('btn-loading');

        // Data object with all the values
        const data = {
            name,
            image,
            price,
            category,
            restaurant: restaurantId,
            description,
        };

        // Add item
        await axios
            .post(`${ctx.baseURL}/items`, data, ctx.headers)
            .then((response) => {
                // If success, show success message
                setAlertModal({
                    show: true,
                    text: 'Item added successfully',
                    type: 'success',
                });

                // hide add form
                setShowAddForm(false);

                // set new item to this function from props (to refresh items in ItemsList.jsx)
                setNewItem(response.data.item);
            })
            .catch((error) => {
                // If failed, show failure message
                setAlertModal({
                    show: true,
                    text: ctx.computeError(error),
                    type: 'error',
                });
            });

        // Set button class from loading to empty
        setBtnState('');
    };

    return (
        <>
            <button className='btn btn-solid-primary btn-sm' onClick={showAddFormHandler}>
                Add Item
            </button>
            {showAddForm && (
                <ModalWrapper>
                    {/* Only show cancel button if form is not in submitting state
                        This will be determined by submit button class use state */}
                    {btnState === '' && <ModalCloseBtn handler={showAddFormHandler} />}
                    <ModalTitle>Add Item</ModalTitle>
                    <Form onSubmit={submitForm}>
                        <FormGroup>
                            {/* This field will be available if url doesn't have a restaurant id */}
                            {!params.restaurantId && (
                                <FormField>
                                    <FormLabel>Restaurant</FormLabel>
                                    <FormControl>
                                        <select
                                            className={ctx.selectClasses}
                                            ref={restaurant}
                                            disabled={restaurantList === undefined}
                                            defaultValue={''}
                                        >
                                            {!restaurantList && <option>Please wait</option>}
                                            {restaurantList && <option value={''}>Select a restaurant</option>}

                                            {restaurantList &&
                                                restaurantList.map((restaurant, i) => {
                                                    return (
                                                        <option key={i} value={restaurant._id}>
                                                            {restaurant.name}
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </FormControl>
                                    {restaurantError !== '' && <FormLabelAlt>{restaurantError}</FormLabelAlt>}
                                </FormField>
                            )}
                            <FormField>
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                    <input className={ctx.inputClasses} type='text' ref={itemName} />
                                </FormControl>
                                {itemNameError !== '' && <FormLabelAlt>{itemNameError}</FormLabelAlt>}
                            </FormField>
                            <FormField>
                                <FormLabel>Item Image</FormLabel>
                                <FormControl>
                                    <input className={ctx.inputClasses} type='text' ref={itemImage} />
                                </FormControl>
                                {itemImageError !== '' && <FormLabelAlt>{itemImageError}</FormLabelAlt>}
                            </FormField>
                            <FormField>
                                <FormLabel>Item Category</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses}
                                        placeholder='eg. Burgers'
                                        type='text'
                                        ref={itemCategroy}
                                    />
                                </FormControl>
                                {itemCategoryError !== '' && <FormLabelAlt>{itemCategoryError}</FormLabelAlt>}
                            </FormField>
                            <FormField>
                                <FormLabel>Item Price</FormLabel>
                                <FormControl>
                                    <input className={ctx.inputClasses} type='number' ref={itemPrice} />
                                </FormControl>
                                {itemPriceError !== '' && <FormLabelAlt>{itemPriceError}</FormLabelAlt>}
                            </FormField>
                            <FormField>
                                <FormLabel>Item Description (optional)</FormLabel>
                                <FormControl>
                                    <textarea className='textarea textarea-block' ref={itemDescription} />
                                </FormControl>
                            </FormField>
                        </FormGroup>
                        <div className='flex gap-3 mt-3'>
                            <ModalFormButton className={'btn-primary ' + btnState}>Add</ModalFormButton>

                            {/* Only show cancel button if form is not in submitting state
                                This will be determined by submit button class use state */}
                            {btnState === '' && <ModalButton handler={showAddFormHandler}>Cancel</ModalButton>}
                        </div>
                    </Form>
                </ModalWrapper>
            )}

            {/* ALert modal */}
            {alertModal.show && <AlertModal type={alertModal.type} text={alertModal.text} handler={hideAlertModal} />}
        </>
    );
};

export default AddItemBtn;
