
import React, { useState, useEffect } from 'react';
import './styles.css';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem, ListItemText } from '@mui/material';
import { API_BASE_URL, API_RANDOM_BANK_URL } from './apiConfig';
import QueueIcon from '@mui/icons-material/Queue';
import { useNavigate } from 'react-router-dom';

const BankList = () => {
  const [banks, setBanks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  const fetchBanks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}banks/`);
      const data = await response.json();
      setBanks(data);
    } catch (error) {
      console.error('Error fetching bank data:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}users/`);
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchBanks();
    fetchAllUsers();
  }, []);

  const handleEdit = (bankId) => {
    navigate(`/edit-bank/${bankId}`);
  };

  const handleDelete = async (bankId, bankName) => {
    try {
      const bankToDelete = banks.find((bank) => bank.id === bankId);
      if (bankToDelete.users.length > 0) {
        alert(`Bank ${bankName} has associated users. Cannot delete.`);
        return;
      }
      const response = await fetch(`${API_BASE_URL}banks/${bankId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setBanks((prevBanks) => prevBanks.filter((bank) => bank.id !== bankId));
      } else {
        console.error(`Failed to delete bank with ID: ${bankId}`);
      }
    } catch (error) {
      console.error('Error deleting bank:', error);
    }
  };

  const handleAddBank = async () => {
    try {
      const responseExternalApi = await fetch(API_RANDOM_BANK_URL);
      const bankData = await responseExternalApi.json();
      const responseDjango = await fetch(`${API_BASE_URL}banks/random-create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bankData),
      });
      if (responseDjango.ok) {
        fetchBanks();
      } else {
        console.error('Failed to add bank to Django:', responseDjango.statusText);
      }
    } catch (error) {
      console.error('Error adding bank:', error);
    }
  };

  const getUserById = (userId) => allUsers.find(u => u.id === userId);

  return (
    <TableContainer component={Paper}>
      <div className='title-data'>
        <Button onClick={handleAddBank} variant="outlined" color="error" size="large" startIcon={<QueueIcon />}>
          Add Bank
        </Button>
        <Button onClick={() => navigate('/')} variant="outlined" color="error" size="large">
          Back to Main
        </Button>
        <h1>Banks</h1>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header">№</TableCell>
              <TableCell className="table-header">Name of Bank</TableCell>
              <TableCell className="table-header">Users</TableCell>
              <TableCell className="table-header">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banks.map((bank, index) => (
              <TableRow key={bank.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{bank.bank_name}</TableCell>
                <TableCell>
                  <List>
                    {bank.users.map((userId, user_index) => {
                      const user = getUserById(userId);
                      return (
                        <ListItem key={userId}>
                          {user && (
                            <ListItemText
                              primary={`${user_index + 1}. ${user.first_name} ${user.last_name}`}
                            />
                          )}
                        </ListItem>
                      );
                    })}
                  </List>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(bank.id)} variant="outlined" color="primary" className="custom-button">
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(bank.id, bank.bank_name)} variant="outlined" color="secondary" className="custom-button">
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

export default BankList;
