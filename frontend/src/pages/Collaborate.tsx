import { Collapse, Layout, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Chat from '../components/Chat';
import Editor from '../components/Editor';
import Sidebar from '../components/Sidebar';
import { PageLayout, Spacer } from '../components/Styles';
import firebaseApp from '../firebase/firebaseApp';

const { Title, Text } = Typography;
const { Content } = Layout;

const Container = styled.div`
  padding: 0 32px 60px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-height: 100vh;
`;

const EditorContent = styled(Content)`
  display: flex;
  flex-direction: row;
`;

const StyledText = styled(Text)`
  overflow-y: auto;
`;

const DifficultyLevel = styled(Text)<{ $level: string }>`
  margin-bottom: 0.5em;
  font-weight: 400;
  font-size: 20px;
  text-transform: capitalize;
  color: ${(props) => {
    if (props.$level === 'easy') {
      return '#5B8C00';
    } else if (props.$level === 'medium') {
      return '#E9B847';
    } else {
      return '#D9475D';
    }
  }};
  font-weight: normal;
`;

const Collaborate: React.FC = function () {
  const [isChatVisible, setChatVisible] = useState<boolean>(false);
  const [question, setQuestion] = useState<Types.Question>(
    {} as Types.Question
  );
  const getQuestion = firebaseApp.functions().httpsCallable('getQuestion');
  const { Panel } = Collapse;

  useEffect(() => {
    getQuestion({ slug: 'two-sum' })
      .then((result) => {
        console.log(result);
        setQuestion(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <PageLayout>
      <Sidebar>
        <Spacer $height="64px" />
        <Container>
          <Title level={1}>{question.name}</Title>
          <DifficultyLevel $level={question.level}>
            {question.level}
          </DifficultyLevel>
          <Spacer $height="16px" />
          <StyledText>
            <div dangerouslySetInnerHTML={{ __html: question.desc }} />
            <Spacer $height="16px" />
            <Collapse>
              {question.hints?.map((hintString: string, index: number) => (
                <Panel header={'Show Hint ' + (index + 1)} key={index}>
                  <div dangerouslySetInnerHTML={{ __html: hintString }} />
                </Panel>
              ))}
            </Collapse>
            <Spacer $height="24px" />
          </StyledText>
          <Spacer $height="68px" />
        </Container>
      </Sidebar>
      <EditorContent>
        <Editor
          questionLink={question.link}
          isChatVisible={isChatVisible}
          setChatVisible={setChatVisible}
          setQuestion={setQuestion}
        />
        {isChatVisible && <Chat />}
      </EditorContent>
    </PageLayout>
  );
};

export default Collaborate;
