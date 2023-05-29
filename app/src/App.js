import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FilesPage from './pages/Files';
import UploadPage from './pages/Upload';
import CreateDrive from './pages/CreateDrive';
import DrivesPage from './pages/Drives';
import './App.css'


class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <nav>
            <ul>
              <li><Link to="/create-drive">Create Drive</Link></li>
              <li><Link to="/upload">Upload</Link></li>
              <li><Link to="/files">Files</Link></li>
              <li><Link to="/drives">Drives</Link></li>
            </ul>
          </nav>
          <Routes>
            <Route path="/create-drive" element={<CreateDrive />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/:drive/files" element={<FilesPage />} />
            <Route path="/drives" element={<DrivesPage />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
