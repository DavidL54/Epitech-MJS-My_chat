/* eslint-disable object-shorthand */
/* eslint-disable key-spacing */
import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { removeSnackbar } from '../../redux/actions/alertActions';
import { useHistory } from "react-router-dom";

let displayed = [];

const useStyles = makeStyles(() => ({
  button: {
    color: 'white',
  },
  root: {
    'z-index': '1',
  },
}));

const Notifier = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const notifications = useSelector((store) => store.alert.notifications || []);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const storeDisplayed = (id) => {
    displayed = [...displayed, id];
  };

  const removeDisplayed = (id) => {
    displayed = [...displayed.filter((key) => id !== key)];
  };

  useEffect(() => {
    notifications.forEach(({
      key, message, options = {}, dismissed = false, redirectAction
    }) => {
      if (dismissed) {
        closeSnackbar(key);
        return;
      }
      const allActions = [];
      allActions.push(<Button
        className={classes.button}
        size="meddium"
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        Close
          </Button>)
      
      if (redirectAction) {
        allActions.push(<Button
          className={classes.button}
          size="meddium"
          onClick={() => { redirectAction.action.fonction(redirectAction.action.param); closeSnackbar(key);}}
        >
          {redirectAction.name}
          </Button>)
      }

      if (displayed.includes(key)) return;
      enqueueSnackbar(message, {
        key,
        ...options,
        onClose: (event, reason, myKey) => {
          if (options.onClose) {
            options.onClose(event, reason, myKey);
          }
        },
        className: classes.root,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'left',
        },
        onExited: (event, myKey) => {
          dispatch(removeSnackbar(myKey));
          removeDisplayed(myKey);
        },
        action: (
          <React.Fragment>
            {allActions}
          </React.Fragment>
        ),
      });
      storeDisplayed(key);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  return null;
};

export default Notifier;
