import { BrowserRouter } from 'react-router-dom';
import WalshRoute from '@/pages/routes';
import { basePath } from '@/constants';

function App() {
  return (
    <BrowserRouter basename={basePath}>
      <WalshRoute />
    </BrowserRouter>
  );
}

export default App;
