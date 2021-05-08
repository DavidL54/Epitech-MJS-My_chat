/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import React from 'react';
import Loader from 'react-loader-spinner';
import { toastError } from '../redux/actions/alertActions';


const checkFields = (fieldArray) => {
  let isError = false;
  for (const field in fieldArray) {
    if (!fieldArray[field] && fieldArray[field] !== false) {
      toastError(`Error with field ${field}`);
      isError = true;
    }
  }
  if (isError === true) return (false);
  return (true);
};

const Loading = () => (
  <div
    key="divProgress"
    style={{
      height: '80vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Loader type="MutatingDots" color="#d58282" secondaryColor="#729bda" height={120} width={120} />
  </div>
);

export {
  checkFields,
  Loading,
};