import { Button, Layout, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import { PageLayout } from '../components/Styled';

const { Title, Text } = Typography;

const Signin: React.FC = function () {
  return (
    <PageLayout>
      <Sidebar>
        <Title level={3}>Sign in</Title>
        <Text>
          Get started by signing in to <Text strong>Peerprep</Text> with your
          Google or Facebook account.
        </Text>
        <Button type="primary">Sign Ip with Facebook</Button>
        <Button type="primary">Sign Ip with Google</Button>
        <Text>Already have an account?</Text>
        <Link to="/signup">Sign up</Link>
      </Sidebar>
      <Layout>Large content area</Layout>
    </PageLayout>
  );
};

export default Signin;
