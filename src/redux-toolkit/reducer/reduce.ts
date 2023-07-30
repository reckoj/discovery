import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slicer/auth.slicer';
import userReducer from '../slicer/user.slicer';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer
});

export default rootReducer;
