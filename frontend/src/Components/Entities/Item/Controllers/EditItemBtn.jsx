import React, { useContext, useRef, useState } from 'react';
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

const EditItemBtn = ({ itemData, setData }) => {
    const data = { ...itemData };

    // Context
    const ctx = useContext(AppContext);

    // UseState to show modal or not
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    // State of add button, when form is submitted, it will be set to loading (class name)
    const [btnState, setBtnState] = useState('');

    //params
    const params = useParams();

    // Use states for validation
    const [itemNameError, setItemNameError] = useState('');
    const [itemImageError, setItemImageError] = useState('');
    const [itemPriceError, setItemPriceError] = useState('');
    const [itemCategoryError, setItemCategoryError] = useState('');

    // Alert modal to show info if item was added or not
    const [alertModal, setAlertModal] = useState({
        show: false,
    });

    // Refs for form
    const itemName = useRef();
    const itemImage = useRef();
    const itemCategroy = useRef();
    const itemPrice = useRef();
    const itemDescription = useRef();

    // SHow/Hide form function
    const showUpdateFormHandler = () => setShowUpdateForm(!showUpdateForm);

    // function to hide alert form
    const hideAlertModal = () => setAlertModal({ show: false });

    const submitForm = async (event) => {
        // Restricting default form behaviour to prevent page from loading
        event.preventDefault();

        // Setting all errors to ''
        setItemNameError('');
        setItemImageError('');
        setItemPriceError('');
        setItemCategoryError('');

        // Getting values from refs
        const name = itemName.current.value || '';
        const image = itemImage.current.value || '';
        const category = itemCategroy.current.value || '';
        const price = itemPrice.current.value || '';
        const description = itemDescription.current.value || '';

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

        // Set button class to loading
        setBtnState('btn-loading');

        // Data object with all the values
        const data = {
            name,
            image,
            price,
            category,
            description,
        };

        // Add item
        await axios
            .patch(`${ctx.baseURL}/items/${params.itemId}`, data, ctx.headers)
            .then((response) => {
                // If success, show success message
                setAlertModal({
                    show: true,
                    text: 'Item updated successfully',
                    type: 'success',
                });

                // hide add form
                setShowUpdateForm(false);

                data.item = response.data.item;

                // set new item in this to refresh item list
                setData(data);
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
            <button className='btn btn-block btn-solid-primary btn-sm' onClick={showUpdateFormHandler}>
                Edit
            </button>
            {showUpdateForm && (
                <ModalWrapper>
                    {/* Only show cancel button if form is not in submitting state
                        This will be determined by submit button class use state */}
                    {btnState === '' && <ModalCloseBtn handler={showUpdateFormHandler} />}
                    <ModalTitle>Add Item</ModalTitle>
                    <Form onSubmit={submitForm}>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Item Name</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses}
                                        type='text'
                                        ref={itemName}
                                        defaultValue={data.item.name}
                                    />
                                </FormControl>
                                {itemNameError !== '' && <FormLabelAlt>{itemNameError}</FormLabelAlt>}
                            </FormField>
                            <FormField>
                                <FormLabel>Item Image</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses}
                                        type='text'
                                        ref={itemImage}
                                        defaultValue={data.item.image}
                                    />
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
                                        defaultValue={data.item.category}
                                    />
                                </FormControl>
                                {itemCategoryError !== '' && <FormLabelAlt>{itemCategoryError}</FormLabelAlt>}
                            </FormField>
                            <FormField>
                                <FormLabel>Item Price</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses}
                                        type='number'
                                        ref={itemPrice}
                                        defaultValue={data.item.price}
                                    />
                                </FormControl>
                                {itemPriceError !== '' && <FormLabelAlt>{itemPriceError}</FormLabelAlt>}
                            </FormField>
                            <FormField>
                                <FormLabel>Item Description (optional)</FormLabel>
                                <FormControl>
                                    <textarea
                                        className='textarea textarea-block'
                                        ref={itemDescription}
                                        defaultValue={data.item.description}
                                    />
                                </FormControl>
                            </FormField>
                        </FormGroup>
                        <div className='flex gap-3 mt-3'>
                            <ModalFormButton className={'btn-primary ' + btnState}>Update</ModalFormButton>

                            {/* Only show cancel button if form is not in submitting state
                                This will be determined by submit button class use state */}
                            {btnState === '' && <ModalButton handler={showUpdateFormHandler}>Cancel</ModalButton>}
                        </div>
                    </Form>
                </ModalWrapper>
            )}

            {/* ALert modal */}
            {alertModal.show && <AlertModal type={alertModal.type} text={alertModal.text} handler={hideAlertModal} />}
        </>
    );
};

export default EditItemBtn;
