// actions/notificationActions.js
import axios from 'axios';
import {
  NOTIFICATION_LIST_REQUEST,
  NOTIFICATION_LIST_SUCCESS,
  NOTIFICATION_LIST_FAIL,
} from '../constants/globalconstants';

export const listNotifications = () => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTIFICATION_LIST_REQUEST });

    const { userLogin: { userInfo } } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/notifications/', config);

    dispatch({ type: NOTIFICATION_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NOTIFICATION_LIST_FAIL,
      payload: error.response && error.response.data.detail ? error.response.data.detail : error.message,
    });
  }
};
