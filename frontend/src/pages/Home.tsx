import { Button, message, Select, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import GetToWork from '../components/GetToWork';
import PageLayout from '../components/PageLayout';
import Sidebar from '../components/Sidebar';
import { Spacer, TwoColLayout } from '../components/Styles';
import { addUserToQueue } from '../firebase/functions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getHasNoMatchFound,
  setHasNoMatchFound,
  setIsQueuing,
} from '../redux/matchSlice';

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
  const hasNoMatchFound = useAppSelector(getHasNoMatchFound);
  const [difficulty, setDifficulty] = useState<Types.Difficulty | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hasNoMatchFound) {
      message.info(
        'Sorry! Seems like there are no matches for your difficulty level. Try again later 👍',
        5,
        () => {
          dispatch(setHasNoMatchFound(false));
        }
      );
    }
  }, [dispatch, hasNoMatchFound]);

  const handleSelect = (value: Types.Difficulty) => {
    setDifficulty(value);
  };

  const handleClick = () => {
    if (!difficulty) {
      return;
    }
    setIsLoading(true);

    addUserToQueue({ queueName: difficulty })
      .then(() => {
        setIsLoading(false);
        dispatch(setIsQueuing(true));
        history.replace('/queue', difficulty);
      })
      .catch((error) => {
        setIsLoading(false);
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
              loading={isLoading}
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
