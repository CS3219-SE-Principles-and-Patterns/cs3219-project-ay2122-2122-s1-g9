import { fromMonaco } from '@hackerrank/firepad';
import MonacoEditor, { EditorProps, Monaco } from '@monaco-editor/react';
import { message } from 'antd';
import { editor } from 'monaco-editor';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import firebaseApp from '../firebase/firebaseApp';
import BottomToolBar from './BottomToolBar';
import TopToolBar from './TopToolBar';

interface PeerprepEditorProps {
  questionTemplates: Types.QuestionTemplate[];
  questionLink: string;
  isChatVisible: boolean;
  setChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setQuestion: React.Dispatch<React.SetStateAction<Types.Question>>;
}

const StyledContainer = styled.div`
  flex-grow: 1;
  max-height: 100vh;
  border: 1px solid #91d5ff;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
`;

const StyledMonacoEditor = styled(MonacoEditor)`
  flex: 'flex-grow';
`;

const Editor: React.FC<PeerprepEditorProps> = function ({
  isChatVisible,
  setChatVisible,
  questionLink,
  questionTemplates,
  setQuestion,
}) {
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
  const [editorLanguage, setEditorLanguage] = useState<string>(
    questionTemplates[0].value
  );

  const options: editor.IStandaloneEditorConstructionOptions = {
    cursorStyle: 'line',
  };

  useEffect(() => {
    if (!editorLoaded || editorRef.current == null) {
      return;
    }

    const dbRef = firebaseApp.database().ref('testEditor/content');
    const currentUser = firebaseApp.auth().currentUser;
    const firepad = fromMonaco(dbRef, editorRef.current);
    if (currentUser?.displayName) {
      firepad.setUserName(currentUser.displayName);
    }
  }, [editorLoaded]);

  // Listen for when the language changes
  useEffect(() => {
    const languageRef = firebaseApp.database().ref('testEditor/language');
    languageRef.on('value', (snapshot) => {
      const data = snapshot.val();
      setEditorLanguage(data);
    });
  }, []);

  const handleEditorMount: EditorProps['onMount'] = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setEditorLoaded(true);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const editorRef = firebaseApp.database().ref('testEditor');
    editorRef.update({ language: e.target.value });
  };

  const handleCopy = (editorVal: string) => () => {
    navigator.clipboard.writeText(editorVal);
    message.success(
      'Editor content starting with: "' +
        editorVal.substring(0, 32) +
        '" copied to clipboard 👍'
    );
  };

  return (
    <StyledContainer>
      <TopToolBar
        editorLanguage={editorLanguage}
        handleLanguageChange={handleLanguageChange}
        questionTemplates={questionTemplates}
        handleCopy={handleCopy(editorRef.current?.getValue() ?? '')}
        isChatVisible={isChatVisible}
        toggleChat={() => setChatVisible(!isChatVisible)}
        questionLink={questionLink}
      />
      <StyledMonacoEditor
        options={options}
        path={editorLanguage}
        defaultLanguage={editorLanguage}
        defaultValue={
          questionTemplates.find(
            (language) => language.value === editorLanguage
          )?.defaultCode
        }
        onMount={handleEditorMount}
      />
      <BottomToolBar setQuestion={setQuestion} />
    </StyledContainer>
  );
};

export default Editor;
