import { fromMonaco } from '@hackerrank/firepad';
import MonacoEditor, { EditorProps, Monaco } from '@monaco-editor/react';
import { message } from 'antd';
import { editor } from 'monaco-editor';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import firebaseApp from '../firebase/firebaseApp';
import { useAppSelector } from '../redux/hooks';
import { getIsDefaultCodeWriter, getSessionId } from '../redux/matchSlice';
import BottomToolBar from './BottomToolBar';
import TopToolBar from './TopToolBar';

interface PeerprepEditorProps {
  questionTemplates: Types.QuestionTemplate[];
  questionLink: string;
  setQuestion: React.Dispatch<React.SetStateAction<Types.Question>>;
}

const StyledContainer = styled.div`
  flex-grow: 1;
  max-height: 100%;
  border: 1px solid #91d5ff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const StyledMonacoEditor = styled(MonacoEditor)`
  flex: flex-grow;
`;

const Editor: React.FC<PeerprepEditorProps> = function ({
  questionLink,
  questionTemplates,
  setQuestion,
}) {
  const sessionId = useAppSelector(getSessionId);
  const isDefaultCodeWriter = useAppSelector(getIsDefaultCodeWriter);
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
  const [editorLanguage, setEditorLanguage] = useState<string>(
    questionTemplates[0].value
  );
  const [defaultCodeWritten, setDefaultCodeWritten] = useState<boolean>(false);

  const options: editor.IStandaloneEditorConstructionOptions = {
    cursorStyle: 'line',
  };

  useEffect(() => {
    if (!editorLoaded || editorRef.current == null) {
      return;
    }

    const dbRef = firebaseApp.database().ref(`sessions/${sessionId}/content`);
    const currentUser = firebaseApp.auth().currentUser;
    const firepad = fromMonaco(dbRef, editorRef.current);
    if (currentUser?.displayName) {
      firepad.setUserName(currentUser.displayName);
    }
  }, [editorLoaded, sessionId]);

  // Listen for when the language changes
  useEffect(() => {
    const languageRef = firebaseApp
      .database()
      .ref(`sessions/${sessionId}/language`);
    languageRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data == null) {
        return;
      }
      setEditorLanguage(data.language);
      console.log(data.defaultCodeWritten);
      setDefaultCodeWritten(data.defaultCodeWritten?.[data.language] ?? false);
    });
  }, [sessionId]);

  const handleEditorMount: EditorProps['onMount'] = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setEditorLoaded(true);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const editorRef = firebaseApp
      .database()
      .ref(`sessions/${sessionId}/language`);
    editorRef.child('language').set(e.target.value);
    editorRef.child('defaultCodeWritten').child(editorLanguage).set(true);
  };

  const handleCopy = () => {
    if (editorRef.current) {
      const editorVal = editorRef.current.getValue();
      navigator.clipboard.writeText(editorVal);
      message.success(
        'Editor content starting with: "' +
          editorVal.substring(0, 32) +
          '" copied to clipboard 👍'
      );
    } else {
      message.error('Editor content not copied. Try again!');
    }
  };

  return (
    <StyledContainer>
      <TopToolBar
        editorLanguage={editorLanguage}
        handleLanguageChange={handleLanguageChange}
        questionTemplates={questionTemplates}
        handleCopy={handleCopy}
        questionLink={questionLink}
      />
      <StyledMonacoEditor
        options={options}
        path={editorLanguage}
        defaultLanguage={editorLanguage}
        defaultValue={
          isDefaultCodeWriter && !defaultCodeWritten
            ? questionTemplates.find(
                (language) => language.value === editorLanguage
              )?.defaultCode
            : undefined
        }
        onMount={handleEditorMount}
      />
      <BottomToolBar setQuestion={setQuestion} />
    </StyledContainer>
  );
};

export default Editor;
