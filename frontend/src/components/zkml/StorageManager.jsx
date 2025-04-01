import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  IconButton,
  Paper,
  Tooltip,
  Link
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Folder as FolderIcon,
  DataObject as DataObjectIcon,
  Link as LinkIcon,
  FileCopy as FileCopyIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon
} from '@mui/icons-material';

/**
 * Component for interacting with decentralized storage via Lighthouse and Filecoin
 */
function StorageManager() {
  const [files, setFiles] = useState([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDetailsOpen, setFileDetailsOpen] = useState(false);
  const [selectedFileDetails, setSelectedFileDetails] = useState(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('lighthouseApiKey') || '');
  const [filecoinDeals, setFilecoinDeals] = useState([]);
  
  // Simulated data for now - in production this would call the API
  useEffect(() => {
    // Check if API keys are available
    const fetchApiKeyStatus = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/keys');
        const data = await response.json();
        
        if (data.success && data.available_keys.lighthouse) {
          console.log("Lighthouse API key is available");
          // In a real app, we would fetch real data using the API
          fetchLighthouseFiles();
        } else {
          console.log("Using simulated Lighthouse data");
        }
      } catch (error) {
        console.error("Error checking API keys:", error);
      }
    };
    
    const fetchLighthouseFiles = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/lighthouse/files');
        const data = await response.json();
        
        if (data.success) {
          setFiles(data.files);
          console.log("Fetched files from API:", data.files);
        }
      } catch (error) {
        console.error("Error fetching Lighthouse files:", error);
        // Fallback to simulated data
        useSimulatedData();
      }
    };
    
    const useSimulatedData = () => {
      // Simulate loading data from Lighthouse
      const simulatedFiles = [
        { 
          id: 1, 
          name: 'financial_data_2023Q3.json', 
          cid: 'bafybeie5gq4jnazvzaypodmykrdpwhg37vsnpy3afdar7vh63zvb4ukbua', 
          size: '145 KB', 
          uploadDate: '2023-07-15', 
          type: 'financial',
          status: 'stored',
          filecoinStatus: 'active'
        },
        { 
          id: 2, 
          name: 'transactions_march.json', 
          cid: 'bafybeihk6hyvdppcdnqpne7o7bnmd2phpc2xafkrz36zmnwu6idkdvbvmm', 
          size: '78 KB', 
          uploadDate: '2023-04-02', 
          type: 'transactions',
          status: 'stored',
          filecoinStatus: 'active'
        },
        { 
          id: 3, 
          name: 'ml_model_anomaly_detection.onnx', 
          cid: 'bafybeigdmmxcchtpgvidghhkagy7wfqhw5xrwlbwry2ercjcefzdu5znxy', 
          size: '4.2 MB', 
          uploadDate: '2023-06-10', 
          type: 'model',
          status: 'stored',
          filecoinStatus: 'pending'
        },
        { 
          id: 4, 
          name: 'backup_2023_09.zip', 
          cid: 'bafybeihfgklcjd45sbwb5ykfae27mrhzakprc4bljkkf4valkzvdy3zrde', 
          size: '10.5 MB', 
          uploadDate: '2023-09-28', 
          type: 'backup',
          status: 'stored',
          filecoinStatus: 'active'
        }
      ];
      
      setFiles(simulatedFiles);
      
      // Simulate Filecoin deals
      const simulatedDeals = [
        {
          dealId: 'f01234567-1',
          cid: 'bafybeie5gq4jnazvzaypodmykrdpwhg37vsnpy3afdar7vh63zvb4ukbua',
          miner: 'f01234567',
          status: 'active',
          startDate: '2023-07-16',
          duration: '180 days'
        },
        {
          dealId: 'f07654321-1',
          cid: 'bafybeihk6hyvdppcdnqpne7o7bnmd2phpc2xafkrz36zmnwu6idkdvbvmm',
          miner: 'f07654321',
          status: 'active',
          startDate: '2023-04-03',
          duration: '180 days'
        },
        {
          dealId: 'f08888888-1',
          cid: 'bafybeigdmmxcchtpgvidghhkagy7wfqhw5xrwlbwry2ercjcefzdu5znxy',
          miner: 'f08888888',
          status: 'proposing',
          startDate: '2023-06-11',
          duration: 'pending'
        },
        {
          dealId: 'f09999999-1',
          cid: 'bafybeihfgklcjd45sbwb5ykfae27mrhzakprc4bljkkf4valkzvdy3zrde',
          miner: 'f09999999',
          status: 'active',
          startDate: '2023-09-29',
          duration: '180 days'
        }
      ];
      
      setFilecoinDeals(simulatedDeals);
    };
    
    // Start the process
    fetchApiKeyStatus();
  }, []);

  const handleUploadDialogOpen = () => {
    setUploadDialogOpen(true);
  };

  const handleUploadDialogClose = () => {
    setUploadDialogOpen(false);
  };

  const handleFileUpload = () => {
    setLoading(true);
    
    // Simulate API call to Lighthouse
    setTimeout(() => {
      const newFile = { 
        id: files.length + 1, 
        name: selectedFile?.name || 'new_file.json', 
        cid: `bafybeiae${Math.random().toString(36).substring(2, 15)}`, 
        size: `${Math.floor(Math.random() * 200)} KB`, 
        uploadDate: new Date().toISOString().split('T')[0], 
        type: 'financial',
        status: 'stored',
        filecoinStatus: 'pending'
      };
      
      setFiles([newFile, ...files]);
      setSelectedFile(null);
      setLoading(false);
      setUploadDialogOpen(false);
    }, 2000);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleViewDetails = (file) => {
    setSelectedFileDetails(file);
    setFileDetailsOpen(true);
    
    // In a real implementation, this would fetch more details from the API
  };
  
  const handleSaveApiKey = () => {
    // In a real implementation, we would validate the API key
    localStorage.setItem('lighthouseApiKey', apiKey);
    setError(null);
  };
  
  const handleCheckApiKey = () => {
    // In a real implementation, this would check if the API key is valid
    setLoading(true);
    
    setTimeout(() => {
      if (apiKey.length < 10) {
        setError('Invalid API key format');
      } else {
        setError(null);
      }
      setLoading(false);
    }, 1000);
  };
  
  const handleStoreOnFilecoin = (file) => {
    // In a real implementation, this would call the Filecoin storage API
    setLoading(true);
    
    setTimeout(() => {
      const updatedFiles = files.map(f => 
        f.id === file.id ? { ...f, filecoinStatus: 'pending' } : f
      );
      setFiles(updatedFiles);
      setLoading(false);
    }, 1500);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <StorageIcon fontSize="large" color="primary" />
                </Grid>
                <Grid item xs>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Decentralized Storage Manager
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Securely store and manage your financial data using Lighthouse.storage and Filecoin
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    onClick={handleUploadDialogOpen}
                  >
                    Upload Data
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', height: '100%' }}>
            <CardHeader 
              title="Stored Files" 
              subheader={`${files.length} files stored with Lighthouse`}
              action={
                <Chip
                  icon={<SecurityIcon />}
                  label="Decentralized & Encrypted"
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 500, bgcolor: 'rgba(94, 53, 177, 0.08)' }}
                />
              }
            />
            <Divider />
            <CardContent sx={{ maxHeight: 400, overflow: 'auto' }}>
              {files.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color="text.secondary">No files uploaded yet</Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {files.map((file) => (
                    <ListItem 
                      key={file.id}
                      secondaryAction={
                        <Box>
                          <Tooltip title="View Details">
                            <IconButton edge="end" onClick={() => handleViewDetails(file)}>
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                          <Chip
                            size="small"
                            label={file.filecoinStatus === 'active' ? 'Filecoin: Active' : 
                                  file.filecoinStatus === 'pending' ? 'Filecoin: Pending' : 'Store on Filecoin'}
                            color={file.filecoinStatus === 'active' ? 'success' : 
                                  file.filecoinStatus === 'pending' ? 'warning' : 'default'}
                            onClick={() => file.filecoinStatus === 'none' && handleStoreOnFilecoin(file)}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      divider
                    >
                      <ListItemIcon>
                        {file.type === 'financial' ? <DataObjectIcon color="primary" /> :
                         file.type === 'transactions' ? <DataObjectIcon color="secondary" /> :
                         file.type === 'model' ? <StorageIcon color="error" /> :
                         <FolderIcon color="warning" />
                        }
                      </ListItemIcon>
                      <ListItemText
                        primary={file.name}
                        secondary={
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" component="span" color="text.secondary">
                              {file.size} • {file.uploadDate}
                            </Typography>
                            <Tooltip title="Copy CID">
                              <IconButton size="small" sx={{ ml: 1 }} onClick={() => navigator.clipboard.writeText(file.cid)}>
                                <FileCopyIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', mb: 3 }}>
            <CardHeader title="API Configuration" />
            <Divider />
            <CardContent>
              <TextField
                label="Lighthouse API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                fullWidth
                type="password"
                margin="normal"
                helperText="Enter your Lighthouse API key to enable storage"
                error={!!error}
              />
              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
                </Alert>
              )}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleCheckApiKey}
                  disabled={loading}
                >
                  Test Connection
                  {loading && <CircularProgress size={24} sx={{ ml: 1 }} />}
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleSaveApiKey}
                  disabled={!apiKey}
                >
                  Save API Key
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardHeader 
              title="Storage Stats" 
              subheader="Lighthouse & Filecoin"
            />
            <Divider />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <StorageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Total Files"
                    secondary={files.length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Files on Filecoin"
                    secondary={files.filter(f => f.filecoinStatus === 'active').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ArrowForwardIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Pending Deals"
                    secondary={files.filter(f => f.filecoinStatus === 'pending').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DataObjectIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Storage Providers"
                    secondary={new Set(filecoinDeals.map(deal => deal.miner)).size}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={handleUploadDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Data to Lighthouse</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Files uploaded to Lighthouse are stored on IPFS and can optionally be stored on Filecoin for long-term persistence.
          </Typography>
          
          <Box sx={{ mt: 2, mb: 3, textAlign: 'center', border: '2px dashed rgba(94, 53, 177, 0.2)', borderRadius: 2, p: 3 }}>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<UploadIcon />}
                sx={{ mb: 2 }}
              >
                Select File
              </Button>
            </label>
            
            {selectedFile && (
              <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: 'rgba(94, 53, 177, 0.05)' }}>
                <Typography variant="body2">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </Typography>
              </Paper>
            )}
          </Box>
          
          <Alert severity="info">
            All data is encrypted using Lighthouse's client-side encryption before upload.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUploadDialogClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleFileUpload}
            disabled={!selectedFile || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
          >
            {loading ? 'Uploading...' : 'Upload to Lighthouse'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* File Details Dialog */}
      <Dialog open={fileDetailsOpen} onClose={() => setFileDetailsOpen(false)} maxWidth="md" fullWidth>
        {selectedFileDetails && (
          <>
            <DialogTitle>
              File Details
              <Chip
                label={selectedFileDetails.type}
                color="primary"
                size="small"
                sx={{ ml: 1 }}
              />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>File Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Name" secondary={selectedFileDetails.name} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Size" secondary={selectedFileDetails.size} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Upload Date" secondary={selectedFileDetails.uploadDate} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Content ID (CID)" 
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {selectedFileDetails.cid}
                            </Box>
                            <IconButton 
                              size="small" 
                              onClick={() => navigator.clipboard.writeText(selectedFileDetails.cid)}
                            >
                              <FileCopyIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        } 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="IPFS Gateway URL" 
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Link href={`https://gateway.lighthouse.storage/ipfs/${selectedFileDetails.cid}`} target="_blank" rel="noopener">
                              gateway.lighthouse.storage/ipfs/{selectedFileDetails.cid.substring(0, 10)}...
                            </Link>
                            <IconButton 
                              size="small" 
                              component="a"
                              href={`https://gateway.lighthouse.storage/ipfs/${selectedFileDetails.cid}`}
                              target="_blank"
                            >
                              <LinkIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        } 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Filecoin Storage</Typography>
                  {filecoinDeals.filter(deal => deal.cid === selectedFileDetails.cid).length === 0 ? (
                    <Alert severity="info">
                      This file is not yet stored on Filecoin. Store on Filecoin for long-term persistence.
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                        onClick={() => handleStoreOnFilecoin(selectedFileDetails)}
                      >
                        Store on Filecoin
                      </Button>
                    </Alert>
                  ) : (
                    <List dense>
                      {filecoinDeals
                        .filter(deal => deal.cid === selectedFileDetails.cid)
                        .map((deal, index) => (
                          <ListItem key={index} divider={index < filecoinDeals.filter(d => d.cid === selectedFileDetails.cid).length - 1}>
                            <ListItemText 
                              primary={`Deal ID: ${deal.dealId}`} 
                              secondary={
                                <Box>
                                  <Typography variant="body2" component="span">
                                    Miner: {deal.miner} • Status: {deal.status}
                                  </Typography>
                                  <br />
                                  <Typography variant="body2" component="span">
                                    Start Date: {deal.startDate} • Duration: {deal.duration}
                                  </Typography>
                                </Box>
                              } 
                            />
                          </ListItem>
                        ))}
                    </List>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Alert severity="info">
                    This file is securely stored with encryption. Only you can access your data with the proper decryption keys.
                  </Alert>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => window.open(`https://gateway.lighthouse.storage/ipfs/${selectedFileDetails.cid}`, '_blank')}
                startIcon={<LinkIcon />}
              >
                View on IPFS
              </Button>
              <Button 
                onClick={() => setFileDetailsOpen(false)}
                variant="contained"
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default StorageManager;