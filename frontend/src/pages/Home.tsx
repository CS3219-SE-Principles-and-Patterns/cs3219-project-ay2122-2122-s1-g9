import { Button, Select, Typography } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import GetToWork from '../components/GetToWork';
import PageLayout from '../components/PageLayout';
import Sidebar from '../components/Sidebar';
import { Spacer, TwoColLayout } from '../components/Styles';
import firebaseApp from '../firebase/firebaseApp';
import { useAppDispatch } from '../redux/hooks';
import { setIsQueuing } from '../redux/matchSlice';

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

  .ant-select-selector {
    border-radius: 8px !important;
  }
`;

const StyledButton = styled(Button)`
  height: 56px;
  border-radius: 8px;
  font-weight: 500;
`;

const Home: React.FC = function () {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const [difficulty, setDifficulty] = useState<Types.Difficulty | null>(null);
  const addUserToQuestionQueue = firebaseApp
    .functions()
    .httpsCallable('addUserToQuestionQueue');

  const handleSelect = (value: Types.Difficulty) => {
    setDifficulty(value);
  };

  const handleClick = () => {
    addUserToQuestionQueue({ queueName: difficulty })
      .then(() => {
        dispatch(setIsQueuing(true));
        history.replace('/queue');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <PageLayout>
      <TwoColLayout>
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
              <Select
                placeholder="Select difficulty"
                value={difficulty ?? undefined}
                onChange={handleSelect}
              >
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
              onClick={handleClick}
            >
              Get matched
            </StyledButton>
          </Container>
        </Sidebar>
        <GetToWork />
      </TwoColLayout>
    </PageLayout>
  );
};

export default Home;
