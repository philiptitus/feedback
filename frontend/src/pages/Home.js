import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Col,
  Row,
  Typography,
  Spin,
  Alert,
  Radio,
  Dropdown,
  Menu,
  Button,
  Input
} from "antd";
import { CommentOutlined, MoreOutlined, PlusCircleOutlined, SnippetsOutlined } from "@ant-design/icons";
import FeedbackEditForm from "./EditFeedback";
import Rating from "./Rating";
import { listFeedbacks } from '../actions/feedbackActions';
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import EditWebsite from "./EditWebsite";
import CreateWebsite from "./NewHostel";
import {  fetchMetrics } from "../actions/companyActions";

const Home = () => {
  const history = useHistory();
  const { Title } = Typography;
  const dispatch = useDispatch();
  const { Search } = Input; // extract Search component

  const feedbackList = useSelector((state) => state.feedbackList);
  const { loading: loadingFeedbacks, error: errorFeedbacks, feedbacks } = feedbackList;

  const metricsList = useSelector((state) => state.metrics);
  const { loading: loadingMetrics, error: errorMetrics, metrics } = metricsList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [searchText, setSearchText] = useState('');
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = feedbacks.filter(feedback =>
      feedback.category_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredFeedbacks(filtered);
  };
  

  useEffect(() => {
    if (!userInfo) {
      history.push('/sign-in');
    }
  }, [userInfo, history]);

  useEffect(() => {
    dispatch(listFeedbacks());
    dispatch(fetchMetrics());
  }, [dispatch]);

  const onChange = (e) => console.log(`radio checked:${e.target.value}`);

  const menu = (feedbackId) => (
    <Menu>
      <Menu.Item key="1">
        <FeedbackEditForm feedbackId={feedbackId} />
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>


            <br />
            {userInfo?.is_admin &&
  

            <CreateWebsite />


          }

{userInfo?.is_normal_user &&

<Button type="primary" style={{ margin: '20px 0' }}>
<Link to="/tables" style={{ color: 'white' }}>
  Rate Websites<CommentOutlined/>
</Link>
</Button>

}

        <Col xs={24} sm={24} md={12} lg={16} xl={20} className="mb-24">
          <Card bordered={false} className="criclebox cardbody h-full">
            <div className="project-ant">
              <div>
                <Title level={5}>Recent Feedbacks</Title>
                <Search
    placeholder="Search by category"
    onSearch={handleSearch}
    enterButton
    style={{ marginBottom: 16 }}
  />

              </div>
              <div className="ant-filtertabs">

              </div>
            </div>
            <div className="ant-list-box table-responsive">
              <table className="width-100">
                <thead>
                  <tr>
                    <th>COMPANY</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Rating</th>
                    <th>Category</th>
                    {userInfo?.is_admin &&
                    <th>Actions</th>
}
                  </tr>
                </thead>

                <tbody>
  {filteredFeedbacks.length === 0 && feedbacks.length !== 0 &&
    <Alert message="No feedbacks found for the searched category" type="warning" showIcon />
  }
  {loadingFeedbacks ? (
    <tr>
      <td colSpan="6" style={{ textAlign: 'center' }}>
        <Spin size="large" />
      </td>
    </tr>
  ) : errorFeedbacks ? (
    <tr>
      <td colSpan="6" style={{ textAlign: 'center' }}>
        <Alert message={errorFeedbacks} type="error" showIcon />
      </td>
    </tr>
  ) : (
    (searchText ? filteredFeedbacks : feedbacks).map((feedback, index) => (
      <tr key={index}>
        <td>
          <h6>{feedback.company_name}</h6>
        </td>
        <td>{feedback.title}</td>
        <td>{feedback.description}</td>
        <td>
          <Rating rating={feedback.rating} />
        </td>
        <td>{feedback.category_name}</td>
        {userInfo?.is_admin && feedback.status !== 'finished' && (
          <td>
            <Dropdown overlay={menu(feedback.id)} trigger={['click']}>
              <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                <MoreOutlined />
              </a>
            </Dropdown>
          </td>
        )}
      </tr>
    ))
  )}
</tbody>





              </table>
            </div>
          </Card>
        </Col>
{/* 
        <Col xs={12} sm={12} md={6} lg={6} xl={8} className="mb-24">

        </Col> */}
        {userInfo?.is_admin &&
        
        <Col xs={24} sm={24} md={12} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox cardbody h-full">
            <div className="project-ant">
              <div>
                <Title level={5}>Metrics For Your Site  <SnippetsOutlined/></Title>
              </div>
            </div>
            <div className="ant-list-box table-responsive">
              <table className="width-100">
                <thead>
                  <tr>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>

                  {metrics?.length === 0 &&
                  
                  <Alert message="Dont worry metrics start showing after your website gets a minimum of 5 reviews" type="success" showIcon />

                  }
                  {loadingMetrics ? (
                    <tr>
                      <td colSpan="1" style={{ textAlign: 'center' }}>
                        <Spin size="large" />
                      </td>
                    </tr>
                  ) : errorMetrics ? (
                    <tr>
                      <td colSpan="1" style={{ textAlign: 'center' }}>
                        <Alert message={errorMetrics} type="error" showIcon />
                      </td>
                    </tr>
                  ) : (
                    metrics.map((metric, index) => (
                      <tr key={index}>
                        <td>{metric.description}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </Col>


}

      </Row>
    </div>
  );
};

export default Home;
