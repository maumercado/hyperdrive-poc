import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const { drive } = useParams();

  useEffect(() => {
    axios.get(`http://${window.location.hostname}:3001/${drive}/files`).then(res => {
      setFiles(res.data);
    });
  }, [drive]);

  return (
    <div className="container">
      <div className="upload-section">
        <h1>Files</h1>
        <ul className="file-list">
          Test
          {/* {files.map(file => <li className="file-list-item" key={file}>{file}</li>)} */}
        </ul>
      </div>
      <Link to={`/${drive}/uploads`}>Upload a file by clicking me!</Link>
    </div>
  );
}

export default FilesPage;
