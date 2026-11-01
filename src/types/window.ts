export type AppId =
  | 'my-computer'
  | 'file-explorer'
  | 'notepad'
  | 'paint'
  | 'calculator'
  | 'control-panel'
  | 'internet-explorer'
  | 'minesweeper'
  | 'solitaire'
  | 'snake'
  | 'image-viewer'
  | 'document-viewer'
  | 'shutdown'
  | 'run'
  | 'help'
  | 'find'
  | 'retro-chat'
  | 'retro-spreadsheet'
  | 'operation-salt'
  | 'unseen-footage';

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  icon?: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  initialParams?: any;
}
