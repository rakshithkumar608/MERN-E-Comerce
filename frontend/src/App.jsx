import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserLayout from './components/Layout/UserLayout.jsx';
import Home from './pages/Home.jsx';
import { Toaster } from 'sonner';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import CollectionPage from './pages/CollectionPage.jsx';
import ProductDetails from "./components/Products/ProductDetails.jsx";

import Checkout from './components/Cart/Checkout.jsx';
import OrderConfirmationPage from './pages/OrderConfirmationPage.jsx';
import OrderDetailsPage from './pages/OrderDetailsPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';
import AdminLayout from './components/Admin/AdminLayout.jsx';
import AdminHomePage from './pages/AdminHomePage.jsx';
import UserManagement from './components/Admin/UserManagement.jsx';
import ProductManagement from './components/Admin/ProductManagement.jsx';
import EditProductPage from './components/Admin/EditProductPage.jsx';
import OrderManagement from './components/Admin/OrderManagement.jsx';

import { Provider } from "react-redux";
import store from "./redux/store.js"


const App = () => {
  return (
    <Provider store={store}>
    <BrowserRouter future={{ v7_startTransition: true , v7_relativeSplatPath: true}}>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {/*User Layout*/}
          <Route index element={<Home />} />
          <Route path='login' element={<Login />}/>
          <Route path='register' element={<Register />}/>
          <Route path='profile' element={<Profile />}/>
          <Route path='collections/:collection' element={<CollectionPage />}/>
          <Route path='product/:id' element={<ProductDetails />}/>
          <Route path='checkout' element={<Checkout />}/>
          <Route path='order-confirmation' element={<OrderConfirmationPage />}/>
          <Route path='order/:id' element={<OrderDetailsPage />}/>
          <Route path='my-orders' element={<MyOrdersPage />}/>
          </Route>


        <Route>{/*Admin Layout*/}</Route>
        <Route path='/admin' element={<AdminLayout />}>
        <Route index element={<AdminHomePage />}/>
        <Route path='users' element={<UserManagement />}/>
        <Route path='products' element={<ProductManagement />}/>
        <Route path='products/:id/edit' element={<EditProductPage />}/>
        <Route path='orders' element={<OrderManagement />}/>
        </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App
