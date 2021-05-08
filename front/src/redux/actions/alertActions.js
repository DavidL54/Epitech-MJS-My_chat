/* eslint-disable spaced-comment */
import {
  ENQUEUE_SNACKBAR,
  CLOSE_SNACKBAR,
  REMOVE_SNACKBAR,
} from '../constants/alertConstants';
import store from '../../containers/App/store';

export const enqueueSnackbar = (notification) => {
  const key = notification.options && notification.options.key;

  return {
    type: ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: key || new Date().getTime() + Math.random(),
    },
  };
};

export const closeSnackbar = (key) => ({
  type: CLOSE_SNACKBAR,
  dismissAll: !key, // dismiss all if no key has been defined
  key,
});

export const removeSnackbar = (key) => ({
  type: REMOVE_SNACKBAR,
  key,
});

export const toastSuccess = (message) => {
  store.dispatch(enqueueSnackbar({
    message,
    options: {
      key: new Date().getTime() + Math.random(),
      variant: 'success',
    },
  }));
};

export const toastError = (message) => {
  store.dispatch(enqueueSnackbar({
    message,
    options: {
      key: new Date().getTime() + Math.random(),
      variant: 'error',
    },
  }));
};

export const toastWarning = (message) => {
  store.dispatch(enqueueSnackbar({
    message,
    options: {
      key: new Date().getTime() + Math.random(),
      variant: 'warning',
    },
  }));
};
