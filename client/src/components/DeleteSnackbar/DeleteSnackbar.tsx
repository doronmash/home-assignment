import React from 'react';
import { Snackbar } from '@mui/material';

interface DeleteSnackbarProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  action: React.ReactNode;
}

const DeleteSnackbar: React.FC<DeleteSnackbarProps> = ({ isOpen, onClose, message, action }) => {
  return (
    <Snackbar
      open={isOpen}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={6000}
      onClose={onClose}
      message={message}
      action={action}
    />
  );
};

export default DeleteSnackbar;
