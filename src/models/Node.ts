import { type APITreeNode } from '../api';
import { findElementByDataId } from '../utils';

export interface ITreeNode extends APITreeNode {
  isHighlighted: boolean;
}

export class TreeNode implements ITreeNode {
  id: ITreeNode['id'];
  type: ITreeNode['type'];
  name: ITreeNode['name'];
  parentId: ITreeNode['parentId'];
  createdAt: ITreeNode['createdAt'];
  updatedAt: ITreeNode['updatedAt'];
  meta: ITreeNode['meta'] = null;
  isHighlighted: ITreeNode['isHighlighted'] = false;

  constructor(node: APITreeNode) {
    this.id = node.id;
    this.type = node.type;
    this.name = node.name;
    this.parentId = node.parentId;
    this.createdAt = node.createdAt;
    this.updatedAt = node.updatedAt;
  }

  protected markSearch = (search?: string) => {
    if (!search) return this.name;
    return this.name.replace(
      new RegExp(search, 'gi'),
      (match) => `<mark>${match}</mark>`,
    );
  };

  highlight = (ms = 3000) => {
    this.isHighlighted = true;
    findElementByDataId(this.id)?.classList.add(`${this.type}--highlighted`);

    setTimeout(() => {
      this.isHighlighted = false;
      findElementByDataId(this.id)?.classList.remove(
        `${this.type}--highlighted`,
      );
    }, ms);
  };

  renderSelect = (folders: Pick<ITreeNode, 'id' | 'name'>[]) => {
    return `
      <select data-action="move" class="${this.type}__move">
        <option value="" disabled selected>Move</option>
        ${folders
          .map(
            (folder) => `<option value="${folder.id}">${folder.name}</option>`,
          )
          .join('')}
      </select>
    `;
  };

  renderDelete = () => {
    return `<button data-action="delete" class="${this.type}__delete">Delete</button>`;
  };
}
