import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {ProtectedRoute, AdminRoute} from './service/Guard';
import Navbar from './components/common/Navbar';
import {CartProvider} from './components/context/CartContext'; 
import Home from './components/pages/Home';
import ProductDetailsPage from './components/pages/ProductDetailsPage';
import CategoryListPage from './components/pages/CategoryListPage';
import CategoryProductsPage from './components/pages/CategoryProductsPage';
import CartPage from './components/pages/CartPage';
import RegisterPage from './components/pages/RegisterPage';
import LoginPage from './components/pages/LoginPage';
import ProfilePage from './components/pages/ProfilePage';
import AddressPage from './components/pages/AddressPage';
import AdminPage from './components/admin/AdminPage';
import AdminCategoryPage from './components/admin/AdminCategoryPage';
import AddCategory from './components/admin/AddCategory';
import EditCategory from './components/admin/EditCategory';
import AdminProductPage from './components/admin/AdminProductPage';
import AddProduct from './components/admin/AddProduct';
import EditProduct from './components/admin/EditProduct';
import AdminOrderPage from './components/admin/AdminOrderPage';
import AdminOrderDetails from './components/admin/AdminOrderDetails';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar></Navbar>
          <Routes>
            {/* RUTAS*/}
            <Route exact path="/" element={<Home></Home>}></Route>
            <Route path="/product/:productId" element={<ProductDetailsPage></ProductDetailsPage>}></Route>
            <Route path='/categories' element={<CategoryListPage></CategoryListPage>}></Route>
            <Route path='/category/:categoryId' element={<CategoryProductsPage></CategoryProductsPage>}></Route>
            <Route path='/cart' element={<CartPage></CartPage>}></Route>
            <Route path='/register' element={<RegisterPage></RegisterPage>}></Route>
            <Route path='/login' element={<LoginPage></LoginPage>}></Route>
            {/*RUTAS AUTH*/}
            <Route path='/profile' element={<ProtectedRoute element={<ProfilePage></ProfilePage>}></ProtectedRoute>}></Route>
            <Route path='/add-address' element={<ProtectedRoute element={<AddressPage></AddressPage>}></ProtectedRoute>}></Route>
            <Route path='/edit-address' element={<ProtectedRoute element={<AddressPage></AddressPage>}></ProtectedRoute>}></Route>
            {/*RUTAS ADMIN*/}
            <Route path='/admin' element={<AdminRoute element={<AdminPage></AdminPage>}></AdminRoute>}></Route>
            <Route path='/admin/categories' element={<AdminRoute element={<AdminCategoryPage></AdminCategoryPage>}></AdminRoute>}></Route>
            <Route path='/admin/add-category' element={<AdminRoute element={<AddCategory></AddCategory>}></AdminRoute>}></Route>
            <Route path='/admin/edit-category/:categoryId' element={<AdminRoute element={<EditCategory></EditCategory>}></AdminRoute>}></Route>
            <Route path='/admin/products' element={<AdminRoute element={<AdminProductPage></AdminProductPage>}></AdminRoute>}></Route>
            <Route path='/admin/add-product' element={<AdminRoute element={<AddProduct></AddProduct>}></AdminRoute>}></Route>
            <Route path='/admin/edit-product/:productId' element={<AdminRoute element={<EditProduct></EditProduct>}></AdminRoute>}></Route>
            <Route path='/admin/orders' element={<AdminRoute element={<AdminOrderPage></AdminOrderPage>}></AdminRoute>}></Route>
            <Route path='/admin/order-details/:itemId' element={<AdminRoute element={<AdminOrderDetails></AdminOrderDetails>}></AdminRoute>}></Route>

          </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
