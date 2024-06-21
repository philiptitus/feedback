// actions/companyActions.js
import axios from 'axios';
import {
  COMPANY_LIST_REQUEST,
  COMPANY_LIST_SUCCESS,
  COMPANY_LIST_FAIL,

  METRICS_REQUEST,
  METRICS_SUCCESS,
  METRICS_FAIL,

  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,

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
} from '../constants/globalconstants';



export const fetchMetrics = () => async (dispatch, getState) => {
  try {
      dispatch({ type: METRICS_REQUEST });

      const { userLogin: { userInfo } } = getState();

      const config = {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
          },
      };

      const { data } = await axios.get('/api/metrics/', config);

      dispatch({
          type: METRICS_SUCCESS,
          payload: data,
      });
  } catch (error) {
      dispatch({
          type: METRICS_FAIL,
          payload: error.response && error.response.data.detail
              ? error.response.data.detail
              : error.message,
      });
  }
};


export const listCompanies = () => async (dispatch) => {
  try {
    dispatch({ type: COMPANY_LIST_REQUEST });

    const { data } = await axios.get('/api/companies/');

    dispatch({ type: COMPANY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPANY_LIST_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};





export const listCategories = () => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_LIST_REQUEST });

    const { data } = await axios.get('/api/categories/');

    dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};



export const getCompanyDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: COMPANY_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/companies/${id}/`);

    dispatch({ type: COMPANY_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPANY_DETAILS_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const createCompany = (company) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPANY_CREATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/companies/', company, config);

    dispatch({ type: COMPANY_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPANY_CREATE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const updateCompany = (id, company) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPANY_UPDATE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/companies/${id}/`, company, config);

    dispatch({ type: COMPANY_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMPANY_UPDATE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};

export const deleteCompany = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMPANY_DELETE_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/companies/${id}/`, config);

    dispatch({ type: COMPANY_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: COMPANY_DELETE_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};
