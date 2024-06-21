import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Modal, Spin, Alert } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { createFeedback } from '../actions/feedbackActions'; // Assuming the path to feedbackActions is correct
import { getCompanyDetails, listCategories } from '../actions/companyActions';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const { Option } = Select;

const FeedbackForm = ({ companyId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory()

  const dispatch = useDispatch();

  const categoryList = useSelector((state) => state.categoryList);
  const { categories } = categoryList;

  useEffect(() => {
    // Fetch categories on component mount
    dispatch(listCategories());
  }, [dispatch]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);

    try {
      // Add companyId to feedback object
      const feedback = { ...values, company: companyId };

      // Dispatch createFeedback action
      await dispatch(createFeedback(feedback));

      // Reset form and close modal on success
      handleOk();
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      history.push('/dashboard');

    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        ADD FEEDBACK
      </Button>
      <Modal
        title="Create New Feedback"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        {error && <Alert message={error} type="error" />}
        <Spin spinning={loading}>
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            className="row-col"
            style={{ width: '100%' }}
          >
            <Form.Item
              className="title"
              label="Title"
              name="title"
              rules={[
                {
                  required: true,
                  message: 'Please input the title!',
                },
              ]}
            >
              <Input placeholder="Title" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              className="description"
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Please input the description!',
                },
              ]}
            >
              <Input.TextArea placeholder="Description" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              className="category"
              label="Category"
              name="category"
              rules={[
                {
                  required: true,
                  message: 'Please select a category!',
                },
              ]}
            >
              <Select placeholder="Select a category" style={{ width: '100%' }}>
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              className="rating"
              label="Rating"
              name="rating"
              rules={[
                {
                  required: true,
                  message: 'Please select a rating!',
                },
              ]}
            >
              <Select placeholder="Select a rating" style={{ width: '100%' }}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Option key={rating} value={rating}>
                    {rating}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default FeedbackForm;
