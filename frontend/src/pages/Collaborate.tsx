import 'firebase/database';

import { LoadingOutlined } from '@ant-design/icons';
import { Collapse, Layout, message, Modal, Spin, Typography } from 'antd';
import firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Chat from '../components/Chat';
import Editor from '../components/Editor';
import PageLayout from '../components/PageLayout';
import Sidebar from '../components/Sidebar';
import { Spacer, TwoColLayout } from '../components/Styles';
import { changeQuestion, getQuestion } from '../firebase/functions';
import useAuth from '../hooks/auth';
import useMessageQueue from '../hooks/messageQueue';
import { getIsVisible } from '../redux/chatSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  getHasChangeQnRequest,
  getQnsId,
  setHasChangeQnRequest,
} from '../redux/matchSlice';

const { Title, Text } = Typography;
const { Content } = Layout;
const { Panel } = Collapse;
const { confirm } = Modal;

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 32px 60px 32px;
`;

const EditorContent = styled(Content)`
  display: flex;
  flex-direction: row;
`;

const StyledText = styled(Text)`
  overflow-y: auto;
`;

const DifficultyLevel = styled(Text)<{ $level: string }>`
  margin-bottom: 0;
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

const Separator = styled.span`
  width: 240.5px;
  height: 0px;
  left: 0px;
  top: 110px;
  border: 1px solid #bfbfbf;
`;

const isOfflineForDatabase = {
  state: 'offline',
  lastUpdated: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: 'online',
  lastUpdated: firebase.database.ServerValue.TIMESTAMP,
};

// objective is to omit the ones that are not in the map
// rename some stuff accordingly like python
const cleanQnTemplates = (templates: Types.QuestionTemplate[]) => {
  const monacoLangSet = new Set<string>();
  monacoLangSet
    .add('abap')
    .add('apex')
    .add('azcli')
    .add('bat')
    .add('bicep')
    .add('cameligo')
    .add('clojure')
    .add('coffee')
    .add('cpp')
    .add('csharp')
    .add('csp')
    .add('css')
    .add('dart')
    .add('dockerfile')
    .add('ecl')
    .add('elixir')
    .add('fillers')
    .add('flow9')
    .add('fsharp')
    .add('go')
    .add('graphql')
    .add('handlebars')
    .add('hcl')
    .add('html')
    .add('ini')
    .add('java')
    .add('javascript')
    .add('julia')
    .add('kotlin')
    .add('less')
    .add('lexon')
    .add('liquid')
    .add('lua')
    .add('m3')
    .add('markdown')
    .add('mips')
    .add('msdax')
    .add('mysql')
    .add('objective-c')
    .add('pascal')
    .add('pascaligo')
    .add('perl')
    .add('pgsql')
    .add('php')
    .add('postiats')
    .add('powerquery')
    .add('powershell')
    .add('protobuf')
    .add('pug')
    .add('python')
    .add('qsharp')
    .add('r')
    .add('razor')
    .add('redis')
    .add('redshift')
    .add('restructuredtext')
    .add('ruby')
    .add('rust')
    .add('sb')
    .add('scala')
    .add('scheme')
    .add('scss')
    .add('shell')
    .add('solidity')
    .add('sophia')
    .add('sparql')
    .add('sql')
    .add('st')
    .add('swift')
    .add('systemverilog')
    .add('tcl')
    .add('twig')
    .add('typescript')
    .add('vb')
    .add('xml')
    .add('yaml');

  const omitPython = templates.filter(
    (template: Types.QuestionTemplate) => template.value != 'python'
  );
  console.log('omitPython: ', omitPython);

  return omitPython
    .map((template: Types.QuestionTemplate) => {
      const updatedTemplate = { ...template };
      switch (template.value) {
        case 'golang':
          updatedTemplate.value = 'go';
          break;
        case 'python3':
          updatedTemplate.value = 'python';
          updatedTemplate.text = 'Python';
          break;
      }
      return updatedTemplate;
    })
    .filter((template: Types.QuestionTemplate) => {
      return monacoLangSet.has(template.value);
    });
};

const Collaborate: React.FC = function () {
  const isChatVisible = useAppSelector(getIsVisible);
  const qnId = useAppSelector(getQnsId) as string;
  const hasRequest = useAppSelector(getHasChangeQnRequest);
  const [question, setQuestion] = useState<Types.Question>(
    {} as Types.Question
  );
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);

  const auth = useAuth();
  const dispatch = useAppDispatch();
  useMessageQueue();

  const showChangeQuestionModal = () => {
    confirm({
      title: 'Change question?',
      content:
        'Your teammate has requested to change question. Will you allow it?',
      onOk() {
        return changeQuestion()
          .then(() => {
            dispatch(setHasChangeQnRequest(false));
          })
          .catch((error) => {
            console.error(error);
          });
      },
      onCancel() {
        dispatch(setHasChangeQnRequest(false));
      },
    });
  };

  useEffect(() => {
    if (hasRequest) {
      showChangeQuestionModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasRequest]);

  // Activate presence here
  useEffect(() => {
    if (auth?.user?.uid == null) {
      return;
    }

    // See https://firebase.google.com/docs/firestore/solutions/presence
    const uid = auth.user.uid;
    const userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

    firebase
      .database()
      .ref('.info/connected')
      .on('value', (snapshot) => {
        if (snapshot.val() == false) {
          return;
        }

        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(() => {
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      });
  });

  useEffect(() => {
    if (qnId) {
      getQuestion({ qnsId: qnId })
        .then((result) => {
          setQuestion(result.data);
          setPageLoaded(true);
          message.success('Question loaded for you and your teammate!');
        })
        .catch((error) => {
          console.error(error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qnId]);

  if (!pageLoaded) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return <Spin indicator={antIcon} />;
  }

  return (
    <PageLayout>
      <TwoColLayout>
        <Sidebar>
          <Spacer $height="64px" />
          <Container>
            <Title level={1}>{question.name}</Title>
            <DifficultyLevel $level={question.level}>
              {question.level}
            </DifficultyLevel>
            <Spacer $height="24px" />
            <Separator />
            <Spacer $height="32px" />
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
          </Container>
        </Sidebar>
        <EditorContent>
          <Editor
            questionTemplates={cleanQnTemplates(question.templates)}
            questionLink={question.link}
          />
          {isChatVisible && <Chat />}
        </EditorContent>
      </TwoColLayout>
    </PageLayout>
  );
};

export default Collaborate;
