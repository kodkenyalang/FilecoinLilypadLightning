import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import StorageManager from '../components/zkml/StorageManager';

function Lighthouse() {
  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
        <Typography variant="h4" gutterBottom>
          Lighthouse Decentralized Storage
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Securely store and manage your financial data on the decentralized web using Lighthouse.storage. 
          All data is encrypted and can be stored on Filecoin for long-term persistence.
        </Typography>
      </Paper>
      
      <StorageManager />
    </Box>
  );
}

export default Lighthouse;