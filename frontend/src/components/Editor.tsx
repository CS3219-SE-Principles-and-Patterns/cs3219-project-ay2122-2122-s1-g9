import { fromMonaco } from '@hackerrank/firepad';
import MonacoEditor, { EditorProps } from '@monaco-editor/react';
// import { get, getDatabase, ref } from 'firebase/database';
import { editor } from 'monaco-editor';
import React, { useEffect, useRef, useState } from 'react';

import app from '../firebase/firebaseApp';
import { setPosition, setValue } from '../redux/editorSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

const Editor: React.FC = function () {
  const dispatch = useAppDispatch();
  const editorValue = useAppSelector((state) => state.editor.value);

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);

  const options: editor.IStandaloneEditorConstructionOptions = {
    cursorStyle: 'line',
  };

  const handleEditorMount: EditorProps['onMount'] = (editor, monaco) => {
    editorRef.current = editor;
    setEditorLoaded(true);
  };

  useEffect(() => {
    if (!editorLoaded || editorRef.current == null) {
      return;
    }

    // const dbRef = ref(getDatabase(app), '/editor');

    // get(ref(dbRef, '/editor')).then((snapshot) => {
    //   if (snapshot.exists()) {
    //     console.log(snapshot.val());
    //   } else {
    //     console.log('no data');
    //   }
    // });
    // .ref().child(`pair001`);

    // const firepad = fromMonaco(dbRef, editorRef.current);
    // const name = 'me';
    // firepad.setUserName(name);
  }, [editorLoaded]);

  const handleEditorChange: EditorProps['onChange'] = (value, event) => {
    if (value == null) {
      return;
    }
    dispatch(setValue(value));
    dispatch(setPosition(editorRef.current?.getPosition()));
  };

  return (
    <div>
      <MonacoEditor
        height="90vh"
        options={options}
        defaultLanguage="javascript"
        defaultValue={editorValue}
        onMount={handleEditorMount}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default Editor;
