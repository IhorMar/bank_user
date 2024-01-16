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

  useEffect(() => {
    fetch(`${API_BASE_URL}banks/`)
      .then(response => response.json())
      .then(data => setBanks(data))
      .catch(error => console.error('Error fetching user data:', error));

    fetch(`${API_BASE_URL}users/`)
      .then(response => response.json())
      .then(data => setAllUsers(data))
      .catch(error => console.error('Error fetching all users:', error));
  }, []);


  const handleEdit = (bankId) => {
    navigate(`/edit-bank/${bankId}`);
  };


  const handleDelete = async (bankId, bank_name) => {
    try {
      const bankToDelete = banks.find((bank) => bank.id === bankId);

      if (bankToDelete.users.length > 0) {
        alert(`Bank ${bank_name} has associated users. Cannot delete.`);
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
      // Fetch random user data from the external API
      const responseExternalApi = await fetch(API_RANDOM_BANK_URL);
      const bankData = await responseExternalApi.json();

      // Create a new user in Django
      const responseDjango = await fetch(`${API_BASE_URL}banks/random-create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bankData),
      });

      if (responseDjango.ok) {
        // If the creation is successful, fetch the updated list of users
        const responseBanks = await fetch(`${API_BASE_URL}banks/`);
        const updatedBanks = await responseBanks.json();

        // Update the React state with the new user list
        setBanks(updatedBanks);
      } else {
        console.error('Failed to add bank to Django:', responseDjango.statusText);
      }
    } catch (error) {
      console.error('Error adding bank:', error);
    }
  };


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
              <TableCell style={{ fontSize: '21px', fontWeight: 'bold' }}>№</TableCell>
              <TableCell style={{ fontSize: '21px', fontWeight: 'bold' }}>Name of Bank</TableCell>
              <TableCell style={{ fontSize: '21px', fontWeight: 'bold' }}>Users</TableCell>
              <TableCell style={{ fontSize: '21px', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banks.map((bank, index) => (
              <TableRow key={bank.id}>
                <TableCell style={{ fontWeight: 'bold' }}>{index + 1}</TableCell>
                <TableCell>{bank.bank_name}</TableCell>
                <TableCell>
                  <List>
                    {bank.users.map((userId, user_index) => (
                      <ListItem key={userId}>
                        {allUsers.find(u => u.id === userId) && (
                          <ListItemText
                            primary={`${user_index + 1}. ${allUsers.find(u => u.id === userId).first_name}  ${allUsers.find(u => u.id === userId).last_name}`}
                          />
                        )}
                      </ListItem>
                    ))}
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
