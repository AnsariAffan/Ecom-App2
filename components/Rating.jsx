import React from 'react';
import { View, Text } from 'react-native';

const StarRating = ({ rating ,maxRating = 5}) => {

  const filledStars = Math.min(Math.max(0, rating), maxRating);
  const stars = [];

  for (let i = 1; i <= maxRating; i++) {
    stars.push(i <= filledStars ? '★' : '☆');
  }

  return (
    <View style={{ flexDirection: 'row' }}>
      {stars.map((star, index) => (
        <Text key={index}>{star}</Text>
      ))}
    </View>
  );
};


export default StarRating;
