// DBI = Database Interface

export type DBINodeType = 'folder' | 'file';

export interface DBIMeta {
  src: string;
  size: number;
}

export interface DBINode {
  id: string;
  type: DBINodeType;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  accessUserIds: string[];
  meta: DBIMeta | null;
}

export type DBINodeSanitized = Omit<DBINode, 'accessUserIds'>;
