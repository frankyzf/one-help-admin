import React from 'react';
import ProCard, { StatisticCard } from '@ant-design/pro-card';

function Card(props) {
  return <ProCard {...props} />;
}

Card.isProCard = true;
Card.StatisticCard = StatisticCard;

export default Card;
