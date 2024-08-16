import React from 'react';
import Layout from './layout';

const withLayout = (Component) => (props) => {
  return (
    <Layout>
      <Component {...props} />
    </Layout>
  );
};

export default withLayout;
