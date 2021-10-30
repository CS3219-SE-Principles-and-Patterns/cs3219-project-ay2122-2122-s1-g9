import 'firebase/database';

import {
  FirebaseAdapter,
  Firepad,
  FirepadEvent,
  fromMonaco,
  MonacoAdapter,
} from '@hackerrank/firepad';
import MonacoEditor, { EditorProps, Monaco } from '@monaco-editor/react';
import { message } from 'antd';
import firebase from 'firebase/app';
import { editor } from 'monaco-editor';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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

  const defaultCodeWrittenInitialState = useMemo(() => {
    const state: { [key: string]: boolean } = {};
    questionTemplates.forEach((template) => {
      state[template.value] = false;
    });

    return state;
  }, [questionTemplates]);

  const [defaultCodeWritten, setDefaultCodeWritten] = useState<{
    [key: string]: boolean;
  }>(defaultCodeWrittenInitialState);

  const options: editor.IStandaloneEditorConstructionOptions = {
    cursorStyle: 'line',
  };

  // useEffect(() => {
  //   return () => {
  //     editorRef.current = null;
  //   };
  // }, []);

  // useEffect(() => {
  //   if (!editorLoaded || editorRef.current == null || !editorLanguage) {
  //     return;
  //   }

  //   // const contentRef = sessDbRef.child(`content/${editorLanguage}`);
  //   const contentRef = firebaseApp
  //     .database()
  //     .ref(`/sessions/${sessionId}/content/${editorLanguage}`);

  //   sessDbRef
  //     .child('defaultWriter')
  //     .get()
  //     .then((snapshot) => {
  //       if (editorRef.current == null) {
  //         return;
  //       }

  //       const defaultWriterUid = snapshot.val(); // guaranteed to be inside because written by backend
  //       const defaultWriter = defaultWriterUid === currentUser?.uid; // currentUser guaranteed to be there

  //       if (defaultWriter) {
  //         editorRef.current?.setValue('');
  //       }

  //       const firepad = fromMonaco(contentRef, editorRef.current);
  //       if (currentUser?.displayName) {
  //         firepad.setUserName(currentUser.displayName);
  //       }
  //     });

  //   const firepadOnReady = (_ready: boolean) => {
  //     console.log(_ready);
  //     sessDbRef
  //       .child('defaultWriter')
  //       .get()
  //       .then((snapshot) => {
  //         const defaultWriterUid = snapshot.val(); // guaranteed to be inside because written by backend
  //         const defaultWriter = defaultWriterUid === currentUser?.uid; // currentUser guaranteed to be there

  //         if (defaultWriter) {
  //           const codeToWrite =
  //             questionTemplates.find(
  //               (language) => language.value === editorLanguage
  //             )?.defaultCode ?? '';

  //           // Rewrite history

  //           // console.log('i am default writer');

  //           // This will be the last setText executed throughout the initialization of firepad and related libraries.
  //           if (!defaultCodeWritten[editorLanguage]) {
  //             firepad.setText(codeToWrite);

  //             const newState = { ...defaultCodeWritten };
  //             newState[editorLanguage] = true;
  //             setDefaultCodeWritten(newState);
  //           }

  //           // if (firepad.isHistoryEmpty()) {
  //           //   console.log('writing default code');
  //           //   firepad.setText(codeToWrite);
  //           // }
  //         }
  //       });
  //   };

  //   firepad.on(FirepadEvent.Ready, firepadOnReady);
  //   return () => {
  //     firepad.off(FirepadEvent.Ready, firepadOnReady);
  //     firepad.dispose();
  //   };

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [editorLoaded, editorLanguage, questionTemplates]);

  useEffect(() => {
    if (!editorLoaded || editorRef.current == null || !editorLanguage) {
      return;
    }

    if (!currentUser) {
      console.log(
        'Clause should not be entered. Need currentUser to init firepad'
      );
      return;
    }

    // const contentRef = sessDbRef.child(`content/${editorLanguage}`);
    const contentRef = firebaseApp
      .database()
      .ref(`/sessions/${sessionId}/content/${editorLanguage}`);
    // const firepad = fromMonaco(contentRef, editorRef.current);

    const databaseAdapter = new FirebaseAdapter(
      contentRef,
      currentUser.uid,
      '#000000',
      currentUser.displayName ?? 'Unknown username'
    );
    const editorAdapter = new MonacoAdapter(editorRef.current, false);
    const firepad = new Firepad(databaseAdapter, editorAdapter, {
      userId: currentUser.uid,
      userName: currentUser.displayName ?? 'Unknown username',
      userColor: '#000000',
      defaultText: '', // important line
    });

    // if (currentUser?.displayName) {
    //   firepad.setUserName(currentUser.displayName);

    const firepadOnReady = (_ready: boolean) => {
      console.log(_ready);
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

            // Rewrite history

            // console.log('i am default writer');

            // This will be the last setText executed throughout the initialization of firepad and related libraries.
            // if (!defaultCodeWritten[editorLanguage]) {
            //   firepad.setText(codeToWrite);

            //   const newState = { ...defaultCodeWritten };
            //   newState[editorLanguage] = true;
            //   setDefaultCodeWritten(newState);
            // }

            if (firepad.isHistoryEmpty()) {
              console.log('writing default code');
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
    console.log('fuck');
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
