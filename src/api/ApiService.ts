import { APITreeNode, APIUpdateEntitie } from './types';

interface IApiService {
  baseUrl: string;
  userId?: string;
  setUserId(userId: string): void;
  getNodes(): Promise<APITreeNode[]>;
}

export class ApiService implements IApiService {
  baseUrl: string;
  userId?: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private requestFactory(method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'GET') {
    return async <RequestData>(
      url: string,
      data?: RequestData,
    ): Promise<Response> => {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          userId: this.userId || '',
        },
      };
      if (method !== 'GET' && data) {
        options.body = JSON.stringify(data);
      }

      return fetch(`${this.baseUrl}${url}`, options);
    };
  }

  private get = this.requestFactory('GET');
  private post = this.requestFactory('POST');
  private delete = this.requestFactory('DELETE');
  private patch = this.requestFactory('PATCH');

  setUserId(userId: string) {
    this.userId = userId;
  }

  getNodes = async (): Promise<APITreeNode[]> => {
    const response = await this.get('/nodes');
    return response.json();
  };

  updateNode = async (
    node: APIUpdateEntitie<APITreeNode>,
  ): Promise<APITreeNode> => {
    const response = await this.patch(`/nodes/${node.id}`, node);
    return response.json();
  };

  deleteNode = (id: string) => {
    return this.delete(`/nodes/${id}`);
  };

  createNode = async (node: APITreeNode): Promise<APITreeNode> => {
    const res = await this.post<APITreeNode>('/nodes', node);
    return res.json();
  };
}

export const apiService = new ApiService('http://localhost:5173/api');
