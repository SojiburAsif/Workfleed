import React from 'react';
import Home from '../Page/Home/Home';
import Header from '../Page/Home/Header';
import { Outlet } from 'react-router';
import Footer from '../Page/Home/Fooder';


const Root = () => {
    return (
        <div className=''>
            <Header></Header>
            <Outlet></Outlet>
            <Footer></Footer>
         
        </div>
    );
};

export default Root;