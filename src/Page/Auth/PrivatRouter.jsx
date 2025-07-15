import { Navigate, useLocation } from 'react-router';
import UseAuth from '../../Hooks/UseAuth';
import Loading from '../Shared/Loading';


const PrivateRouter = ({ children }) => {
    const { user, loading } = UseAuth()
    const location = useLocation()
    // console.log(location);
    // console.log(user,);

    if (loading) {
        return <Loading></Loading>
    }

    if (user && user?.email) {
        return children
    }
    return <Navigate to={'/login'} state={location.pathname}></Navigate>
};

export default PrivateRouter;