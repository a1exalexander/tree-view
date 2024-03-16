import { apiService } from './api';
import enableMocking from './mock';
import { Tree } from './models';
import './styles.css';

enableMocking().then(async () => {
  const nodes = await apiService.getNodes();
  const tree = new Tree(nodes, 'root');
  tree.render();
});
