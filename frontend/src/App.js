// App.js
import React from 'react';
import UserList from './components/UserList';
import BankList from './components/BankList';
import EditUser from './components/EditUser';
import EditBank from './components/EditBank';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/Main';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/banks" element={<BankList />} />
          <Route path="/edit-user/:userId" element={<EditUser />} />
          <Route path="/edit-bank/:bankId" element={<EditBank />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
