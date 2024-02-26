
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

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}users/`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      const responseExternalApi = await fetch(API_RANDOM_USER_URL);
      const userData = await responseExternalApi.json();

      const responseDjango = await fetch(`${API_BASE_URL}users/random-create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (responseDjango.ok) {
        fetchUsers();
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
              <TableCell className="table-header">№</TableCell>
              <TableCell className="table-header">Username</TableCell>
              <TableCell className="table-header">Banks</TableCell>
              <TableCell className="table-header">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
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
