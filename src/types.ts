import Block, { PropsType } from './services/block';

/* service HTTPTransport */
export type HTTPMethodType = (url: string, options?: any) => Promise<unknown>;
export type HTTPCurrentMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type RequestOptionsType = {
  method?: HTTPCurrentMethodType;
  data?: Document | XMLHttpRequestBodyInit | null | undefined;
  headers?: { [key: string]: string };
  isCredentials?: boolean;
};

/* router */
export type RouteProps = {
  rootQuery: string;
};

/* store */
export type UserType = {
  id?: number
  email: string
  login: string
  first_name: string
  second_name: string
  phone: string
  password?: string
  display_name?: string
}


export type UserLoginType = {
  login: string;
  password: string;
};
export type StoreType = {
  errorMessage: '';
  user: UserType | {};
  chats:[],
  messages?: []
};

/* general */
export type Indexed<T = unknown> = {
  [key in string]: T;
};

export type EventType = {
  [key: string]: (event: Event) => void;
};

export type PropsValueType = Node | string | number | [] | Function | unknown;

export type ObjectType = {
  [key: string]: string;
};

export type PropsListType = {
  [key: string]: Node[];
};
export type AttrEventsType = {
  events?: EventType;
  attr?: Record<string, string | boolean | number>;
};
export type TBlockProps = AttrEventsType & {
  className?: string;
  withInternalId?: boolean;
  currentPage?: string;
  [key: string]: Block<PropsType> | Block<PropsType>[] | string | unknown;
};

export type TObjectKeys = {
  <T, K extends keyof T>(obj: T, key: K): T[K];
};

export type PropsAttrType = Record<string, string | boolean | number | Function | unknown>;

/* components */
export type ButtonType = AttrEventsType & {
  text?: string;
  type?: string;
  className?: string;
  withInternalId?: boolean;
};

export type InputType = AttrEventsType & {
  text?: string;
  type: string;
  name: string;
  value?: string;
  className?: string;
  placeholderText?: string;
};

export type LinkType = AttrEventsType & {
  className?: string;
  text?: string;
};

export type ChatBlockType = AttrEventsType & {
  userName: string;
  userMessage: string;
  date: string;
  countMessage?: string;
};
export type TextareaType = AttrEventsType & {
  name: string;
  id?: string;
  className?: string;
  placeholderText?: string;
};

export type ChatFormType = AttrEventsType & {
  textarea: ObjectType;
  sentButton: ObjectType;
};

export type ChatLeftSideBarType = {
  linkProfile: ObjectType;
  searchInput: ObjectType;
  chatsBlock: ObjectType[];
};

export type PasswordChangeType = {
  oldPassword: string;
  newPassword: string;
};

export type ChatType = {
  title:string;
};

export type TProps = Record<string, string | Function | unknown>;
