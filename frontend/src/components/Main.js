import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './styles.css';

const CenteredButtons = () => {
  return (
    <div className="centered-container">
      <h1>Banks Main Page</h1>
      <Link to="/users">
        <Button variant="contained" style={{ margin: '10px' }}>
          Users
        </Button>
      </Link>
      <Link to="/banks">
        <Button variant="contained" style={{ margin: '10px' }}>
          Banks
        </Button>
      </Link>
    </div>
  );
};

export default CenteredButtons;
