declare namespace Types {
  interface User {
    id: string;
  }

  interface ChatMessage {
    content: string;
    timeStamp: string;
    uid: string | undefined;
    displayName: string | undefined;
  }

  interface QuestionTemplate {
    value: string;
    text: string;
    defaultCode: string;
  }

  interface Param {
    name: string;
    type: string;
  }

  interface Return {
    type: string;
    size: string;
  }

  interface TemplateMeta {
    name: string;
    params: Param[];
    return: Return;
    manual: boolean;
  }

  interface Question {
    id: number;
    fid: number;
    name: string;
    slug: string;
    link: string;
    percent: number;
    level: string;
    category: string;
    totalAC: string;
    totalSubmit: string;
    likes: string;
    dislikes: string;
    desc: string;
    templates: QuestionTemplate[];
    testcase: string;
    testable: string;
    templateMeta: TemplateMeta;
    isPaidOnly: false;
    hints: string[];
  }

  interface QuestionIdentifier {
    id: number;
    slug: string;
  }

  interface QuestionDict {
    [slug: string]: Question;
  }

  interface QnsDictForRandom {
    [category: string]: {
      [level: string]: QuestionIdentifier[];
    };
  }

  type Difficulty = 'easy' | 'medium' | 'hard';

  interface MessageQueueNotif {
    type: string;
    sessId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  }
}
