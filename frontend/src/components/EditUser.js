import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from './apiConfig';

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [availableBanks, setAvailableBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const responseUser = await fetch(`${API_BASE_URL}users/${userId}`);
        const userData = await responseUser.json();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchAvailableBanks = async () => {
      try {
        const responseBanks = await fetch(`${API_BASE_URL}banks`);
        const availableBanksData = await responseBanks.json();
        setAvailableBanks(availableBanksData);
      } catch (error) {
        console.error('Error fetching available banks:', error);
      }
    };

    fetchUserData();
    fetchAvailableBanks();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleBankChange = (bankIndex, field, value) => {
    const updatedBanks = [...user.banks];
    updatedBanks[bankIndex] = { ...updatedBanks[bankIndex], [field]: value };
    setUser({ ...user, banks: updatedBanks });
  };

  const handleDeleteBank = async (bankIndex) => {
    try {
      const bankToDelete = user.banks[bankIndex];
      const response = await fetch(`${API_BASE_URL}users/${user.id}/delete-user-bank/${bankToDelete.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bankId: bankToDelete.id }),
      });

      if (response.ok) {
        const updatedBanks = [...user.banks];
        updatedBanks.splice(bankIndex, 1);
        setUser({ ...user, banks: updatedBanks });
      } else {
        console.error(`Failed to delete bank from user: ${bankToDelete.id}`);
      }
    } catch (error) {
      console.error('Error deleting bank:', error);
    }
  };

  const isBankInUserList = (bankName) => {
    return user.banks.some((bank) => bank.bank_name === bankName);
  };

  const handleAddBank = async () => {
    if (selectedBank && !isBankInUserList(selectedBank)) {
      const bankToAdd = availableBanks.find((bank) => bank.bank_name === selectedBank);

      if (bankToAdd) {
        try {
          const response = await fetch(`${API_BASE_URL}users/${userId}/add-existing-bank/${bankToAdd.id}/`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bankId: bankToAdd.id }),
          });

          if (response.ok) {
            setUser({ ...user, banks: [...user.banks, bankToAdd] });

            await fetch(`${API_BASE_URL}banks/${bankToAdd.id}/add-existing-user/${userId}/`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userId }),
            });
          } else {
            console.error(`Failed to add bank to user: ${bankToAdd.id}`);
          }
        } catch (error) {
          console.error('Error adding bank:', error);
        }
      } else {
        console.error('Bank to add not found in availableBanks.');
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}users/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        navigate('/users');
      } else {
        console.error(`Failed to update user with ID: ${userId}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user || !availableBanks.length) {
    return <div>Loading...</div>;
  }

  return (
    <Paper style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <Typography variant="h5" component="div" gutterBottom>
        Edit User
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              variant="outlined"
              name="first_name"
              value={user.first_name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              variant="outlined"
              name="last_name"
              value={user.last_name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Username"
              variant="outlined"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
        <Typography variant="h6" component="div" gutterBottom>
          Banks
        </Typography>
        <List>
          {Array.isArray(user.banks) &&
            user.banks.map((bank, index) => (
              <ListItem key={index}>
                <TextField
                  label="Bank Name"
                  variant="outlined"
                  value={bank.bank_name}
                  onChange={(e) => handleBankChange(index, 'bank_name', e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <IconButton onClick={() => handleDeleteBank(index)} color="secondary">
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
        </List>
        <Typography variant="h6" component="div" gutterBottom>
          Available Banks
        </Typography>
        <List>
          {availableBanks.map((bank, index) => (
            <ListItem key={index}>
              <ListItemText primary={bank.bank_name} />
            </ListItem>
          ))}
        </List>
        <TextField
          label="Select Bank to Add"
          variant="outlined"
          select
          fullWidth
          margin="normal"
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
        >
          {availableBanks.map((bank, index) => (
            <MenuItem key={index} value={bank.bank_name}>
              {bank.bank_name}
            </MenuItem>
          ))}
        </TextField>
        <Button type="button" onClick={handleAddBank} variant="outlined" color="primary" style={{ marginTop: '10px' }} >
          Add Bank
        </Button>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }} >
          Save Changes
        </Button>
      </form>
    </Paper>
  );
};

export default EditUser;
