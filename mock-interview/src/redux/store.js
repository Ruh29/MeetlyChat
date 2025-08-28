import authReducer from './authSlice';
import { configureStore } from '@reduxjs/toolkit';
import interviewReducer from './interviewSlice';
import adminAuthReducer from './adminAuthslice'
const store=configureStore({
    reducer:{auth:authReducer,
            interviews: interviewReducer,
            adminAuth: adminAuthReducer,

    }
})

export default store;