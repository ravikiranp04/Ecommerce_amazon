import './App.css';

import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import About from './screens/about.js';
import Home from './screens/home.js';
import Register from './screens/Register.js';
import Login from './screens/Login.js';
import RouteLayout from './screens/RouteLayout.js';
import Cart from './components/cart.js';
import OfflineCart from './components/OfflineCart.js';
import AdminProfile from './adminComponents/AdminProfile.js';
import UserProfile from './components/UserProfile.js';
import AddProduct from './adminComponents/addProduct.js';
import AdminCardDetail from './adminComponents/AdminCardDetail.js';
import ModifyProduct from './adminComponents/ModifyProduct.js';
import WishList from './components/WishList.js';
import Address from './components/address.js';
import Myorders from './components/Myorders.js';
import DispatchProducts from './adminComponents/DispatchProducts.js';
import DeliverProducts from './adminComponents/DeliverProducts.js';
import ReturnProducts from './adminComponents/ReturnProducts.js';
import ReturnVerify from './adminComponents/ReturnVerify.js';
function App() {
  let browserRouter = createBrowserRouter([
    {
      path: '',
      element: <RouteLayout />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path:'/about',
          element:<About/>
        },
        {
          path: '/register',
          element: <Register />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        
        {
           path:'/admin-profile',
           element:<AdminProfile/>,
           
        },
        {
          path:'/admin-profile/add-product',
          element:<AddProduct/>
        },
        {
          path:'/admin-profile/dispatch-products',
          element:<DispatchProducts/>
        },
        {
          path:'/admin-profile/deliver-products',
          element:<DeliverProducts/>
        },
        {
          path:'/admin-profile/return-products',
          element:<ReturnProducts/>
        },
        {
          path:'/admin-profile/return-products/return-verify',
          element:<ReturnVerify/>
        },
        {
          path:'/user-profile/:username',
          element:<UserProfile/>,
          
        },
        {
          path:'/user-profile/:username/my-orders',
          element:<Myorders/>,
          
        },
        {
          path:'/admin-profile/:productid',
          element:<AdminCardDetail/>,
          
        },
        {
          path:'/admin-profile/:productid/modify-product',
          element:<ModifyProduct/>
        },
        {
          path:'/user-profile/:username/cart',
          element:<Cart/>,
          
        },
        {
          path:'/user-profile/:username/cart/address',
          element:<Address/>,
          
        },
        {
          path:'/cart',
          element:<OfflineCart/>
        },
        {
          path:'/wishlist',
          element:<OfflineCart/>
        },
        {
          path:'/user-profile/:username/wishlist',
          element:<WishList/>
        }

      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={browserRouter}></RouterProvider>
    </div>
  );
}

export default App;
