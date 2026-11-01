export interface VFSItem {
  id: string;
  name: string;
  path: string; // e.g. "C:\\My Documents"
  type: 'file' | 'folder';
  size: number;
  modifiedDate: string;
  content?: string;
  url?: string;
  mimeType?: string;
  isSystem?: boolean;
  readOnly?: boolean;
  icon?: string;
}

export interface FileSystemState {
  items: Record<string, VFSItem>; // keyed by full path
}
