import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FilesPage = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles(['file1', 'file2', 'file3'])
    // axios.get('http://localhost:3001/files').then(res => {
    //   setFiles(res.data);
    // });
  }, []);

  return (
    <div className="container">
      <div className="upload-section">
        <h1>Files</h1>
        <ul className="file-list">
          {files.map(file => <li className="file-list-item" key={file}>{file}</li>)}
        </ul>
      </div>
    </div>
  );

}

export default FilesPage;
