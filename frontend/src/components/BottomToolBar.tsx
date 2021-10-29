import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { changeQuestionRequest, stopSession } from '../firebase/functions';
import { useAppDispatch } from '../redux/hooks';
import { setQnsId, setSessionId } from '../redux/matchSlice';
import { Spacer } from './Styles';

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
const { confirm } = Modal;

const BottomToolBar: React.FC = function () {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const location = useLocation<LocationState>();

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
        return stopSession()
          .then(() => {
            dispatch(setSessionId(null));
            dispatch(setQnsId(null));
            history.push('/', from);
          })
          .catch((error) => console.error(error));
      },
    });
  };

  const changeTheQuestion = () => {
    confirm({
      title: 'Not so fast...',
      icon: <ExclamationCircleOutlined />,
      content: (
        <p>
          Changing the question will cause your editor data to be lost.
          <br />
          <strong>Are you sure you want to do that?</strong>
        </p>
      ),
      onOk() {
        return changeQuestionRequest()
          .then(() => {
            message.success(
              'Change question request was sent to your teammate! '
            );
          })
          .catch((error) => {
            console.error(error);
          });
      },
    });
  };

  const { from } = location.state || { from: { pathName: '/collaborate' } };

  return (
    <StyledBottomToolBar>
      <LeftContainer>
        <Spacer $width="16px" />
        <ChangeQuestionButton onClick={changeTheQuestion}>
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
