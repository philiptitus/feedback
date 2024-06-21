import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const DeleteConfirmation = ({ onDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    onDelete();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" danger onClick={showModal}>
        Delete
      </Button>
      <Modal
        title="Delete Confirmation"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete?</p>
      </Modal>
    </>
  );
};

export default DeleteConfirmation;
