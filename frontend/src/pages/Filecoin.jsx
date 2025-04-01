import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Storage as StorageIcon,
  AssuredWorkload as AssuredWorkloadIcon,
  Link as LinkIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

function Filecoin() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    // Check if the backend API is available and fetch deals if possible
    const fetchData = async () => {
      try {
        // First check if API keys are available
        const keysResponse = await fetch('http://localhost:5001/api/keys');
        const keysData = await keysResponse.json();
        
        if (keysData.success && keysData.available_keys.lighthouse) {
          console.log("Lighthouse API key is available");
          // In a production app, we would fetch real data from the API
          fetchFilecoinDeals();
        } else {
          console.log("Using simulated Filecoin data");
          loadSimulatedData();
        }
      } catch (error) {
        console.error("Error checking API keys:", error);
        loadSimulatedData();
      }
    };
    
    const fetchFilecoinDeals = async () => {
      try {
        setLoading(true);
        // This would be a real API call in production
        const response = await fetch('http://localhost:5001/api/filecoin/deals');
        const data = await response.json();
        
        if (data.success) {
          setDeals(data.deals);
        } else {
          loadSimulatedData();
        }
      } catch (error) {
        console.error("Error fetching Filecoin deals:", error);
        loadSimulatedData();
      } finally {
        setLoading(false);
      }
    };
    
    const loadSimulatedData = () => {
      // Simulated Filecoin deals
      const simulatedDeals = [
        {
          id: 'deal-123456',
          cid: 'bafybeie5gq4jnazvzaypodmykrdpwhg37vsnpy3afdar7vh63zvb4ukbua',
          fileName: 'financial_data_2023Q3.json',
          miner: 'f01234567',
          status: 'active',
          startDate: '2023-07-16',
          endDate: '2024-01-16',
          size: '145 KB',
          cost: '0.00023 FIL'
        },
        {
          id: 'deal-123457',
          cid: 'bafybeihk6hyvdppcdnqpne7o7bnmd2phpc2xafkrz36zmnwu6idkdvbvmm',
          fileName: 'transactions_march.json',
          miner: 'f07654321',
          status: 'active',
          startDate: '2023-04-03',
          endDate: '2023-10-03',
          size: '78 KB',
          cost: '0.00012 FIL'
        },
        {
          id: 'deal-123458',
          cid: 'bafybeigdmmxcchtpgvidghhkagy7wfqhw5xrwlbwry2ercjcefzdu5znxy',
          fileName: 'ml_model_anomaly_detection.onnx',
          miner: 'f08888888',
          status: 'proposing',
          startDate: '2023-06-11',
          endDate: 'pending',
          size: '4.2 MB',
          cost: '0.00087 FIL'
        },
        {
          id: 'deal-123459',
          cid: 'bafybeihfgklcjd45sbwb5ykfae27mrhzakprc4bljkkf4valkzvdy3zrde',
          fileName: 'backup_2023_09.zip',
          miner: 'f09999999',
          status: 'active',
          startDate: '2023-09-29',
          endDate: '2024-03-29',
          size: '10.5 MB',
          cost: '0.00142 FIL'
        }
      ];
      
      setDeals(simulatedDeals);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
        <Typography variant="h4" gutterBottom>
          Filecoin Network Storage
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your data's long-term storage on the Filecoin network. Filecoin provides cryptographically verified storage 
          with built-in economic incentives to ensure data remains available and intact over time.
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AssuredWorkloadIcon fontSize="large" color="primary" sx={{ mr: 2, flexShrink: 0 }} />
                <Typography variant="h5" sx={{ fontWeight: 600, flexShrink: 0 }}>
                  Active Filecoin Storage Deals
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <List disablePadding>
                {deals.map((deal) => (
                  <Box 
                    key={deal.id} 
                    sx={{ 
                      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Grid container alignItems="center" spacing={0} sx={{ p: 2 }}>
                      {/* Left icon */}
                      <Grid xs={1}>
                        <StorageIcon color="primary" />
                      </Grid>
                      
                      {/* Main content - file name and details */}
                      <Grid xs={9}>
                        <Typography variant="body1" fontWeight={500}>
                          {deal.fileName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ mt: 0.5 }}
                        >
                          CID: {deal.cid.substring(0, 10)}...{deal.cid.substring(deal.cid.length - 4)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ mt: 0.5, display: 'block' }}
                        >
                          Storage Provider: {deal.miner} • {deal.size} • {deal.cost}
                          <br />
                          {deal.status === 'active' 
                            ? `Valid from ${deal.startDate} to ${deal.endDate}`
                            : `Started ${deal.startDate} - In progress`}
                        </Typography>
                      </Grid>
                      
                      {/* Right action area */}
                      <Grid xs={2} container justifyContent="flex-end" alignItems="center">
                        <Chip
                          size="small"
                          label={deal.status}
                          color={deal.status === 'active' ? 'success' : deal.status === 'proposing' ? 'warning' : 'default'}
                          sx={{ mr: 1 }}
                          icon={deal.status === 'active' ? <CheckIcon /> : 
                                deal.status === 'proposing' ? <ScheduleIcon /> : 
                                <ErrorIcon />}
                        />
                        <Tooltip title="View on Filecoin Explorer">
                          <IconButton size="small">
                            <LinkIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </List>
              
              {deals.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No Filecoin storage deals found
                  </Typography>
                  <Button variant="outlined" sx={{ mt: 2 }}>
                    Store Data on Filecoin
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Filecoin Network Benefits
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon sx={{ flexShrink: 0 }}>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Verifiable storage guarantees" />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ flexShrink: 0 }}>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Cryptographic proof of storage" />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ flexShrink: 0 }}>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Decentralized storage network" />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ flexShrink: 0 }}>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Economic incentives for reliability" />
                </ListItem>
                <ListItem>
                  <ListItemIcon sx={{ flexShrink: 0 }}>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary="Competitive pricing structure" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Storage Deal Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(94, 53, 177, 0.08)', borderRadius: 2 }}>
                    <Typography variant="h4" color="primary.main" fontWeight="600">
                      {deals.filter(d => d.status === 'active').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Deals
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(255, 152, 0, 0.08)', borderRadius: 2 }}>
                    <Typography variant="h4" color="warning.main" fontWeight="600">
                      {deals.filter(d => d.status === 'proposing').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Deals
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(76, 175, 80, 0.08)', borderRadius: 2 }}>
                    <Typography variant="h4" color="success.main" fontWeight="600">
                      {deals.reduce((acc, deal) => acc + parseFloat(deal.cost.split(' ')[0]), 0).toFixed(5)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total FIL
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(3, 169, 244, 0.08)', borderRadius: 2 }}>
                    <Typography variant="h4" color="info.main" fontWeight="600">
                      {new Set(deals.map(deal => deal.miner)).size}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Storage Providers
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Filecoin;