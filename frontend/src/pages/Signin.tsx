import { Button, Layout, Typography } from 'antd';
import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import { PageLayout } from '../components/Styles';
import useAuth from '../hooks/auth';

const { Title, Text } = Typography;

type LocationState = {
  from: Location;
};

const Signin: React.FC = function () {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const auth = useAuth();

  const { from } = location.state || { from: { pathName: '/signIn' } };
  const googleLogin = () => {
    auth?.signInWithGoogle().then(() => {
      console.log('redirecting....');
      history.replace('/', from);
    });
  };

  const facebookLogin = () => {
    auth?.signInWithFacebook().then(() => {
      history.replace('/', from);
    });
  };

  return (
    <PageLayout>
      <Sidebar>
        <Title level={3}>Sign in</Title>
        <Text>
          Get started by signing in to <Text strong>Peerprep</Text> with your
          Google or Facebook account.
        </Text>
        <Button type="primary" onClick={facebookLogin}>
          Sign In with Facebook
        </Button>
        <Button type="primary" onClick={googleLogin}>
          Sign In with Google
        </Button>
        <Text>Already have an account?</Text>
        <Link to="/signup">Sign up</Link>
      </Sidebar>
      <Layout>Large content area</Layout>
    </PageLayout>
  );
};

export default Signin;
