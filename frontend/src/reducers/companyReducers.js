// reducers/companyReducers.js
import {
    COMPANY_LIST_REQUEST,
    COMPANY_LIST_SUCCESS,
    COMPANY_LIST_FAIL,
    COMPANY_DETAILS_REQUEST,
    COMPANY_DETAILS_SUCCESS,
    COMPANY_DETAILS_FAIL,
    COMPANY_CREATE_REQUEST,
    COMPANY_CREATE_SUCCESS,
    COMPANY_CREATE_FAIL,
    COMPANY_UPDATE_REQUEST,
    COMPANY_UPDATE_SUCCESS,
    COMPANY_UPDATE_FAIL,
    COMPANY_DELETE_REQUEST,
    COMPANY_DELETE_SUCCESS,
    COMPANY_DELETE_FAIL,
    CATEGORY_LIST_REQUEST,
    CATEGORY_LIST_SUCCESS,
    CATEGORY_LIST_FAIL,

    METRICS_REQUEST,
    METRICS_SUCCESS,
    METRICS_FAIL,

  } from '../constants/globalconstants';

  


  export const metricsReducer = (state = { metrics: [] }, action) => {
    switch (action.type) {
        case METRICS_REQUEST:
            return { loading: true, metrics: [] };
        case METRICS_SUCCESS:
            return { loading: false, metrics: action.payload };
        case METRICS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

  export const companyListReducer = (state = { companies: [] }, action) => {
    switch (action.type) {
      case COMPANY_LIST_REQUEST:
        return { loading: true, companies: [] };
      case COMPANY_LIST_SUCCESS:
        return { loading: false, companies: action.payload };
      case COMPANY_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };



  export const categoryListReducer = (state = { categories: [] }, action) => {
    switch (action.type) {
      case CATEGORY_LIST_REQUEST:
        return { loading: true, categories: [] };
      case CATEGORY_LIST_SUCCESS:
        return { loading: false, categories: action.payload };
      case CATEGORY_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const companyDetailsReducer = (state = { company: {} }, action) => {
    switch (action.type) {
      case COMPANY_DETAILS_REQUEST:
        return { ...state, loading: true };
      case COMPANY_DETAILS_SUCCESS:
        return { loading: false, company: action.payload };
      case COMPANY_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const companyCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case COMPANY_CREATE_REQUEST:
        return { loading: true };
      case COMPANY_CREATE_SUCCESS:
        return { loading: false, success: true, company: action.payload };
      case COMPANY_CREATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const companyUpdateReducer = (state = { company: {} }, action) => {
    switch (action.type) {
      case COMPANY_UPDATE_REQUEST:
        return { loading: true };
      case COMPANY_UPDATE_SUCCESS:
        return { loading: false, success: true, company: action.payload };
      case COMPANY_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const companyDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case COMPANY_DELETE_REQUEST:
        return { loading: true };
      case COMPANY_DELETE_SUCCESS:
        return { loading: false, success: true };
      case COMPANY_DELETE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  