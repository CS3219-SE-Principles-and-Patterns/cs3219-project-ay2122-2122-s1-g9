import 'firebase/database';

import { FirepadEvent, fromMonaco } from '@hackerrank/firepad';
import MonacoEditor, { EditorProps } from '@monaco-editor/react';
import { message } from 'antd';
import firebase from 'firebase/app';
import { editor } from 'monaco-editor';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import firebaseApp from '../firebase/firebaseApp';
import { useAppSelector } from '../redux/hooks';
import { getSessionId } from '../redux/matchSlice';
import BottomToolBar from './BottomToolBar';
import TopToolBar from './TopToolBar';

interface PeerprepEditorProps {
  questionTemplates: Types.QuestionTemplate[];
  questionLink: string;
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
}) {
  const sessionId = useAppSelector(getSessionId);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const sessDbRef = firebaseApp.database().ref(`/sessions/${sessionId}`);
  const currentUser = firebaseApp.auth().currentUser;

  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
  const [editorLanguage, setEditorLanguage] = useState<string>(
    questionTemplates[0].value
  );

  const options: editor.IStandaloneEditorConstructionOptions = {
    cursorStyle: 'line',
  };

  useEffect(() => {
    return () => {
      console.log('editor dispose');
      editorRef.current?.getModel()?.dispose();
      editorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!editorLoaded || editorRef.current == null || !editorLanguage) {
      return;
    }

    const contentRef = sessDbRef.child(`content/${editorLanguage}`);
    const firepad = fromMonaco(contentRef, editorRef.current);
    if (currentUser?.displayName) {
      firepad.setUserName(currentUser.displayName);
    }

    const firepadOnReady = () => {
      sessDbRef
        .child('defaultWriter')
        .get()
        .then((snapshot) => {
          const defaultWriterUid = snapshot.val(); // guaranteed to be inside because written by backend
          const defaultWriter = defaultWriterUid === currentUser?.uid; // currentUser guaranteed to be there

          if (defaultWriter) {
            const codeToWrite =
              questionTemplates.find(
                (language) => language.value === editorLanguage
              )?.defaultCode ?? '';

            if (firepad.isHistoryEmpty()) {
              console.log('writing default code');
              firepad.setText(codeToWrite);
            }
          }
        });
    };

    firepad.on(FirepadEvent.Ready, firepadOnReady);
    return () => {
      console.log('firepad dispose');
      firepad.off(FirepadEvent.Ready, firepadOnReady);
      firepad.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorLoaded, editorLanguage, questionTemplates]);

  // Listen for when the language changes
  useEffect(() => {
    const languageRef = sessDbRef.child('language');

    const onLanguageChange = (snapshot: firebase.database.DataSnapshot) => {
      const newLang = snapshot.val();
      setEditorLanguage(newLang);
    };

    languageRef.on('value', onLanguageChange);
    return () => {
      languageRef.off('value', onLanguageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only attach once

  const handleEditorMount: EditorProps['onMount'] = (editor, _monaco) => {
    editorRef.current = editor;
    setEditorLoaded(true);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    sessDbRef.update({ language: e.target.value });
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
        onMount={handleEditorMount}
      />
      <BottomToolBar />
    </StyledContainer>
  );
};

export default Editor;
