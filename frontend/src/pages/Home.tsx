import { Button, Select, Typography } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import GetToWork from '../components/GetToWork';
import Sidebar from '../components/Sidebar';
import { PageLayout, Spacer } from '../components/Styles';

const { Option } = Select;
const { Title, Text } = Typography;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  height: 100%;
  padding: 40px 32px 60px 32px;
`;

const DifficultySelector = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledButton = styled(Button)`
  height: 56px;
  font-weight: 500;
`;

const Home: React.FC = function () {
  const [difficulty, setDifficulty] = useState<Types.Difficulty | null>(null);

  const handleSelect = (value: Types.Difficulty) => {
    setDifficulty(value);
  };

  return (
    <PageLayout>
      <Sidebar>
        <Container>
          <Title level={1}>Welcome to Peerprep 👋</Title>
          <Spacer $height="16px" />
          <Text style={{ color: '#8C8C8C' }}>
            Get matched with another student and practice for your interview
            together
          </Text>
          <Spacer $height="80px" />
          <DifficultySelector>
            <Text>Difficulty level</Text>
            <Select placeholder="Select difficulty" onChange={handleSelect}>
              <Option value="easy">Easy</Option>
              <Option value="medium">Medium</Option>
              <Option value="hard">Hard</Option>
            </Select>
          </DifficultySelector>
          <Spacer $height="50px" />
          <StyledButton
            type="primary"
            size="large"
            disabled={difficulty == null}
          >
            Get matched
          </StyledButton>
        </Container>
      </Sidebar>
      <GetToWork />
    </PageLayout>
  );
};

export default Home;
