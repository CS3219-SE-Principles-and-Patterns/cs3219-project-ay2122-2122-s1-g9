import { fromMonaco } from '@hackerrank/firepad';
import MonacoEditor, { EditorProps, Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import React, { useEffect, useRef, useState } from 'react';

import firebaseApp from '../firebase/firebaseApp';

const testLanguages = [
  {
    value: 'cpp',
    text: 'C++',
    defaultCode:
      '/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     ListNode *next;\n *     ListNode() : val(0), next(nullptr) {}\n *     ListNode(int x) : val(x), next(nullptr) {}\n *     ListNode(int x, ListNode *next) : val(x), next(next) {}\n * };\n */\nclass Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        \n    }\n};',
  },
  {
    value: 'java',
    text: 'Java',
    defaultCode:
      '/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     int val;\n *     ListNode next;\n *     ListNode() {}\n *     ListNode(int val) { this.val = val; }\n *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n * }\n */\nclass Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        \n    }\n}',
  },
  {
    value: 'python',
    text: 'Python',
    defaultCode:
      '# Definition for singly-linked list.\n# class ListNode(object):\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution(object):\n    def addTwoNumbers(self, l1, l2):\n        """\n        :type l1: ListNode\n        :type l2: ListNode\n        :rtype: ListNode\n        """\n        ',
  },
  {
    value: 'python3',
    text: 'Python3',
    defaultCode:
      '# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\nclass Solution:\n    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n        ',
  },
  {
    value: 'c',
    text: 'C',
    defaultCode:
      '/**\n * Definition for singly-linked list.\n * struct ListNode {\n *     int val;\n *     struct ListNode *next;\n * };\n */\n\n\nstruct ListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2){\n\n}',
  },
  {
    value: 'csharp',
    text: 'C#',
    defaultCode:
      '/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     public int val;\n *     public ListNode next;\n *     public ListNode(int val=0, ListNode next=null) {\n *         this.val = val;\n *         this.next = next;\n *     }\n * }\n */\npublic class Solution {\n    public ListNode AddTwoNumbers(ListNode l1, ListNode l2) {\n        \n    }\n}',
  },
  {
    value: 'javascript',
    text: 'JavaScript',
    defaultCode:
      '/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nvar addTwoNumbers = function(l1, l2) {\n    \n};',
  },
  {
    value: 'ruby',
    text: 'Ruby',
    defaultCode:
      '# Definition for singly-linked list.\n# class ListNode\n#     attr_accessor :val, :next\n#     def initialize(val = 0, _next = nil)\n#         @val = val\n#         @next = _next\n#     end\n# end\n# @param {ListNode} l1\n# @param {ListNode} l2\n# @return {ListNode}\ndef add_two_numbers(l1, l2)\n    \nend',
  },
  {
    value: 'swift',
    text: 'Swift',
    defaultCode:
      '/**\n * Definition for singly-linked list.\n * public class ListNode {\n *     public var val: Int\n *     public var next: ListNode?\n *     public init() { self.val = 0; self.next = nil; }\n *     public init(_ val: Int) { self.val = val; self.next = nil; }\n *     public init(_ val: Int, _ next: ListNode?) { self.val = val; self.next = next; }\n * }\n */\nclass Solution {\n    func addTwoNumbers(_ l1: ListNode?, _ l2: ListNode?) -> ListNode? {\n        \n    }\n}',
  },
  {
    value: 'golang',
    text: 'Go',
    defaultCode:
      '/**\n * Definition for singly-linked list.\n * type ListNode struct {\n *     Val int\n *     Next *ListNode\n * }\n */\nfunc addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {\n    \n}',
  },
  {
    value: 'scala',
    text: 'Scala',
    defaultCode:
      '/**\n * Definition for singly-linked list.\n * class ListNode(_x: Int = 0, _next: ListNode = null) {\n *   var next: ListNode = _next\n *   var x: Int = _x\n * }\n */\nobject Solution {\n    def addTwoNumbers(l1: ListNode, l2: ListNode): ListNode = {\n        \n    }\n}',
  },
  {
    value: 'kotlin',
    text: 'Kotlin',
    defaultCode:
      '/**\n * Example:\n * var li = ListNode(5)\n * var v = li.`val`\n * Definition for singly-linked list.\n * class ListNode(var `val`: Int) {\n *     var next: ListNode? = null\n * }\n */\nclass Solution {\n    fun addTwoNumbers(l1: ListNode?, l2: ListNode?): ListNode? {\n        \n    }\n}',
  },
  {
    value: 'rust',
    text: 'Rust',
    defaultCode:
      '// Definition for singly-linked list.\n// #[derive(PartialEq, Eq, Clone, Debug)]\n// pub struct ListNode {\n//   pub val: i32,\n//   pub next: Option<Box<ListNode>>\n// }\n// \n// impl ListNode {\n//   #[inline]\n//   fn new(val: i32) -> Self {\n//     ListNode {\n//       next: None,\n//       val\n//     }\n//   }\n// }\nimpl Solution {\n    pub fn add_two_numbers(l1: Option<Box<ListNode>>, l2: Option<Box<ListNode>>) -> Option<Box<ListNode>> {\n        \n    }\n}',
  },
  {
    value: 'php',
    text: 'PHP',
    defaultCode:
      '/**\n * Definition for a singly-linked list.\n * class ListNode {\n *     public $val = 0;\n *     public $next = null;\n *     function __construct($val = 0, $next = null) {\n *         $this->val = $val;\n *         $this->next = $next;\n *     }\n * }\n */\nclass Solution {\n\n    /**\n     * @param ListNode $l1\n     * @param ListNode $l2\n     * @return ListNode\n     */\n    function addTwoNumbers($l1, $l2) {\n        \n    }\n}',
  },
  {
    value: 'typescript',
    text: 'TypeScript',
    defaultCode:
      '/**\n * Definition for singly-linked list.\n * class ListNode {\n *     val: number\n *     next: ListNode | null\n *     constructor(val?: number, next?: ListNode | null) {\n *         this.val = (val===undefined ? 0 : val)\n *         this.next = (next===undefined ? null : next)\n *     }\n * }\n */\n\nfunction addTwoNumbers(l1: ListNode | null, l2: ListNode | null): ListNode | null {\n\n};',
  },
  {
    value: 'racket',
    text: 'Racket',
    defaultCode:
      '; Definition for singly-linked list:\n#|\n\n; val : integer?\n; next : (or/c list-node? #f)\n(struct list-node\n  (val next) #:mutable #:transparent)\n\n; constructor\n(define (make-list-node [val 0])\n  (list-node val #f))\n\n|#\n\n(define/contract (add-two-numbers l1 l2)\n  (-> (or/c list-node? #f) (or/c list-node? #f) (or/c list-node? #f))\n\n  )',
  },
  {
    value: 'erlang',
    text: 'Erlang',
    defaultCode:
      "%% Definition for singly-linked list.\n%%\n%% -record(list_node, {val = 0 :: integer(),\n%%                     next = null :: 'null' | #list_node{}}).\n\n-spec add_two_numbers(L1 :: #list_node{} | null, L2 :: #list_node{} | null) -> #list_node{} | null.\nadd_two_numbers(L1, L2) ->\n  .",
  },
  {
    value: 'elixir',
    text: 'Elixir',
    defaultCode:
      '# Definition for singly-linked list.\n#\n# defmodule ListNode do\n#   @type t :: %__MODULE__{\n#           val: integer,\n#           next: ListNode.t() | nil\n#         }\n#   defstruct val: 0, next: nil\n# end\n\ndefmodule Solution do\n  @spec add_two_numbers(l1 :: ListNode.t | nil, l2 :: ListNode.t | nil) :: ListNode.t | nil\n  def add_two_numbers(l1, l2) do\n\n  end\nend',
  },
];

const Editor: React.FC = function () {
  const monacoRef = useRef<Monaco | null>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
  const [editorLanguage, setEditorLanguage] = useState<string>(
    testLanguages[0].value
  );

  const options: editor.IStandaloneEditorConstructionOptions = {
    cursorStyle: 'line',
  };

  useEffect(() => {
    if (!editorLoaded || editorRef.current == null) {
      return;
    }

    const dbRef = firebaseApp.database().ref('testEditor/content');
    const firepad = fromMonaco(dbRef, editorRef.current);
    // const name = prompt('enter your name:');
    // if (name) {
    //   firepad.setUserName(name);
    // }
    firepad.setUserName('arthur');
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

  return (
    <div>
      <select value={editorLanguage} onChange={handleLanguageChange}>
        {testLanguages.map((language) => (
          <option key={language.value} value={language.value}>
            {language.text}
          </option>
        ))}
      </select>
      <MonacoEditor
        width="60vw"
        height="100vh"
        options={options}
        path={editorLanguage}
        defaultLanguage={editorLanguage}
        defaultValue={
          testLanguages.find((language) => language.value === editorLanguage)
            ?.defaultCode
        }
        onMount={handleEditorMount}
      />
    </div>
  );
};

export default Editor;
