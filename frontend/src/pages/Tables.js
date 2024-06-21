import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listCompanies } from '../actions/companyActions';
import { Row, Col, Card, Table, Spin, Alert, Typography, Input } from 'antd';
import FeedbackForm from './Feedbackform';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const { Title } = Typography;
const { Search } = Input;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const columns = (userInfo) => {
  const baseColumns = [
    {
      title: "SOFTWARE/WEBSITE",
      dataIndex: "name",
      key: "name",
      width: "32%",
      render: (text, record) => <a href={record.website} target="_blank" rel="noopener noreferrer">{text}</a>,
    },
    {
      title: "WEBSITE URL",
      dataIndex: "website",
      key: "website",
      render: (text) => <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>,
    },
    {
      title: "EMAIL",
      key: "email",
      dataIndex: "email",
      render: (text) => <a href={`mailto:${text}`}>{text}</a>,
    },
    {
      title: "CREATED AT",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (text) => formatDate(text),
    },
  ];

  if (userInfo?.is_normal_user) {
    baseColumns.push({
      title: "ACTION",
      key: "action",
      render: (text, record) => (
        <span>
          <FeedbackForm companyId={record.key} userInfo={userInfo} /> {/* Pass userInfo as prop */}
        </span>
      ),
    });
  }

  return baseColumns;
};

function Tables() {
  const dispatch = useDispatch();
  const history = useHistory();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const companyList = useSelector((state) => state.companyList);
  const { loading, error, companies } = companyList;

  const [filteredCompanies, setFilteredCompanies] = useState([]);

  useEffect(() => {
    dispatch(listCompanies());
  }, [dispatch]);

  useEffect(() => {
    setFilteredCompanies(companies);
  }, [companies]);

  const handleSearch = (value) => {
    const filtered = companies.filter((company) =>
      company.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCompanies(filtered);
  };

  return (
    <div className="tabled">
      <Row gutter={[24, 0]}>
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            className="criclebox tablespace mb-24"
            title="Registered Websites/ Software"
          >
            <Search
              placeholder="Search by software/website name"
              onSearch={handleSearch}
              enterButton
              style={{ marginBottom: 16 }}
            />
            {loading ? (
              <Spin />
            ) : error ? (
              <Alert message="Error" description={error} type="error" showIcon />
            ) : (
              <div className="table-responsive">
                <Table
                  columns={columns(userInfo)}
                  dataSource={filteredCompanies.map((company) => ({
                    key: company.id,
                    name: company.name,
                    website: company.website_url,
                    email: company.email,
                    createdAt: company.created_at,
                  }))}
                  pagination={false}
                  className="ant-border-space"
                />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Tables;
