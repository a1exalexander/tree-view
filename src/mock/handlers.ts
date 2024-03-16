import { HttpResponse, http } from 'msw';
import { MockData } from './data';

const mockedData = new MockData();

export const handlers = [
  http.get('/api/nodes', ({ cookies }) => {
    const data = mockedData.getData(cookies.userId);
    console.log('cookies.userId', cookies.userId);
    return HttpResponse.json(data);
  }),
  http.delete('/api/nodes/:id', () => {
    return new HttpResponse(null, {
      status: 204,
      statusText: 'No Content',
    });
  }),
  http.patch('/api/nodes/:id', ({ request }) => {
    return HttpResponse.json(request.body);
  }),
];
