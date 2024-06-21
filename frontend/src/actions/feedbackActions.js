// actions/feedbackActions.js
import axios from 'axios';
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

export const listFeedbacks = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FEEDBACK_LIST_REQUEST });


    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/feedbacks/', config);

    dispatch({ type: FEEDBACK_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FEEDBACK_LIST_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const getFeedbackDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: FEEDBACK_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/feedbacks/${id}/`);

    dispatch({ type: FEEDBACK_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FEEDBACK_DETAILS_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const createFeedback = (feedback) => async (dispatch, getState) => {
  try {
    dispatch({ type: FEEDBACK_CREATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/feedbacks/', feedback, config);

    dispatch({ type: FEEDBACK_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FEEDBACK_CREATE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const updateFeedback = (id, status) => async (dispatch, getState) => {
  try {
    dispatch({ type: FEEDBACK_UPDATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/feedbacks/${id}/`, status, config);

    dispatch({ type: FEEDBACK_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FEEDBACK_UPDATE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const deleteFeedback = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: FEEDBACK_DELETE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/feedbacks/${id}/`, config);

    dispatch({ type: FEEDBACK_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: FEEDBACK_DELETE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};
