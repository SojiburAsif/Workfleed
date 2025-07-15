import React from 'react';
import logo from '../../assets/Logo/logo.png'
import { Link } from 'react-router';

const Logo = () => {
    return (
        <div>
            <Link to={'/'}> <img src={logo} alt="" className='h-16 ' /></Link>

        </div>
    );
};

export default Logo;