// types.ts

import Block, { PropsType } from './services/block';
import * as Component from './components';

/* HTTP-транспорт */
export type HTTPMethodType = (url: string, options?: any) => Promise<unknown>;
export type HTTPCurrentMethodType = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type RequestOptionsType = {
  method?: HTTPCurrentMethodType;
  data?: Document | XMLHttpRequestBodyInit | null | undefined;
  headers?: { [key: string]: string };
  isCredentials?: boolean;
};

/* Роутер */
export type RouteProps = {
  rootQuery: string;
};

/* Стор */
export type UserType = {
  id?: number;
  email: string;
  login: string;
  first_name: string;
  second_name: string;
  phone: string;
  password?: string;
  display_name?: string;
  avatar?: string;
};

export type UserLoginType = {
  login: string;
  password: string;
};

export type StoreType = {
  errorMessage: '';
  user: UserType | {};
  users: any[];
  chats: any[];
  messages?: any[];
  currentChatUsers?: any[];
};

/* Общие */
export type Indexed<T = unknown> = {
  [key: string]: T;
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

export type ChatPreviewChildren = {
  SideBar: Component.SideBar;
  chatPanelPlaceholder: Component.chatPanelPlaceholder;
  blockLinks: Component.BlockLinks;
};

export type SideBarChildren = {
  SideBarHeader: Component.SideBarHeader;
  SideBarChatList: Component.SideBarChatList;
  SideBarNewChat: Component.Button;
};

export type PasswordChangeType = {
  oldPassword: string;
  newPassword: string;
};

export type ChatType = {
  title: string;
};

export type Chat = {
  id: number;
  title: string;
  avatar?: string;
  last_message?: {
    content: string;
    time: string;
  } | null;
  unread_count?: number;
};

export type Message = {
  user_id: number;
  content: string;
  time: string;
};

export type AppState = {
  chats?: Chat[];
  messages?: {
    [key: number]: Message[];
  };
  user?: {
    id: number;
  };
};

export type TProps = Record<string, string | Function | unknown>;


export interface RemoveUserModalProps extends TProps {
  selectedChatId: number;
  currentChatUsers?: UserType[];
  isOpen?: boolean;
}

export interface AddUserModalProps extends TProps {
  selectedChatId: number;
  isOpen?: boolean;
}

export interface ChatCurrentChildren {
  AddUserModal: InstanceType<typeof Component.AddUserModal>;
  DeleteUserModal: InstanceType<typeof Component.DeleteUserModal>;
  SideBar: InstanceType<typeof Component.SideBar>;
  ActiveChat: InstanceType<typeof Component.ActiveChat>;
}
