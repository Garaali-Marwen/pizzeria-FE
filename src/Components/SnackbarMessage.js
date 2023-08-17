import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const SnackbarMessage = ({ message, severity, onClose }) => {
    return (
        <Snackbar open={Boolean(message)} autoHideDuration={6000} onClose={onClose}>
            <MuiAlert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </MuiAlert>
        </Snackbar>
    );
};

export default SnackbarMessage;
