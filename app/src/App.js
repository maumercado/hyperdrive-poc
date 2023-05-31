import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/Upload';
import FilesPage from './pages/Files';
import InfoPage from './pages/Info';

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<UploadPage />} />
            <Route path="/files" element={<FilesPage />} />
            <Route path="/info" element={<InfoPage />} />
          </Routes>
        </div>
      </Router>
    );
  }
}

export default App;
