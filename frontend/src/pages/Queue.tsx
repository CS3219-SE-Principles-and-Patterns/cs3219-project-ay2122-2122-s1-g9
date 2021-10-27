import { LoadingOutlined } from '@ant-design/icons';
import { Button, Layout, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';

import PageLayout from '../components/PageLayout';
import { Spacer } from '../components/Styles';
import { removeUserFromQueue } from '../firebase/functions';
import useMessageQueue from '../hooks/messageQueue';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getIsQueuing, getSessionId, setIsQueuing } from '../redux/matchSlice';

const { Title, Text } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;

const StyledLayout = styled(Layout)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.colors.white};
`;

const MediumText = styled(Text)`
  font-weight: 500;
`;

const Queue: React.FC = function () {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const isQueueing = useAppSelector(getIsQueuing);
  const sessionId = useAppSelector(getSessionId);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const location = useLocation();

  useMessageQueue();

  // Should only run on initial page load
  useEffect(() => {
    if (sessionId != null) {
      history.replace('/collaborate');
    } else if (!isQueueing) {
      history.replace('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const handleCancelClick = () => {
    removeUserFromQueue({ queueName: location.state as string })
      .then(() => {
        dispatch(setIsQueuing(false));
        history.replace('/');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <PageLayout>
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
    </PageLayout>
  );
};

export default Queue;
