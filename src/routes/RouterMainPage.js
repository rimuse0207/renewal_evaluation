import React, { useEffect, useState } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import LoginMainPage from "../pages/container/login/LoginPage";
import LoginRoute from "./LoginRoute/LoginRouteMainPage";
import { useSelector } from "react-redux";
import MainPage from "../pages/container/home/MainHome";
import PerformanceEditPage from "../pages/container/Individual/IndividualMainPage";
import AdminAbilityMainPage from "../pages/container/admin/ability/AdminAbilityMainPage";
import AdminMainPage from "../pages/container/admin/main/AdminMainPage";
import PerformanceMainPage from "../pages/container/admin/performance/PerformanceMainPage";
import OverallMainPage from "../pages/container/admin/overall/OverallMainPage";
import AdminResultDashboardPage from "../pages/container/admin/HRTable/AdminResultDashboardPage";
import PermissionGrantPage from "../pages/container/admin/user/PermissionGrantPage";
import axios from "axios";

const RouterMainPage = () => {
  const User_Info = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );

  const [RouterInfo, setRouterInfo] = useState([
    {
      path: "/",
      element: <LoginMainPage></LoginMainPage>,
      withAuthorization: false,
      withAdminAuthorization: false,
    },
    {
      path: "/Home",
      element: <MainPage></MainPage>,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
    {
      path: "/Write",
      element: <PerformanceEditPage></PerformanceEditPage>,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
    {
      path: "/Admin/Home",
      element: <AdminMainPage></AdminMainPage>,
      withAuthorization: true,
      withAdminAuthorization: false,
    },

    {
      path: "/Admin/Ability/:evalYear/:userId",
      element: <AdminAbilityMainPage></AdminAbilityMainPage>,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
    {
      path: "/Admin/Performance/:evalYear/:userId",
      element: <PerformanceMainPage></PerformanceMainPage>,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
    {
      path: "/Admin/Overall/:evalYear/:userId",
      element: <OverallMainPage></OverallMainPage>,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
    {
      path: "/HR/User",
      element: <PermissionGrantPage></PermissionGrantPage>,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
    {
      path: "/DashboardAdmin/Dashboard",
      element: <AdminResultDashboardPage></AdminResultDashboardPage>,
      withAuthorization: true,
      withAdminAuthorization: false,
    },

    {
      path: "*",
      element: <Navigate to="/Home"></Navigate>,
      withAuthorization: true,
      withAdminAuthorization: false,
    },
  ]);

  return (
    <BrowserRouter>
      <Routes>
        {RouterInfo.map((route) => {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <LoginRoute
                  withAdminAuthorization={route.withAdminAuthorization}
                  withAuthorization={route.withAuthorization}
                  component={route.element}
                  authCode={route.authCode}
                  User_Info={User_Info}
                ></LoginRoute>
              }
            ></Route>
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};
export default RouterMainPage;
