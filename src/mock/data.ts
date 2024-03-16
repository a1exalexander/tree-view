import type { DBINodeSanitized, DBINode } from './types';
import { randomId } from '../utils';

export class MockData {
  private data: DBINode[];
  private randomId = randomId;

  constructor() {
    this.data = this.generateFakeData();
  }

  private generateFakeData(): DBINode[] {
    const folders = [...new Array(10)].map(() => {
      return this.createNode();
    });
    const foldersWithFiles = folders
      .map((folder) => {
        const files = [...new Array(5)].map((_) => {
          const id = this.randomId();
          return this.createNode({
            type: 'file',
            parentId: folder.id,
            name: `fime-${id}.txt`,
            id,
          });
        });

        return [folder, ...files];
      })
      .flat();
    return foldersWithFiles;
  }

  createNode = (payload?: Partial<DBINode>): DBINode => {
    const id = this.randomId();
    return {
      id,
      type: 'folder',
      name: `Folder ${id}`,
      parentId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      accessUserIds: [],
      meta: null,
      ...payload,
    };
  };

  private sanitizeData(data: DBINode[], userId?: string): DBINodeSanitized[] {
    return data
      .filter(({ accessUserIds }) => {
        return !userId || accessUserIds.includes(userId);
      })
      .map(({ accessUserIds, ...rest }) => rest);
  }

  getData = (userId?: string) => {
    return this.sanitizeData(this.data, userId);
  };
}
