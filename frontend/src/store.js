// store.js

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

// Importing the specific reducers
import { 
    userLoginReducer,
    userRegisterReducer,


} from './reducers/authReducers'

import {
    notificationListReducer,

} from './reducers/notificationReducers'

import {
    feedbackListReducer,
    feedbackDetailsReducer,
    feedbackCreateReducer,
    feedbackUpdateReducer,
    feedbackDeleteReducer,
} from './reducers/feedbackReducers'

import {
    companyListReducer,
    companyDetailsReducer,
    companyCreateReducer,
    companyUpdateReducer,
    companyDeleteReducer,
    categoryListReducer,
    metricsReducer
} from './reducers/companyReducers'

const reducer = combineReducers({
    // Auth reducers
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,

    // userList: userListReducer,
    // userUpdate: userUpdateReducer,
    // accountDelete: accountDeleteReducer,
    // forgotPassword: forgotPasswordReducer,
    // resetPassword: resetPasswordReducer,
    // getOtp: getOtpReducer,
    // verifyOtp: verifyOtpReducer,

    // Notification reducers
    notificationList: notificationListReducer,
    categoryList: categoryListReducer,


    // Feedback reducers
    feedbackList: feedbackListReducer,
    feedbackDetail: feedbackDetailsReducer,
    feedbackCreate: feedbackCreateReducer,
    feedbackUpdate: feedbackUpdateReducer,
    feedbackDelete: feedbackDeleteReducer,

    // Company reducers
    companyList: companyListReducer,
    companyDetail: companyDetailsReducer,
    companyCreate: companyCreateReducer,
    companyUpdate: companyUpdateReducer,
    companyDelete: companyDeleteReducer,
    metrics: metricsReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
)

export default store
