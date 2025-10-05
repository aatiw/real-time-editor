import { Toaster } from 'react-hot-toast';
import Landing from './pages/Landing'
import CodeEditor from './pages/CodeEditor';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <div>
      <Toaster />
      <Router>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/canvas' element={<CodeEditor />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;