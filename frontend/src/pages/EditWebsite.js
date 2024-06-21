import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Modal, Spin, Alert } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { updateCompany } from '../actions/companyActions'; // Adjust the import path as needed

const EditWebsite = ({ companyId }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const companyUpdate = useSelector((state) => state.companyUpdate);
  const { loading, error, success } = companyUpdate;

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

  const onFinish = (values) => {
    dispatch(updateCompany(companyId, values));
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Edit Website
      </Button>
      <Modal
        title="Edit Website"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {loading && <Spin />}
        {error && <Alert message="Error" description={error} type="error" showIcon />}
        {success && <Alert message="Success" description="Company updated successfully!" type="success" showIcon />}
        {!loading && !success && (
          <Form
            onFinish={onFinish}
            layout="vertical"
            className="row-col"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input the website's name!",
                },
              ]}
            >
              <Input placeholder="Name" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: 'email',
                  message: "Please input a valid email address!",
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              label="Website URL"
              name="website_url"
              rules={[
                {
                  required: true,
                  type: 'url',
                  message: "Please input a valid URL!",
                },
              ]}
            >
              <Input placeholder="Website URL" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default EditWebsite;
