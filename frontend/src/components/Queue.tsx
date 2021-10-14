import { LoadingOutlined } from '@ant-design/icons';
import { Button, Layout, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import firebaseApp from '../firebase/firebaseApp';
import useAuth from '../hooks/auth';
import { Spacer } from './Styles';

const { Title, Text } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.white};
`;

const MediumText = styled(Text)`
  font-weight: 500;
`;

interface Props {
  handleCancelClick: () => void;
}

const Queue: React.FC<Props> = function (props) {
  const { handleCancelClick } = props;

  const history = useHistory();
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const authContext = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  useEffect(() => {
    const user = authContext?.user;
    if (user == null) {
      return;
    }

    const uid = user.uid;
    const userRef = firebaseApp.database().ref(`users/${uid}`);
    userRef.on('value', (snapshot) => {
      const notifications: Types.MessageQueueNotif[] = Object.values(
        snapshot.val()
      );
      const latestNotif: Types.MessageQueueNotif =
        notifications[notifications.length - 1];

      if (latestNotif.type === 'FOUND_SESSION') {
        history.replace('/collaborate');
      } else if (latestNotif.type === 'CANNOT_FIND_SESSION') {
        handleCancelClick();
      }
    });
  }, [authContext?.user, handleCancelClick, history]);

  return (
    <StyledLayout>
      <Spin indicator={antIcon} />
      <Spacer $height="24px" />
      <Title level={3} style={{ fontWeight: 400, margin: 0 }}>
        Matching you with another student
      </Title>
      <Spacer $height="40px" />
      <Button type="ghost" size="large" onClick={handleCancelClick}>
        Cancel
      </Button>
      <Spacer $height="16px" />
      <Text>
        Timeout in: <MediumText>{timeLeft}s</MediumText>
      </Text>
    </StyledLayout>
  );
};

export default Queue;
