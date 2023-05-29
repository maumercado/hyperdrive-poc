import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

const DrivesPage = () => {
  const [drives, setDrives] = useState([]);

  console.log(window.location.hostname, 'window.location.hostname')

  useEffect(() => {
    async function fetchDrives () {
      const { data: drives } = await axios.get(`http://${window.location.hostname}:3001/drives`)
      setDrives(drives)
    }
    fetchDrives()
  }, [drives.length]);

  return (
    <div className="container">
      <div className="upload-section">
        <h1>Existing Drives</h1>
        {drives.length === 0 ? (
          <p>No drives found.</p>
        ) : (
            <ul className="file-list">
              {drives.map((drive) => (
                <li className="file-list-item" key={drive.username}>
                  <Link to={`/${drive.username}/files`}>{drive.username}</Link>
                  <ul>
                    {Object.keys(drive).map((key) => (
                      (key !== 'username' && key !== 'path') && (
                        <li key={key}>
                          {key}: {drive[key]}
                        </li>
                      )
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
        )}
      </div>
    </div>
  );
}

export default DrivesPage;
