import axios from 'axios';
import React, { useContext, useState } from 'react';
import { AlertModal, ModalButton, ModalCloseBtn, ModalTitle, ModalWrapper } from '../../../Utils/Modal';
import AppContext from '../../../AppContext';
import { useParams } from 'react-router-dom';

const DeleteItemBtn = () => {
    const ctx = useContext(AppContext);
    const params = useParams();

    const [btnState, setBtnState] = useState('');

    const [showConfimationModal, setShowConfirmationModal] = useState(false);
    const [alertModal, setAlertModal] = useState({
        show: false,
        text: '',
    });

    const confirmationModalHandler = () => {
        setShowConfirmationModal(showConfimationModal !== true);
    };

    const successModalHandler = () => {
        ctx.navigate(-1, { replace: true });
    };

    const errorModalHandler = () => {
        setAlertModal({ show: false });
    };

    const deleteItem = async (event) => {
        event.preventDefault();

        setBtnState('btn-loading');
        await axios
            .delete(`${ctx.baseURL}/items/${params.itemId}`, ctx.headers)
            .then(() => {
                setShowConfirmationModal(false);
                setAlertModal({
                    type: 'success',
                    show: true,
                    text: 'Item deleted successfully',
                });
            })
            .catch((error) => {
                setShowConfirmationModal(false);

                const errorMessage = ctx.computeError(error);
                setAlertModal({
                    type: 'error',
                    show: true,
                    text: errorMessage,
                });
            });
        setBtnState('');
    };

    return (
        <>
            <button
                className={`${ctx.btnClasses} btn-solid-error btn-sm btn-block mt-2`}
                onClick={confirmationModalHandler}
            >
                Delete
            </button>

            {showConfimationModal && (
                <>
                    <ModalWrapper>
                        {btnState === '' && <ModalCloseBtn handler={confirmationModalHandler} />}
                        <ModalTitle>Are you sure?</ModalTitle>
                        <span>This item will be deleted permanently from database!</span>
                        <div className='flex gap-3'>
                            <ModalButton className={'btn-error ' + btnState} handler={deleteItem}>
                                Delete
                            </ModalButton>
                            {btnState === '' && <ModalButton handler={confirmationModalHandler}>Cancel</ModalButton>}
                        </div>
                    </ModalWrapper>
                </>
            )}

            {alertModal.show && (
                <AlertModal
                    type={alertModal.type}
                    text={alertModal.text}
                    handler={alertModal.type === 'success' ? successModalHandler : errorModalHandler}
                />
            )}
        </>
    );
};

export default DeleteItemBtn;
