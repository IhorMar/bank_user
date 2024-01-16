import DeleteIcon from '@mui/icons-material/Delete';

import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem, List

} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { API_BASE_URL } from './apiConfig';

const EditBank = () => {
  const [bankData, setBankData] = useState({
    bank_name: '',
    routing_number: '',
    swift_bic: '',
    users: [],
  });
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  const { bankId } = useParams();

  useEffect(() => {
    // Fetch bank data by ID
    fetch(`${API_BASE_URL}banks/${bankId}`)
      .then(response => response.json())
      .then(data => setBankData(data))
      .catch(error => console.error('Error fetching bank data:', error));

    // Fetch all users
    fetch(`${API_BASE_URL}users/`)
      .then(response => response.json())
      .then(data => setAllUsers(data))
      .catch(error => console.error('Error fetching all users:', error));
  }, [bankId]);

  const handleInputChange = (field, value) => {
    setBankData(prevData => ({ ...prevData, [field]: value }));
  };

  const handleRemoveUserFromBank = async (userIndex) => {
    try {
      // Perform the logic to remove the user from the bank
      const userToDelete = bankData.users[userIndex];

      // Make an API call to remove the user from the bank
      const response = await fetch(`${API_BASE_URL}banks/${bankData.id}/delete-user-in-bank/${userToDelete}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ users: [userToDelete] }),
      });

      if (response.ok) {

        setBankData((prevData) => {
          const updatedUsers = [...prevData.users];
          updatedUsers.splice(userIndex, 1);
          return { ...prevData, users: updatedUsers };
        });

      } else {
        console.error('Failed to remove user from the bank:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing user from the bank:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}banks/${bankId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bankData),
      });

      if (response.ok) {
        await fetch(`${API_BASE_URL}banks/${bankId}/update-users/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ users: bankData.users }),
        });
        navigate('/banks');
      } else {
        console.error(`Failed to update bank with ID: ${bankId}`);
      }
    } catch (error) {
      console.error('Error updating bank:', error);
    }
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: '100vh' }}
    >
      <Grid item xs={6}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <form onSubmit={handleFormSubmit}>

            <Typography variant="h4" gutterBottom>
              Edit Bank
            </Typography>
            <TextField
              label="Bank Name"
              value={bankData.bank_name}
              onChange={e => handleInputChange('bank_name', e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Routing Number"
              value={bankData.routing_number}
              onChange={e => handleInputChange('routing_number', e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="SWIFT/BIC"
              value={bankData.swift_bic}
              onChange={e => handleInputChange('swift_bic', e.target.value)}
              fullWidth
              margin="normal"
            />

            <Typography variant="h6" component="div" gutterBottom>
              Users in the Bank
            </Typography>

            {Array.isArray(bankData.users) ? bankData.users.map((userId, index) => (
              <ListItem key={index}>
                <TextField
                  label="User"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={`${allUsers.find(u => u.id === userId).first_name} ${allUsers.find(u => u.id === userId).last_name}`}
                  InputProps={{
                    readOnly: true,
                  }}
                />

                <IconButton onClick={() => handleRemoveUserFromBank(index)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            )) : null}

            <Typography variant="h6" component="div" gutterBottom>
              Available Users
            </Typography>
            <List>
              {allUsers.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                  />
                </ListItem>
              ))}
            </List>


            <TextField
              label="Select User(s)"
              variant="outlined"
              select
              fullWidth
              margin="normal"
              value={bankData.users}
              onChange={(e) => {
                const selectedUserId = e.target.value;

                if (bankData.users.includes(selectedUserId)) {
                  // User is already part of the bank
                  alert("User is already part of the bank!");
                } else {
                  // Update the bankData with the selected user ID
                  setBankData((prevData) => ({ ...prevData, users: [...prevData.users, selectedUserId] }));
                }
              }}
            >
              {allUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {`${user.first_name} ${user.last_name}`}
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '10px' }}
            >
              Save Changes
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default EditBank;
