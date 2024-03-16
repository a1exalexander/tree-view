import { ITreeNode, TreeNode } from './Node';
import { type APITreeNode } from '../api';
import { clsx } from '../utils';

export interface ITreeFolder extends ITreeNode {
  isOpen?: boolean;
  render(folders: Pick<ITreeNode, 'id' | 'name'>[], children: string): string;
}

export class TreeFolder extends TreeNode implements ITreeFolder {
  isOpen: boolean = false;

  constructor(node: APITreeNode) {
    super(node);
    this.type = 'folder';
  }

  render = (folders: Pick<ITreeNode, 'id' | 'name'>[], children?: string, search?: string) => {
    return `
<div class="folder ${clsx({
      'folder--opened': this.isOpen,
      'folder--highlighted': this.isHighlighted,
    })}" data-id="${this.id}">
  <div class="folder__header">
    <button ${children ? "" : 'disabled'} data-action="expand" class="folder__button">
      ${children ? '<span class="folder__triangle"></span>': ''}
      <span class="folder__name">${this.markSearch(search)}</span>
    </button>
    <div class="folder__actions">
      ${this.renderDelete()}
      ${this.renderSelect(folders)}
      <button data-action="add-folder" class="folder__add">Add folder</button>
      <button data-action="add-file" class="folder__add">Add file</button>
    </div>
  </div>
  ${
    this.isOpen
      ? `<ul class="folder__children">
    ${children}
  </ul>`
      : ''
  }
</div>
    `;
  };
}
