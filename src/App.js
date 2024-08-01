import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { initDB } from 'react-indexed-db';
import { dbConfig } from './functions/dbConfig';
import { ConfigProvider } from 'antd';
import { PRIMARY_COLOR } from './common/ThemeConstants';

import 'antd/dist/antd.variable.min.css';
import './App.css';

ConfigProvider.config({
  theme: {
    primaryColor: PRIMARY_COLOR, // "#4561B9",
  },
});

initDB(dbConfig);

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
