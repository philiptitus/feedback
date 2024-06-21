// reducers/feedbackReducers.js
import {
    FEEDBACK_LIST_REQUEST,
    FEEDBACK_LIST_SUCCESS,
    FEEDBACK_LIST_FAIL,
    FEEDBACK_DETAILS_REQUEST,
    FEEDBACK_DETAILS_SUCCESS,
    FEEDBACK_DETAILS_FAIL,
    FEEDBACK_CREATE_REQUEST,
    FEEDBACK_CREATE_SUCCESS,
    FEEDBACK_CREATE_FAIL,
    FEEDBACK_UPDATE_REQUEST,
    FEEDBACK_UPDATE_SUCCESS,
    FEEDBACK_UPDATE_FAIL,
    FEEDBACK_DELETE_REQUEST,
    FEEDBACK_DELETE_SUCCESS,
    FEEDBACK_DELETE_FAIL,
  } from '../constants/globalconstants';
  
  export const feedbackListReducer = (state = { feedbacks: [] }, action) => {
    switch (action.type) {
      case FEEDBACK_LIST_REQUEST:
        return { loading: true, feedbacks: [] };
      case FEEDBACK_LIST_SUCCESS:
        return { loading: false, feedbacks: action.payload };
      case FEEDBACK_LIST_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const feedbackDetailsReducer = (state = { feedback: {} }, action) => {
    switch (action.type) {
      case FEEDBACK_DETAILS_REQUEST:
        return { ...state, loading: true };
      case FEEDBACK_DETAILS_SUCCESS:
        return { loading: false, feedback: action.payload };
      case FEEDBACK_DETAILS_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const feedbackCreateReducer = (state = {}, action) => {
    switch (action.type) {
      case FEEDBACK_CREATE_REQUEST:
        return { loading: true };
      case FEEDBACK_CREATE_SUCCESS:
        return { loading: false, success: true, feedback: action.payload };
      case FEEDBACK_CREATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const feedbackUpdateReducer = (state = { feedback: {} }, action) => {
    switch (action.type) {
      case FEEDBACK_UPDATE_REQUEST:
        return { loading: true };
      case FEEDBACK_UPDATE_SUCCESS:
        return { loading: false, success: true, feedback: action.payload };
      case FEEDBACK_UPDATE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export const feedbackDeleteReducer = (state = {}, action) => {
    switch (action.type) {
      case FEEDBACK_DELETE_REQUEST:
        return { loading: true };
      case FEEDBACK_DELETE_SUCCESS:
        return { loading: false, success: true };
      case FEEDBACK_DELETE_FAIL:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  