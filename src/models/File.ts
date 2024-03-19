import { APITreeNode } from '../api';
import { clsx } from '../utils';
import { ITreeNode, TreeNode } from './Node';

export interface ITreeFile extends ITreeNode {
  render(folders: Pick<ITreeNode, 'id' | 'name'>[]): string;
}

export class TreeFile extends TreeNode implements ITreeFile {
  constructor(node: APITreeNode) {
    super(node);
    this.type = 'file';
  }

  render(folders: Pick<ITreeNode, 'id' | 'name'>[], search?: string) {
    return `
<div draggable="true" data-action="file" class="file ${clsx({
      'file--highlighted': this.isHighlighted,
    })}" data-id="${this.id}">
  <span class="file__name">${this.markSearch(search)}</span>
  <div class="file__actions">
    ${this.renderDelete()}
    ${this.renderSelect(folders)}
  </div>
</div>
    `;
  }
}
