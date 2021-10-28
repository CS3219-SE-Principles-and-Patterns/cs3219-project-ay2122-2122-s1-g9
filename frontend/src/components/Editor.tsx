import 'firebase/database';

import { fromMonaco } from '@hackerrank/firepad';
import MonacoEditor, { EditorProps, Monaco } from '@monaco-editor/react';
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
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const sessDbRef = firebaseApp.database().ref(`/sessions/${sessionId}`);
  const currentUser = firebaseApp.auth().currentUser;
  const [defaultWriter, setdefaultWriter] = useState<boolean>(false);

  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
  const [editorLanguage, setEditorLanguage] = useState<string>(
    questionTemplates[0].value
  );

  const options: editor.IStandaloneEditorConstructionOptions = {
    cursorStyle: 'line',
  };

  useEffect(() => {
    const defaultWriterPath = sessDbRef.child('defaultWriter');

    const onWriterChange = (snapshot: firebase.database.DataSnapshot) => {
      const writerUid = snapshot.val();
      if (currentUser?.uid) {
        // currentUser will not be null
        setdefaultWriter(writerUid === currentUser.uid);
      }
    };

    defaultWriterPath.on('value', onWriterChange);
    return () => {
      defaultWriterPath.off('value', onWriterChange);
    };
  }, [sessDbRef, currentUser]);

  useEffect(() => {
    if (!editorLoaded || editorRef.current == null) {
      return;
    }

    const contentRef = sessDbRef.child('content');
    const firepad = fromMonaco(contentRef, editorRef.current);
    if (currentUser?.displayName) {
      firepad.setUserName(currentUser.displayName);
    }

    return () => {
      firepad.dispose();
    };
  }, [editorLoaded, sessDbRef, currentUser]);

  // Listen for when the language changes
  useEffect(() => {
    // if (!editorLoaded) {
    //   return;
    // }

    // Need to execute the effect again on defaultWriter change so that the internals of onLanguageChange is updated correctly

    console.log('executed use effect');
    const languageRef = sessDbRef.child('language');

    const onLanguageChange = (snapshot: firebase.database.DataSnapshot) => {
      const newLang = snapshot.val();
      setEditorLanguage(newLang);

      console.log('editorRef current info');
      console.log(editorRef.current == null);
      console.log('end');

      if (editorRef.current != null) {
        if (defaultWriter) {
          const codeToWrite =
            questionTemplates.find((language) => language.value === newLang)
              ?.defaultCode ?? '';

          editorRef.current.setValue(codeToWrite);
        }
      }
    };

    languageRef.on('value', onLanguageChange);
    return () => {
      languageRef.off('value', onLanguageChange);
    };
  }, [defaultWriter]); // only attach once

  // useEffect(() => {
  //   console.log(`[Plain useEffect] Writing default code of ${editorLanguage}`);
  // });

  const handleEditorMount: EditorProps['onMount'] = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setEditorLoaded(true);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // const editorRef = firebaseApp.database().ref(`sessions/${sessionId}`);
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
        // defaultValue={
        // questionTemplates.find(
        //   (language) => language.value === editorLanguage
        // )?.defaultCode
        // 'asdf'
        // }
        onMount={handleEditorMount}
      />
      <BottomToolBar setQuestion={setQuestion} />
    </StyledContainer>
  );
};

export default Editor;
