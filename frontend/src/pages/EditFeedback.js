import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Modal, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateFeedback } from '../actions/feedbackActions';

const FeedbackEditForm = ({ feedbackId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const feedbackUpdate = useSelector((state) => state.feedbackUpdate);
  const { loading, error, success } = feedbackUpdate;

  useEffect(() => {
    if (success) {
      setIsModalVisible(false);
    }
  }, [success]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = ({ status }) => {
    const statusValue = status ? 'finished' : 'new'; // Check if status is true, then 'finished', else 'new'
    dispatch(updateFeedback(feedbackId, { status: statusValue }));
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Edit Feedback
      </Button>
      <Modal
        title="Edit Feedback"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {loading && <Spin />}
        {error && <Alert message={error} type="error" showIcon />}
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="status" valuePropName="checked">
            <Checkbox>We fixed This Issue✅</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedbackEditForm;
