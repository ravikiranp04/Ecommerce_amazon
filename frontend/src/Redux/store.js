import {configureStore} from '@reduxjs/toolkit';
import userLoginReducer from './slices/userLoginSLice'
 const reduxStore=configureStore({
    reducer:{
    userLogin:userLoginReducer
    }
 })
export default reduxStore;