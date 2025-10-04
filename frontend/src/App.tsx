import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing'
import CodeEditor from './pages/CodeEditor';
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {

  return (
    <div>
      <Toaster />
      <Router>
        <Route path='/' element={<Landing />} />
        <Route path='/canvas' element={<CodeEditor />} />
      </Router>
    </div>
  )
}

export default App;