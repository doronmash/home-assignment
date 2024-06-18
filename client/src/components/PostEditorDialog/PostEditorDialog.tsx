import React from 'react';
import { Dialog } from '@mui/material';
import { PostEditor } from './../PostEditor';

interface PostEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  props: any;
}

const PostEditorDialog: React.FC<PostEditorDialogProps> = ({ isOpen, onClose, props }) => {
  return (
    <Dialog
      onClose={onClose}
      open={isOpen}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <PostEditor {...props} />
    </Dialog>
  );
};

export default PostEditorDialog;
