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

const EditRestaurantBtn = ({ resData, setData }) => {
    // getting data from props
    const data = { ...resData };

    //params
    const params = useParams();

    // Context
    const ctx = useContext(AppContext);

    // UseState for wether to show add form or not
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    // FOrm submit button state (will be set to loading when form is submitted)
    const [btnState, setBtnState] = useState('');

    // usestates for validation errors
    const [restaurantNameError, setRestaurantNameError] = useState('');
    const [restaurantImageError, setRestaurantImageError] = useState('');

    // Alertmodal to show if restaurant adding was successfull or not
    const [alertModal, setAlertModal] = useState({
        show: false,
    });

    // refs for restaurant name, image and description
    const restaurantName = useRef();
    const restaurantImage = useRef();
    const restaurantDesc = useRef();

    // Function for showing/hiding form
    const showUpdateFormHandler = () => setShowUpdateForm(!showUpdateForm);

    // Function for hiding alertModal
    const hideAlertModal = () => setAlertModal({ show: false });

    //  when form is submitted
    const submitForm = async (event) => {
        // Preventing default behaviour of form
        event.preventDefault();

        // Set errors to empty
        setRestaurantNameError('');
        setRestaurantImageError('');

        // Set restaurant data in variables
        const resName = restaurantName.current.value || '';
        const resImage = restaurantImage.current.value || '';
        const resDescription = restaurantDesc.current.value || '';

        // Validation for restaurant name and image
        // description is optional
        if (resName === '') {
            setRestaurantNameError('Enter restaurant name');
            return;
        }
        if (resImage === '') {
            setRestaurantImageError('Enter restaurant image link');
            return;
        }

        // set button class to loading
        setBtnState('btn-loading');

        // send post request for adding restaurant
        await axios
            .patch(
                `${ctx.baseURL}/restaurants/${params.restaurantId}`,
                {
                    name: resName,
                    image: resImage,
                    description: resDescription,
                },
                ctx.headers
            )
            .then((response) => {
                // If successfull, show success modal
                setAlertModal({
                    show: true,
                    text: 'Restaurant updated successfully',
                    type: 'success',
                });

                // hide form
                setShowUpdateForm(false);

                data.restaurant = response.data.restaurant;

                // set new restaurant in this to refresh restaurant list
                setData(data);
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
            <button className='btn btn-block btn-sm btn-solid-primary' onClick={showUpdateFormHandler}>
                Edit
            </button>

            {showUpdateForm && (
                <ModalWrapper>
                    {/* Only show cancel button if form is not in submitting state
                        This will be determined by submit button class use state */}
                    {btnState === '' && <ModalCloseBtn handler={showUpdateFormHandler} />}
                    <ModalTitle>Add Restaurant</ModalTitle>
                    <Form onSubmit={submitForm}>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Restaurant Name</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses}
                                        type='text'
                                        ref={restaurantName}
                                        defaultValue={data.restaurant.name}
                                    />
                                </FormControl>
                                {restaurantNameError !== '' && <FormLabelAlt>{restaurantNameError}</FormLabelAlt>}
                            </FormField>
                            <FormField>
                                <FormLabel>Restaurant Image</FormLabel>
                                <FormControl>
                                    <input
                                        className={ctx.inputClasses}
                                        placeholder='Image Link'
                                        type='text'
                                        ref={restaurantImage}
                                        defaultValue={data.restaurant.image}
                                    />
                                </FormControl>
                                {restaurantImageError !== '' && <FormLabelAlt>{restaurantImageError}</FormLabelAlt>}
                            </FormField>
                            <FormField>
                                <FormLabel>Description (optional)</FormLabel>
                                <FormControl>
                                    <textarea
                                        className='textarea textarea-block'
                                        placeholder='Description'
                                        ref={restaurantDesc}
                                        defaultValue={data.restaurant.description}
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

            {alertModal.show && <AlertModal type={alertModal.type} text={alertModal.text} handler={hideAlertModal} />}
        </>
    );
};

export default EditRestaurantBtn;
