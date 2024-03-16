export type APITreeNodeType = 'folder' | 'file';

export interface APITreeNodeMeta {
  src: string;
  size: number;
}

export interface APITreeNode {
  id: string;
  type: APITreeNodeType;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  meta: APITreeNodeMeta | null;
}

export type APIUpdateEntitie<T extends { id: string }> = Pick<T, 'id'> &
  Partial<Omit<T, 'id'>>;

export type DOM<T extends string = string> = Record<T, HTMLElement>;
