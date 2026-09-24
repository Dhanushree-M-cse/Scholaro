import React from 'react';
import { Modal, Button } from '.';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, variant = 'danger' }) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="confirm-dialog-content">
        <p>{message}</p>
        <div className="confirm-dialog-actions">
          <Button variant="outline" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={variant} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
