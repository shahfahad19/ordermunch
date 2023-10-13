import React, { useContext, useRef, useState } from 'react';
import AppContext from '../../AppContext';
import { AlertModal, ModalButton, ModalCloseBtn, ModalFormButton, ModalTitle, ModalWrapper } from '../../Utils/Modal';
import { FormControl, FormField, FormGroup, FormLabel, FormLabelAlt } from '../../Utils/Form';
import axios from 'axios';

const UpdateOrderBtn = ({ order, updateOrder }) => {
    // Context
    const ctx = useContext(AppContext);

    // UseState for wether to show add form or not
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    // FOrm submit button state (will be set to loading when form is submitted)
    const [btnState, setBtnState] = useState('');

    // usestates for validation errors
    const [orderStatusError, setOrderStatusError] = useState('');

    // Alertmodal to show if order adding was successfull or not
    const [alertModal, setAlertModal] = useState({
        show: false,
    });

    // refs for order name, image and description
    const orderStatus = useRef();

    // Function for showing/hiding form
    const showUpdateFormHandler = () => setShowUpdateForm(!showUpdateForm);

    // Function for hiding alertModal
    const hideAlertModal = () => setAlertModal({ show: false });

    //  when form is submitted
    const submitForm = async (event) => {
        // Preventing default behaviour of form
        event.preventDefault();

        // Set errors to empty
        setOrderStatusError('');

        // Set order data in variables
        const status = orderStatus.current.value || '';

        // Validation for order name and image
        // description is optional
        if (status === '') {
            setOrderStatusError('Select order status');
            return;
        }

        // set button class to loading
        setBtnState('btn-loading');

        // send post request for adding order
        await axios
            .patch(
                `${ctx.baseURL}/orders/${order._id}`,
                {
                    status,
                },
                ctx.headers
            )
            .then((response) => {
                // If successfull, show success modal
                setAlertModal({
                    show: true,
                    text: 'Order status updated successfully',
                    type: 'success',
                });

                // hide form
                setShowUpdateForm(false);

                // update order
                updateOrder(response.data.order);
            })
            .catch((error) => {
                // If failed, show failure modal
                setAlertModal({
                    show: true,
                    text: ctx.computeError(error),
                    type: 'error',
                });
            });

        // set button class to empty
        setBtnState('');
    };

    return (
        <>
            <button className='btn btn-sm btn-solid-primary' onClick={showUpdateFormHandler}>
                Update
            </button>

            {showUpdateForm && (
                <ModalWrapper>
                    {/* Only show cancel button if form is not in submitting state
                        This will be determined by submit button class use state */}
                    {btnState === '' && <ModalCloseBtn handler={showUpdateFormHandler} />}
                    <ModalTitle>Update Order</ModalTitle>
                    <form style={{ minWidth: '260px' }} onSubmit={submitForm}>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Order Name</FormLabel>
                                <FormControl>
                                    <select
                                        className={ctx.selectClasses}
                                        type='text'
                                        ref={orderStatus}
                                        defaultValue={order.status}
                                    >
                                        <option>Pending</option>
                                        <option>Confirmed</option>
                                        <option>Preparing</option>
                                        <option>Dispatched</option>
                                        <option>Completed</option>
                                        <option>Cancelled</option>
                                    </select>
                                </FormControl>
                                {orderStatusError !== '' && <FormLabelAlt>{orderStatusError}</FormLabelAlt>}
                            </FormField>
                        </FormGroup>
                        <div className='flex gap-3 mt-3'>
                            <ModalFormButton className={'btn-primary ' + btnState}>Update</ModalFormButton>
                            {/* Only show cancel button if form is not in submitting state
                                This will be determined by submit button class use state */}

                            {btnState === '' && <ModalButton handler={showUpdateFormHandler}>Cancel</ModalButton>}
                        </div>
                    </form>
                </ModalWrapper>
            )}

            {alertModal.show && <AlertModal type={alertModal.type} text={alertModal.text} handler={hideAlertModal} />}
        </>
    );
};

export default UpdateOrderBtn;
