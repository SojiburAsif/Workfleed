import React from 'react';
import { Link } from 'react-router';
import { FaLock } from 'react-icons/fa';

const Forbbiden = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
            <FaLock className="text-red-500 text-6xl mb-4" />
            <h1 className="text-4xl font-bold mb-2">403 - Forbidden</h1>
            <p className="text-gray-600 mb-6">
                You don’t have permission to access this page.
            </p>
            <Link
                to="/"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Go Home
            </Link>
        </div>
    );
};

export default Forbbiden;
