import React from 'react';
import { StarFilled } from '@ant-design/icons';

const Rating = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<StarFilled key={i} style={{ color: '#FFD700' }} />);
    }
    return stars;
  };

  return (
    <div>
      {renderStars()}
    </div>
  );
};

export default Rating;
