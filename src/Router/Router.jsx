import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "../Page/Home/Home";
import LoginForm from "../Page/Form/LoginForm";
import RegisterForm from "../Page/Form/RegisterForm";
import MainDashbord from "../Page/Dashborde/Main/MainDashbord";
import Error from "../Error/Error";
import PrivateRouter from "../Page/Auth/PrivatRouter";
import DashboardLayout from "../Page/Dashborde/Main/DashbordeLayout";
import WorkSheet from "../Page/Dashborde/Employe/WorkSheet";

import EmployeeList from "../Page/Dashborde/HR/EmployList";
import EmployDetails from "../Page/Dashborde/HR/EmpoltDeatils"; // spelling fixed
import Progress from "../Page/Dashborde/HR/Progress";
import AllEmployLiist from "../Page/Dashborde/Admin/AllEmployLiist";
import PayRoll from "../Page/Dashborde/Admin/PayRoll";
import MakeAdmin from "../Page/Dashborde/Admin/MakeAdmin";
import Forbbiden from "../Forbidden/Forbbiden";
import AdminRoute from "../Page/Auth/AdminRoute";
import HRRoute from "../Page/Auth/HRPrivateRoute";
import Contact from "../Page/Dashborde/Contact/Contact";
import PaymentPage from "../Page/Dashborde/Admin/Payment";
import PayEmploy from "../Page/Dashborde/Employe/PayEmploy";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRouter>
        <DashboardLayout />
      </PrivateRouter>
    ),
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <MainDashbord />,
      },
      {
        path: "work-sheet",
        element: <WorkSheet />,
      },
     {
      path: 'payment-history',
      element: <PayEmploy></PayEmploy>
     },
      {
        path: "employList",
        element: <EmployeeList />

        // <HRRoute></HRRoute>
      },
      {
        path: "employList/details/:id",
        element: <EmployDetails />
      },
      {
        path: 'progress',
        element: <Progress></Progress>
      },
      {
        path: 'makeAdmin',
        element: <AdminRoute><MakeAdmin></MakeAdmin></AdminRoute>
      },
      {
        path: 'allEmployeeList',
        element: <AdminRoute>
          <AllEmployLiist></AllEmployLiist>
        </AdminRoute>
      },
      {
        path: 'payroll',
        element: <AdminRoute>
          <PayRoll></PayRoll>
        </AdminRoute>
      },
      {
        path: 'payment/:id',
        element: <PaymentPage />
      },
      {
        path: 'contact-us',
        element: <Contact></Contact>
      }
    ],
  },

  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    path: '/forbiden',
    Component: Forbbiden
  },
  {
    path: "*",
    element: <Error />,
  },
]);
