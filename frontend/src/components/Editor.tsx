import 'firebase/database';

import { FirepadEvent, fromMonaco } from '@hackerrank/firepad';
import MonacoEditor, { EditorProps } from '@monaco-editor/react';
import { message } from 'antd';
import firebase from 'firebase/app';
import { editor } from 'monaco-editor';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import firebaseApp from '../firebase/firebaseApp';
import { updateAndGetWriter } from '../firebase/functions';
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
  const currentUser = firebaseApp.auth().currentUser;

  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
  const [editorLanguage, setEditorLanguage] = useState<string>(
    questionTemplates[0].value
  );

  const options: editor.IStandaloneEditorConstructionOptions = {
    cursorStyle: 'line',
  };

  useEffect(() => {
    if (
      !editorLoaded ||
      editorRef.current == null ||
      !editorLanguage ||
      !sessionId
    ) {
      return;
    }

    // Monaco editor somehow caches the value that was displayed in the previous session.
    // The default behaviour for Firepad is to write existing values in the editor into the RTDB.
    // Hence, we have to set the value of the editor to empty before initialising Firepad
    // as we do not want content from the previous session to be used in the new session.
    editorRef.current.setValue('');
    const contentRef = firebaseApp
      .database()
      .ref(`/sessions/${sessionId}/content/${editorLanguage}`);
    const firepad = fromMonaco(contentRef, editorRef.current);
    if (currentUser?.displayName) {
      firepad.setUserName(currentUser.displayName);
    }

    const firepadOnReady = () => {
      updateAndGetWriter({ sessId: sessionId }).then((res) => {
        const isWriter = res.data.writerId === currentUser?.uid; // currentUser guaranteed to be there

        if (isWriter) {
          const codeToWrite =
            questionTemplates.find(
              (language) => language.value === editorLanguage
            )?.defaultCode ?? '';

          if (firepad.isHistoryEmpty()) {
            firepad.setText(codeToWrite);
          }
        }
      });
    };

    firepad.on(FirepadEvent.Ready, firepadOnReady);
    return () => {
      firepad.off(FirepadEvent.Ready, firepadOnReady);
      firepad.dispose();
    };
  }, [
    editorLoaded,
    editorLanguage,
    questionTemplates,
    sessionId,
    currentUser?.displayName,
    currentUser?.uid,
  ]);

  // Listen for when the language changes
  useEffect(() => {
    const languageRef = firebaseApp
      .database()
      .ref(`/sessions/${sessionId}/language`);

    const onLanguageChange = (snapshot: firebase.database.DataSnapshot) => {
      const newLang = snapshot.val();
      setEditorLanguage(newLang);
    };

    languageRef.on('value', onLanguageChange);
    return () => {
      languageRef.off('value', onLanguageChange);
    };
  }, [sessionId]);

  const handleEditorMount: EditorProps['onMount'] = (editor, _monaco) => {
    editorRef.current = editor;
    setEditorLoaded(true);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    firebaseApp
      .database()
      .ref(`/sessions/${sessionId}`)
      .update({ language: e.target.value });
  };

  const handleCopy = () => {
    if (editorRef.current) {
      const editorVal = editorRef.current.getValue();
      navigator.clipboard.writeText(editorVal);
      message.success(
        'Editor content starting with: "' +
          editorVal.substring(0, 32) +
          '" copied to clipboard ????'
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
