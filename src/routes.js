import React from "react";
import Apptrying from "./component/pageone/homecompiler/homecompiler";
import Learncompiler from "./component/learn/learncompiler/learncompiler";
import Supportcompiler from "./component/support/supportcompiler/supportcompiler";
import Desktopone from "./component/desktopone/desktoponecompiler/desktoponecompiler";
import Error from "./component/404";
import Login from "./component/auth/Login";
import SignUp from "./component/auth/SignUp";
import HotelProfileRouter from "./component/hotelsProfile/HotelProfileRouter";

const routes = [
    // { path: '/', element: <Apptrying />, errorElement: <Error></Error>},
    { path: '', element: <SignUp />},
    { path: '/explore', element: <Apptrying />, errorElement: <Error></Error>},
    { path: '/learn', element: <Learncompiler />},
    { path: '/support', element: <Supportcompiler />},
    { path: '/desktop', element: <Desktopone />},
    { path: '/login', element: <Login />},
    { path: '/signUp', element: <SignUp />},
    { path: '/hotel/profile/*', element: <HotelProfileRouter />},
    { path: "*", element: <h1>Not Found!</h1> }
]

export default routes