import React, { useContext, useRef, useState } from 'react';
import { AlertModal, ModalButton, ModalCloseBtn, ModalFormButton, ModalWrapper } from '../Utils/Modal';
import Form, { FormControl, FormField, FormGroup, FormLabel, FormLabelAlt } from '../Utils/Form';
import axios from 'axios';
import AppContext from '../AppContext';

const UpdateProfile = () => {
    // Context
    const ctx = useContext(AppContext);

    const user = ctx.userData;

    // use state to check if user wants to update email or password
    const [update, setUpdate] = useState('email');

    // UseState to show modal or not
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    // State of add button, when form is submitted, it will be set to loading (class name)
    const [btnState, setBtnState] = useState('');

    // Use states for validation
    const [emailError, setEmailError] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');

    // Alert modal to show info if item was added or not
    const [alertModal, setAlertModal] = useState({
        show: false,
    });

    // Refs for form
    const emailRef = useRef();
    const currentPasswordRef = useRef();
    const newPasswordRef = useRef();
    const confirmNewPasswordRef = useRef();

    // SHow/Hide form function
    const showUpdateFormHandler = () => setShowUpdateForm(!showUpdateForm);

    // function to hide alert form
    const hideAlertModal = () => setAlertModal({ show: false });

    const submitForm = async (event) => {
        // Restricting default form behaviour to prevent page from loading
        event.preventDefault();

        // Setting all errors to ''
        setEmailError('');
        setCurrentPasswordError('');
        setNewPasswordError('');
        setConfirmNewPasswordError('');

        // Getting values from refs
        const email = update === 'email' ? emailRef.current.value : '';
        const passwordCurrent = update === 'password' ? currentPasswordRef.current.value : '';
        const password = update === 'password' ? newPasswordRef.current.value : '';
        const passwordConfirm = update === 'password' ? confirmNewPasswordRef.current.value : '';

        // Validating

        if (update === 'email') {
            if (email === '') {
                setEmailError('Enter item email');
                return;
            }
        } else {
            if (passwordCurrent === '') {
                setCurrentPasswordError('Enter current password');
                return;
            }

            if (password === '') {
                setNewPasswordError('Enter new password');
                return;
            }

            if (passwordConfirm === '') {
                setConfirmNewPasswordError('Confirm new password');
                return;
            }

            if (password !== passwordConfirm) {
                setConfirmNewPasswordError('Passwords do not match');
                return;
            }
        }

        // Set button class to loading
        setBtnState('btn-loading');

        // Data object with all the values
        let data = {
            passwordCurrent,
            password,
            passwordConfirm,
        };
        let url = ctx.baseURL + '/auth/updatePassword';

        if (update === 'email') {
            data = { email };
            url = ctx.baseURL + '/auth/updateProfile';
        }

        // Add item
        await axios
            .patch(url, data, ctx.headers)
            .then((response) => {
                // If success, show success message
                setAlertModal({
                    show: true,
                    text: 'Profile updated successfully',
                    type: 'success',
                });

                // hide add form
                setShowUpdateForm(false);

                if (update === 'password') {
                    ctx.updateToken(response.data.token);
                } else data.item = response.data.item;
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

    const updateHandler = () => {
        setUpdate(update === 'email' ? 'password' : 'email');
    };

    return (
        <>
            <div className='mr-3 cursor-pointer' onClick={showUpdateFormHandler}>
                <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                </svg>
            </div>

            {showUpdateForm && (
                <ModalWrapper>
                    {/* Only show cancel button if form is not in submitting state
                        This will be determined by submit button class use state */}
                    {btnState === '' && <ModalCloseBtn handler={showUpdateFormHandler} />}
                    <h2 className='text-xl text-content1 text-center font-medium'>Update Profile</h2>
                    <Form onSubmit={submitForm}>
                        <FormGroup>
                            <FormField>
                                <FormLabel>Update</FormLabel>
                                <FormControl>
                                    <select onChange={updateHandler} className={ctx.selectClasses}>
                                        <option>Update Email</option>
                                        <option>Update Password</option>
                                    </select>
                                </FormControl>
                            </FormField>
                            {update === 'email' && (
                                <FormField>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <input
                                            className={ctx.inputClasses}
                                            type='email'
                                            ref={emailRef}
                                            defaultValue={user.email}
                                        />
                                    </FormControl>
                                    {emailError !== '' && <FormLabelAlt>{emailError}</FormLabelAlt>}
                                </FormField>
                            )}

                            {update === 'password' && (
                                <>
                                    <FormField>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <input
                                                className={ctx.inputClasses}
                                                type='password'
                                                ref={currentPasswordRef}
                                            />
                                        </FormControl>
                                        {currentPasswordError !== '' && (
                                            <FormLabelAlt>{currentPasswordError}</FormLabelAlt>
                                        )}
                                    </FormField>
                                    <FormField>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <input className={ctx.inputClasses} type='password' ref={newPasswordRef} />
                                        </FormControl>
                                        {newPasswordError !== '' && <FormLabelAlt>{newPasswordError}</FormLabelAlt>}
                                    </FormField>
                                    <FormField>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <input
                                                className={ctx.inputClasses}
                                                type='password'
                                                ref={confirmNewPasswordRef}
                                            />
                                        </FormControl>
                                        {confirmNewPasswordError !== '' && (
                                            <FormLabelAlt>{confirmNewPasswordError}</FormLabelAlt>
                                        )}
                                    </FormField>
                                </>
                            )}
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

export default UpdateProfile;
