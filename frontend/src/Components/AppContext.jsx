import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppContext = React.createContext({
    token: '',
    isLoggedIn: false,
    loggedInAs: '',
    userData: {},
    headers: {},
    baseURL: '',
    inputClasses: '',
    btnClasses: '',
    selectClasses: '',
    logout: () => {},
    login: () => {},
    navigate: () => {},
    computeError: () => {},
    setUserData: () => {},
    updateToken: () => {},
});

export const AppContextProvider = (props) => {
    // TODO -> This should be changed when building the project
    const baseURL = 'http://localhost:5000/api';

    const [isLoggedIn, setLoggedIn] = useState('wait');
    const [loggedInAs, setLoggedInAs] = useState();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        confirmed: true,
        photo: 'https://res.cloudinary.com/dbph73rvi/image/upload/v1675170781/mdqcinla4xkogsatvbr3.jpg',
    });
    const [token, setToken] = useState();

    useEffect(() => {
        let token = '';
        try {
            token = localStorage.getItem('o-token') || '';
        } catch (err) {
            /* empty */
        }

        if (token === '') {
            setLoggedIn(false);
            return;
        }
        setToken(token);
        if (token !== '')
            axios
                .get(baseURL + '/user', {
                    credentials: 'include',
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                })
                .then((response) => {
                    setLoggedInAs(response.data.user.role);
                    setUserData(response.data.user);
                    setLoggedIn(true);
                })
                .catch(() => {
                    setLoggedIn(false);
                });
    }, []);

    const loginHandler = () => {
        setLoggedIn('wait');
        let token = '';
        try {
            token = localStorage.getItem('o-token') || '';
        } catch (err) {
            return;
        }
        if (token === '') {
            setLoggedIn(false);
            return;
        }

        axios
            // eslint-disable-next-line no-undef
            .get(`${baseURL}/user`, {
                credentials: 'include',
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then(() => {})
            .catch(() => {
                setLoggedIn(false);
                setLoggedInAs('none');
            });
    };

    const logoutHandler = () => {
        localStorage.setItem('o-token', '');
        setLoggedIn(false);
        setLoggedInAs('');
        setUserData({});
        navigate('/');
        setToken('');
    };

    const computeError = (error) => {
        let errorMessage = error.message;
        if (error.response) errorMessage = error.response.data.message;
        return errorMessage;
    };

    const updateToken = (token) => {
        try {
            localStorage.setItem('o-token', token);
            setToken(token);
            return true;
        } catch (err) {
            return false;
        }
    };

    return (
        <AppContext.Provider
            value={{
                isLoggedIn: isLoggedIn,
                loggedInAs: loggedInAs,
                token: token,
                headers: {
                    headers: {
                        Authorization: 'Bearer ' + token,
                    },
                },
                userData: userData,
                login: loginHandler,
                logout: logoutHandler,
                baseURL,
                setUserData,
                btnClasses: 'btn btn-primary btn-block',
                inputClasses: 'input w-full input-block input-lg',
                selectClasses: 'select select-block select-lg',
                navigate: navigate,
                computeError,
                updateToken,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};
export default AppContext;
