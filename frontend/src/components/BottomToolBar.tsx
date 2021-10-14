import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import firebaseApp from '../firebase/firebaseApp';
import { Spacer } from './Styles';

interface BottomToolBarProps {
  setQuestion: React.Dispatch<React.SetStateAction<Types.Question>>;
}

type LocationState = {
  from: Location;
};

const ChangeQuestionButton = styled(Button)`
  border: 1px solid #1890ff;
  color: #1890ff;
`;

const StyledBottomToolBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background: #e9f7fe;
  height: 64px;
  border-top: 1px solid #91d5ff;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BottomToolBar: React.FC<BottomToolBarProps> = function ({ setQuestion }) {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { confirm } = Modal;

  const showConfirm = () => {
    confirm({
      title: 'Not so fast...',
      icon: <ExclamationCircleOutlined />,
      content: (
        <p>
          Finishing the session will end the session for both you and your peer.
          <br />
          <strong>Are you sure you want to do that?</strong>
        </p>
      ),
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(Math.random() > 0 ? resolve : reject, 1000);
        })
          .then(() => {
            history.push('/', from);
          })
          .catch((error) => console.error(error));
      },
    });
  };

  const changeQuestion = () => {
    const getQuestion = firebaseApp.functions().httpsCallable('getQuestion');
    getQuestion({ slug: 'find-minimum-in-rotated-sorted-array' })
      .then((result) => {
        console.log(result);
        setQuestion(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const { from } = location.state || { from: { pathName: '/collaborate' } };

  return (
    <StyledBottomToolBar>
      <LeftContainer>
        <Spacer $width="16px" />
        <ChangeQuestionButton onClick={changeQuestion}>
          Change the question
        </ChangeQuestionButton>
      </LeftContainer>
      <RightContainer>
        <Button type="primary" onClick={showConfirm}>
          Finish Session
        </Button>
        <Spacer $width="16px" />
      </RightContainer>
    </StyledBottomToolBar>
  );
};

export default BottomToolBar;
