import React, { useEffect, useState } from 'react';

import {
    createUserWithEmailAndPassword, onAuthStateChanged,
    signInWithEmailAndPassword, signInWithPopup, signOut,
    updateProfile
} from 'firebase/auth';

import { GoogleAuthProvider } from 'firebase/auth';


import { AuthContext } from './AuthContext';
import Loading from '../Shared/Loading';
import { auth } from '../../Firebase/Firebase.init';

const AuthProvider = ({ children }) => {
    const [user, setuser] = useState(null)
    const [loading, setLoading] = useState(true)
    const googleProvider = new GoogleAuthProvider();


    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const loginUser = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password)
    }
    const updateUser = (updateData) => {
        return updateProfile(auth.currentUser, updateData)
    };
    const logout = () => {
        setLoading(true)
        return signOut(auth)

    }
    const googleSignIn = () => {
        return signInWithPopup(auth, googleProvider)
    }


    useEffect(() => {
        const unsubscribr = onAuthStateChanged(auth, (currentuser,) => {
            // console.log(currentuser.email);
            setuser(currentuser)
            setLoading(false)
            // SiAwselasticloadbalancing(false)


        });
        return () => {
            unsubscribr();
        }

    });


    const userInfo = {
        user,
        logout,
        loginUser,
        createUser,
        googleSignIn,
        updateUser,
    };
    if (loading) {
        return <Loading></Loading>
    }

    return (
        <AuthContext.Provider value={userInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;