import { LoadingOutlined } from '@ant-design/icons';
import { Button, Collapse, Layout, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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

const Queue: React.FC = function () {
  const [timeLeft, setTimeLeft] = useState<number>(30);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <StyledLayout>
      <Spin indicator={antIcon} />
      <Spacer $height="24px" />
      <Title level={3} style={{ fontWeight: 400, margin: 0 }}>
        Matching you with another student
      </Title>
      <Spacer $height="40px" />
      <Button type="ghost" size="large">
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
