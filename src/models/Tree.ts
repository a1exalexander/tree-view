import { TreeNode } from '.';
import { APITreeNode, APITreeNodeType, apiService } from '../api';
import { findClosestTreeNodeId, matchSubstring, randomId } from '../utils';
import { TreeFile } from './File';
import { TreeFolder } from './Folder';

export interface ITree {
  container: HTMLElement | null;
  nodes: (TreeFile | TreeFolder)[];
  search?: string;
  createNode(
    node: Partial<APITreeNode> & { type: APITreeNodeType },
  ): TreeFile | TreeFolder;
  findNode(id?: string | null): TreeFile | TreeFolder | undefined;
  findNodeIndex(id?: string | null): number;
  render(): void;
}

export class Tree implements ITree {
  nodes: ITree['nodes'] = [];
  container: ITree['container'];
  search?: string;

  constructor(nodeList: APITreeNode[], containerId: string) {
    this.nodes = nodeList.map(nodeFactory);
    this.container = document.getElementById(containerId);
  }

  createNode = (node: Partial<APITreeNode> & { type: APITreeNodeType }) => {
    const id = randomId();
    const options: APITreeNode = {
      id,
      parentId: null,
      name: `New ${node?.type} ${id}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      meta: null,
      ...node,
    };
    const newFolder = nodeFactory(options);
    this.nodes.unshift(newFolder);
    return newFolder;
  };

  findNode = (id?: string | null) => {
    return this.nodes.find((node) => node.id === id);
  };

  findNodeIndex = (id?: string | null) => {
    return this.nodes.findIndex((node) => node.id === id);
  };

  private onDelete = async (event: Event) => {
    const el = event.target as HTMLElement;
    const id = findClosestTreeNodeId(el);

    if (id) {
      await apiService.deleteNode(id);
      const idx = this.findNodeIndex(id);
      if (idx !== -1) {
        this.nodes.splice(idx, 1);
      }
      this.render();
    }
  };

  private onMove = (event: Event) => {
    const $select = event.target as HTMLSelectElement;
    const newParentId = $select.value;
    const id = findClosestTreeNodeId($select);
    const node = this.findNode(id);
    if (!id || !node) {
      throw new Error('Node id not found');
    }

    node.parentId = newParentId;
    node.highlight();
    this.findNode(newParentId)?.highlight();
    this.render();
  };

  private onOpenToggle = (event: Event) => {
    const $el = event.target as HTMLElement;
    const folderId = findClosestTreeNodeId($el);

    const node = this.findNode(folderId);

    if (node instanceof TreeFolder) {
      node.isOpen = !node.isOpen;
      this.render();
    }
  };

  private onAddNode = (event: Event) => {
    const $el = event.target as HTMLElement;
    const type = $el
      .getAttribute('data-action')
      ?.replace('add-', '') as string as APITreeNodeType;

    const folderId = findClosestTreeNodeId($el);
    const node = this.findNode(folderId);
    const newNode = this.createNode({
      parentId: folderId,
      type,
    });
    if (node instanceof TreeFolder) {
      node.isOpen = true;
    }
    newNode.highlight();
    this.render();
  };

  private onSearch = (event: Event) => {
    const $input = event.target as HTMLInputElement;
    const value = $input.value.toLowerCase();

    const deepOpen = (node: TreeNode) => {
      if (node.parentId) {
        const parent = this.findNode(node.parentId);
        if (parent instanceof TreeFolder) {
          parent.isOpen = true;
          deepOpen(parent);
        }
      }
    };

    if (this.search && !value) {
      this.nodes.forEach((node) => {
        if (node instanceof TreeFolder) {
          node.isOpen = false;
        }
      });
    }

    this.search = value;

    if (value) {
      this.nodes.forEach((node) => {
        if (node instanceof TreeFolder) {
          node.isOpen = false;
        }
        if (matchSubstring(node.name, value)) {
          deepOpen(node);
        }
      });
    }

    this.render();
  };

  private onDragStart = (event: Event) => {
    const dragEvent = event as DragEvent;
    const nodeId = findClosestTreeNodeId(dragEvent.target as HTMLElement);
    if (!nodeId) {
      return;
    }
    dragEvent.dataTransfer?.setData('text/plain', nodeId);
  };

  private onDrop = (event: Event) => {
    const dragEvent = event as DragEvent;
    dragEvent.preventDefault();
    const childId = dragEvent.dataTransfer?.getData('text/plain');
    const childNode = this.findNode(childId);
    const parentId =
      findClosestTreeNodeId(dragEvent.target as HTMLElement) || null;
    const parentNode = this.findNode(parentId);
    if (!childNode) {
      return;
    }
    if (parentNode instanceof TreeFolder) {
      parentNode.isOpen = true;
    }
    childNode.parentId = parentId;
    childNode.highlight();

    this.render();
  };

  private onDragOver = (event: Event) => {
    event.preventDefault();
  };

  private onDragEnter = (event: Event) => {
    event.preventDefault();
  };

  private generateTreeElement(parents?: ITree['nodes']): string {
    if (!parents) {
      return this.generateTreeElement(this.nodes.filter((n) => !n.parentId));
    }

    return parents
      .map((node) => {
        const folders = this.nodes.filter(
          (el) => el.type === 'folder' && el.id !== node.id,
        );
        if (node instanceof TreeFile) {
          return node.render(folders, this.search);
        }
        const children = this.generateTreeElement(
          this.nodes.filter((n) => n.parentId === node.id),
        );
        return node.render(folders, children, this.search);
      })
      .join('');
  }

  removeEventListeners = () => {
    document.querySelectorAll('[data-action]').forEach((el) => {
      const action = el.getAttribute('data-action');

      switch (action) {
        case 'delete':
          el.removeEventListener('click', this.onDelete);
          break;
        case 'move':
          el.removeEventListener('change', this.onMove);
          break;
        case 'expand':
          el.removeEventListener('click', this.onOpenToggle);
          break;
        case 'add-folder':
          el.removeEventListener('click', this.onAddNode);
          break;
        case 'add-file':
          el.removeEventListener('click', this.onAddNode);
          break;
        case 'search':
          el.removeEventListener('input', this.onSearch);
          break;
        case 'folder':
          el.removeEventListener('dragstart', this.onDragStart);
          el.removeEventListener('drop', this.onDrop);
          el.removeEventListener('dragenter', this.onDragEnter);
          el.removeEventListener('dragover', this.onDragOver);
          break;
        case 'file':
          el.removeEventListener('dragstart', this.onDragStart);
          break;
      }
    });
  };

  addEventListeners = () => {
    document.querySelectorAll('[data-action]').forEach((el) => {
      const action = el.getAttribute('data-action');

      switch (action) {
        case 'delete':
          el.addEventListener('click', this.onDelete);
          break;
        case 'move':
          el.addEventListener('change', this.onMove);
          break;
        case 'expand':
          el.addEventListener('click', this.onOpenToggle);
          break;
        case 'add-folder':
          el.addEventListener('click', this.onAddNode);
          break;
        case 'add-file':
          el.addEventListener('click', this.onAddNode);
          break;
        case 'search':
          el.addEventListener('input', this.onSearch);
          break;
        case 'folder':
          el.addEventListener('dragstart', this.onDragStart);
          el.addEventListener('drop', this.onDrop);
          el.addEventListener('dragenter', this.onDragEnter);
          el.addEventListener('dragover', this.onDragOver);
          break;
        case 'file':
          el.addEventListener('dragstart', this.onDragStart);
          break;
      }
    });
  };

  private renderContainer = (id: string) => {
    return `
      <div class="tree__header">
        <input data-action="search" type="text" class="tree__search" placeholder="Search..." />
        <button data-action="add-folder" class="tree__add">Add folder</button>
        <button data-action="add-file" class="tree__add">Add file</button>
      </div>
      
      <div data-action="folder" class="tree__body">
        <p>You also can drag and drop files or folders</p>
        <div id="${id}">
          
          ${this.generateTreeElement()}
        </div>
      </div>
    `;
  };

  render() {
    if (!this.container) {
      throw new Error('Root container not found');
    }

    const TARGET_ID = 'tree';
    const target = document.getElementById(TARGET_ID);

    if (target) {
      this.removeEventListeners();
      target.innerHTML = this.generateTreeElement();
    } else {
      this.container.innerHTML = this.renderContainer(TARGET_ID);
    }
    this.addEventListeners();
  }
}

export const nodeFactory = (apiNode: APITreeNode) => {
  if (apiNode.type === 'file') {
    return new TreeFile(apiNode);
  }

  return new TreeFolder(apiNode);
};
