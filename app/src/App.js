import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FilesPage from './pages/Files';
import UploadPage from './pages/Upload';
import './App.css'

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/files">Files</Link></li>
            </ul>
          </nav>
          <Routes>
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/files" element={<FilesPage />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
