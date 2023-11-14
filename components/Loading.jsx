import * as React from 'react';
import { Button } from 'react-native-paper';

const Loading = () => (
  <Button icon="loading" mode="contained" onPress={() => console.log('Pressed')}>
  loading
  </Button>
);

export default Loading;