import Hero from '@components/Hero/Hero';
import { RouteComponentProps } from '@reach/router';
import React from 'react';


const Home: React.FC<RouteComponentProps> = () => {
  return (
    <>
      <Hero />
    </>
  );
};

export default Home;
