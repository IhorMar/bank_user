import React, { useState, useEffect } from 'react';
import QueueIcon from '@mui/icons-material/Queue';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, API_RANDOM_USER_URL } from './apiConfig';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}users/`)
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        console.error(`Failed to delete user with ID: ${userId}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  const handleAddUser = async () => {
    try {
      // Fetch random user data from the external API
      const responseExternalApi = await fetch(API_RANDOM_USER_URL);
      const userData = await responseExternalApi.json();

      // Create a new user in Django
      const responseDjango = await fetch(`${API_BASE_URL}users/random-create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (responseDjango.ok) {
        // If the creation is successful, fetch the updated list of users
        const responseUsers = await fetch(`${API_BASE_URL}users/`);
        const updatedUsers = await responseUsers.json();

        // Update the React state with the new user list
        setUsers(updatedUsers);
      } else {
        console.error('Failed to add user to Django:', responseDjango.statusText);
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };


  return (
    <TableContainer component={Paper}>
      <div className='title-data'>
        <Button onClick={handleAddUser} variant="outlined" color="error" size="large" startIcon={<QueueIcon />}>
          Add User
        </Button>
        <Button onClick={() => navigate('/')} variant="outlined" color="error" size="large">
          Back to Main
        </Button>
        <h1>Users</h1>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontSize: '21px', fontWeight: 'bold' }}>№</TableCell>
              <TableCell style={{ fontSize: '21px', fontWeight: 'bold' }}>Username</TableCell>
              <TableCell style={{ fontSize: '21px', fontWeight: 'bold' }}>Banks</TableCell>
              <TableCell style={{ fontSize: '21px', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell style={{ fontWeight: 'bold' }}>{index + 1}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <List>
                    {user.banks.map(bank => (
                      <ListItem key={bank.id}>
                        <ListItemText
                          primary={`Bank Name: ${bank.bank_name}`}
                          secondary={`Routing Number: ${bank.routing_number}, Swift/BIC: ${bank.swift_bic}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(user.id)} variant="outlined" color="primary" className="custom-button">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(user.id)} variant="outlined" color="secondary" className="custom-button">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TableContainer>
  );
};

export default UserList;

