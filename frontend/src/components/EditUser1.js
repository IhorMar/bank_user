// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Button, TextField, Paper } from '@mui/material';
// const users_api = 'http://127.0.0.1:8000/api/users/'

// const EditUser = () => {
//   const { user_id } = useParams();
//   // console.log('User ID from useParams:', user_id);
//   const navigate = useNavigate();
//   const [user, setUser] = useState({
//     id: '',
//     username: '',
//   });

//   useEffect(() => {
//     fetch(`${users_api}${user_id}`)
//       .then(response => response.json())
//       .then(data => setUser(data))
//       .catch(error => console.error('Error fetching user data:', error));
//   }, [user_id]);

//   const handleInputChange = (e) => {
//     setUser({
//       ...user,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleEditUser = () => {
//     const user_id = user.id;
//     console.log(user.id)

//     if (user_id) {

//       fetch(`${users_api}${user_id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(user),
//       })
//         .then(response => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.json();
//         })
//         .then(data => {
//           console.log('User updated successfully:', data);
//         })
//         .catch(error => {
//           console.error('Error updating user:', error);
//         });
//     } else {
//       console.error('User ID is undefined');
//     }
//   };

//   return (
//     <Paper style={{ padding: '20px', maxWidth: '400px', margin: '20px auto' }}>
//       <h2>Edit User</h2>
//       <TextField
//         label="Username"
//         variant="outlined"
//         name="username"
//         value={user.username}
//         onChange={handleInputChange}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="First Name"
//         variant="outlined"
//         name="first_name"
//         value={user.first_name}
//         onChange={handleInputChange}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Last Name"
//         variant="outlined"
//         name="last_name"
//         value={user.last_name}
//         onChange={handleInputChange}
//         fullWidth
//         margin="normal"
//       />
//       <TextField
//         label="Email"
//         variant="outlined"
//         name="email"
//         value={user.email}
//         onChange={handleInputChange}
//         fullWidth
//         margin="normal"
//       />
//       <Button onClick={handleEditUser} variant="contained" color="primary">
//         Save Changes
//       </Button>
//     </Paper>
//   );
// };

// export default EditUser;



// Example EditUser component
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';




// import { TextField, Button, Grid } from '@mui/material';
import { Paper, TextField, Button, Typography, Grid, List, ListItem, ListItemText, IconButton } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
// import { Paper, Typography } from '@mui/material';


const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user details based on userId
    fetch(`http://127.0.0.1:8000/api/users/${userId}`)
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // const handleBankChange = (bankIndex, field, value) => {
  //   // Update the specific field for the selected bank
  //   const updatedBanks = [...user.banks];
  //   updatedBanks[bankIndex] = { ...updatedBanks[bankIndex], [field]: value };
  //   setUser({ ...user, banks: updatedBanks });
  // };

  // const handleAddBank = () => {
  //   setUser({ ...user, banks: [...user.banks, { bank_name: '', routing_number: '', swift_bic: '' }] });
  // };

  // const handleDeleteBank = (bankIndex) => {
  //   const updatedBanks = user.banks.filter((_, index) => index !== bankIndex);
  //   setUser({ ...user, banks: updatedBanks });
  // };
  const handleBankChange = (bankIndex, field, value) => {
    // Update the specific field for the selected bank
    const updatedBanks = [...user.banks];
    updatedBanks[bankIndex] = { ...updatedBanks[bankIndex], [field]: value };
    setUser({ ...user, banks: updatedBanks });
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send a PUT request to update the user information
      const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        console.log(`Successfully updated user with ID: ${userId}`);
        // Optionally, you can navigate back to the user list or another page
        navigate('/users');
      } else {
        console.error(`Failed to update user with ID: ${userId}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // return (
  //   <div>
  //     <h1>Edit User</h1>
  //     <form onSubmit={handleFormSubmit}>
  //       <label>Username:</label>
  //       <input
  //         type="text"
  //         name="username"
  //         value={user.username}
  //         onChange={handleInputChange}
  //       />
  //       {/* Add more form fields as needed */}
  //       <button type="submit">Save Changes</button>
  //     </form>
  //   </div>
  // );
  // return (
  //   <div>
  //     <h1>Edit User</h1>
  //     <form onSubmit={handleFormSubmit}>
  //       <Grid container spacing={2}>
  //         <Grid item xs={6}>
  //           <TextField
  //             fullWidth
  //             label="Username"
  //             name="username"
  //             value={user.username}
  //             onChange={handleInputChange}
  //           />
  //         </Grid>
  //         <Grid item xs={6}>
  //           <TextField
  //             fullWidth
  //             label="First Name"
  //             name="first_name"
  //             value={user.first_name}
  //             onChange={handleInputChange}
  //           />
  //         </Grid>
  //         <Grid item xs={6}>
  //           <TextField
  //             fullWidth
  //             label="Last Name"
  //             name="last_name"
  //             value={user.last_name}
  //             onChange={handleInputChange}
  //           />
  //         </Grid>
  //         <Grid item xs={6}>
  //           <TextField
  //             fullWidth
  //             label="Email"
  //             name="email"
  //             value={user.email}
  //             onChange={handleInputChange}
  //           />
  //         </Grid>
  //         {/* Add more TextField components for additional fields */}
  //       </Grid>
  //       <Button type="submit" variant="contained" color="primary">
  //         Save Changes
  //       </Button>
  //     </form>
  //   </div>
  // );
  // return (
  //   <Paper style={{ padding: '20px', maxWidth: '400px', margin: '20px auto' }}>
  //     <Typography variant="h5" component="div" gutterBottom>
  //       Edit User
  //     </Typography>
  //     <TextField
  //       label="Username"
  //       variant="outlined"
  //       name="username"
  //       value={user.username}
  //       onChange={handleInputChange}
  //       fullWidth
  //       margin="normal"
  //     />
  //     <TextField
  //       label="First Name"
  //       variant="outlined"
  //       name="first_name"
  //       value={user.first_name}
  //       onChange={handleInputChange}
  //       fullWidth
  //       margin="normal"
  //     />
  //     <TextField
  //       label="Last Name"
  //       variant="outlined"
  //       name="last_name"
  //       value={user.last_name}
  //       onChange={handleInputChange}
  //       fullWidth
  //       margin="normal"
  //     />
  //     <TextField
  //       label="Email"
  //       variant="outlined"
  //       name="email"
  //       value={user.email}
  //       onChange={handleInputChange}
  //       fullWidth
  //       margin="normal"
  //     />
  //     <Button onClick={handleFormSubmit} variant="contained" color="primary">
  //       Save Changes
  //     </Button>
  //   </Paper>
  // );
  // return (
  //   <Paper style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
  //     <Typography variant="h5" component="div" gutterBottom>
  //       Edit User
  //     </Typography>
  //     <form onSubmit={handleFormSubmit}>
  //       <Grid container spacing={2}>
  //         <Grid item xs={6}>
  //           <TextField
  //             label="Username"
  //             variant="outlined"
  //             name="username"
  //             value={user.username}
  //             onChange={handleInputChange}
  //             fullWidth
  //             margin="normal"
  //           />
  //         </Grid>
  //         <Grid item xs={6}>
  //           <TextField
  //             label="Email"
  //             variant="outlined"
  //             name="email"
  //             value={user.email}
  //             onChange={handleInputChange}
  //             fullWidth
  //             margin="normal"
  //           />
  //         </Grid>
  //       </Grid>

  //       <Typography variant="h6" component="div" gutterBottom>
  //         Banks
  //       </Typography>
  //       <List>
  //         {user.banks.map((bank, index) => (
  //           <ListItem key={index}>
  //             <TextField
  //               label="Bank Name"
  //               variant="outlined"
  //               value={bank.bank_name}
  //               onChange={(e) => handleBankChange(index, 'bank_name', e.target.value)}
  //               fullWidth
  //               margin="normal"
  //             />
  //             <TextField
  //               label="Routing Number"
  //               variant="outlined"
  //               value={bank.routing_number}
  //               onChange={(e) => handleBankChange(index, 'routing_number', e.target.value)}
  //               fullWidth
  //               margin="normal"
  //             />
  //             <TextField
  //               label="Swift/BIC"
  //               variant="outlined"
  //               value={bank.swift_bic}
  //               onChange={(e) => handleBankChange(index, 'swift_bic', e.target.value)}
  //               fullWidth
  //               margin="normal"
  //             />
  //             <IconButton onClick={() => handleDeleteBank(index)} color="secondary">
  //               <DeleteIcon />
  //             </IconButton>
  //           </ListItem>
  //         ))}
  //       </List>

  //       <Button type="button" onClick={handleAddBank} startIcon={<AddIcon />} variant="outlined" color="primary">
  //         Add Bank
  //       </Button>

  //       <Button type="submit" variant="contained" color="primary">
  //         Save Changes
  //       </Button>
  //     </form>
  //   </Paper>
  // );
  return (
    <Paper style={{ padding: '20px', maxWidth: '800px', margin: '20px auto' }}>
      <Typography variant="h5" component="div" gutterBottom>
        Edit User
      </Typography>
      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
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
          {user.banks.map((bank, index) => (
            <ListItem key={index}>
              <TextField
                label="Bank Name"
                variant="outlined"
                value={bank.bank_name}
                onChange={(e) => handleBankChange(index, 'bank_name', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Routing Number"
                variant="outlined"
                value={bank.routing_number}
                onChange={(e) => handleBankChange(index, 'routing_number', e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Swift/BIC"
                variant="outlined"
                value={bank.swift_bic}
                onChange={(e) => handleBankChange(index, 'swift_bic', e.target.value)}
                fullWidth
                margin="normal"
              />
            </ListItem>
          ))}
        </List>

        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </form>
    </Paper>
  );
};

export default EditUser;




