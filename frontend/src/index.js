import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider

} from 'react-router-dom';
import {PayPalScriptProvider} from '@paypal/react-paypal-js';
import {HelmetProvider} from 'react-helmet-async';
import {Provider} from 'react-redux';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


//TO PROTECT ROUTE 
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';


import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';


import OrderlistPage from './pages/admin/OrderlistPage';
import ProductListPage from './pages/admin/ProductListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import UsersListPage from './pages/admin/UsersListPage';
import UserEditPage from './pages/admin/UserEditPage';



//ROUTES
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomePage />} />
      <Route path='/search/:keyword' element={<HomePage />} /> 
      <Route path='/page/:pageNumber' element={<HomePage />} />
      <Route 
        path='/search/:keyword/page/:pageNumber' 
        element={<HomePage />} 
      />
      
      <Route path='/product/:id' element={<ProductPage />} />
      <Route path='/cart' element={<CartPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      
      <Route path='' element={<PrivateRoute/>}>
        <Route path='/shipping' element={<ShippingPage/>}/>
        <Route path='/payment' element={<PaymentPage/>}/>
        <Route path='/placeorder' element={<PlaceOrderPage/>}/>
        <Route path='/order/:id' element={<OrderPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
      </Route>

      <Route path='' element={<AdminRoute/>}>
        <Route path='/admin/orderlist' element={<OrderlistPage/>}/>
        <Route path='/admin/productlist' element={<ProductListPage/>}/>
        <Route path='/admin/productlist/:pageNumber' element={<ProductListPage/>}/>
        <Route path='/admin/product/:id/edit' element={<ProductEditPage/>}/>
        <Route path='/admin/userlist' element={<UsersListPage/>}/>
        <Route path='/admin/user/:id/edit' element={<UserEditPage/>}/>
      </Route>
    </Route>
  )
);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router}/>   
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
