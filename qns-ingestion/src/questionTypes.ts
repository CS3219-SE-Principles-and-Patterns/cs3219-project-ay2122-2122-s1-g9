export interface QuestionTemplate {
  value: string;
  text: string;
  defaultCode: string;
}

export interface Param {
  name: string;
  type: string;
}

export interface Return {
  type: string;
  size: string;
}

export interface TemplateMeta {
  name: string;
  params: Param[];
  return: Return;
  manual: boolean;
}

export interface Question {
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

export interface QuestionIdentifier {
  id: number;
  slug: string;
}

export interface QuestionDict {
  [slug: string]: Question;
}

export interface QnsDictForRandom {
  [category: string]: {
    [level: string]: QuestionIdentifier[];
  };
}
