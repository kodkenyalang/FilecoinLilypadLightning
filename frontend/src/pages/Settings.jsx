import { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  Switch,
  TextField,
  Button,
  FormControlLabel,
  FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Sync as SyncIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  AddCircle as AddCircleIcon,
  Delete as DeleteIcon,
  Key as KeyIcon,
  AccountBalance as AccountBalanceIcon,
  ExpandMore as ExpandMoreIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon
} from '@mui/icons-material';

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  
  const handleDarkModeChange = (event) => {
    setDarkMode(event.target.checked);
  };
  
  const handleNotificationsChange = (event) => {
    setNotifications(event.target.checked);
  };
  
  const handleEmailNotificationsChange = (event) => {
    setEmailNotifications(event.target.checked);
  };
  
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  
  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };
  
  const handleOpenApiKeyDialog = () => {
    setApiKeyDialogOpen(true);
  };
  
  const handleCloseApiKeyDialog = () => {
    setApiKeyDialogOpen(false);
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Settings
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Configure your application preferences
          </Typography>
        </Box>
        <Chip
          icon={<SecurityIcon />}
          label="Zero-Knowledge ML Active"
          variant="outlined"
          color="primary"
          sx={{ fontWeight: 500, bgcolor: 'rgba(94, 53, 177, 0.08)' }}
        />
      </Box>
      
      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', height: '100%' }}>
            <CardHeader
              title="General Settings"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              avatar={
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <SettingsIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              <FormGroup>
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={darkMode}
                        onChange={handleDarkModeChange}
                        color="primary"
                      />
                    }
                    label="Dark Mode"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Switch between light and dark theme
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={language}
                      onChange={handleLanguageChange}
                      label="Language"
                      startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
                    >
                      <MenuItem value="en">English</MenuItem>
                      <MenuItem value="es">Spanish</MenuItem>
                      <MenuItem value="fr">French</MenuItem>
                      <MenuItem value="de">German</MenuItem>
                      <MenuItem value="zh">Chinese</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <FormControl fullWidth variant="outlined" size="small">
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={currency}
                      onChange={handleCurrencyChange}
                      label="Currency"
                      startAdornment={<AccountBalanceIcon sx={{ mr: 1 }} />}
                    >
                      <MenuItem value="USD">US Dollar ($)</MenuItem>
                      <MenuItem value="EUR">Euro (€)</MenuItem>
                      <MenuItem value="GBP">British Pound (£)</MenuItem>
                      <MenuItem value="JPY">Japanese Yen (¥)</MenuItem>
                      <MenuItem value="CAD">Canadian Dollar (C$)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PaletteIcon />}
                    fullWidth
                  >
                    Customize Theme
                  </Button>
                </Box>
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', height: '100%' }}>
            <CardHeader
              title="Notification Settings"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              avatar={
                <Avatar sx={{ bgcolor: 'secondary.light' }}>
                  <NotificationsIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              <FormGroup>
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications}
                        onChange={handleNotificationsChange}
                        color="primary"
                      />
                    }
                    label="Push Notifications"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Receive alerts for important events
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={emailNotifications}
                        onChange={handleEmailNotificationsChange}
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                    Receive email updates and summaries
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>Notification Types</Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Budget Alerts"
                      secondary="When you exceed 80% of a budget category"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        size="small"
                        defaultChecked
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Anomaly Detection"
                      secondary="When unusual transactions are detected"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        size="small"
                        defaultChecked
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Weekly Summaries"
                      secondary="Receive weekly financial reports"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        size="small"
                        defaultChecked
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="New Analysis Available"
                      secondary="When new insights are ready"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        edge="end"
                        size="small"
                        defaultChecked
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </FormGroup>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Security & Privacy */}
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardHeader
              title="Security & Privacy"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              avatar={
                <Avatar sx={{ bgcolor: 'primary.dark' }}>
                  <SecurityIcon />
                </Avatar>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Accordion elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 2, overflow: 'hidden' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Zero-Knowledge Machine Learning
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Privacy-preserving ML Status
                        </Typography>
                        <Chip label="Active" color="success" size="small" />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Lilypad Provider
                        </Typography>
                        <Typography variant="body2">
                          lilypad.tech
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          ZK Proof Verification
                        </Typography>
                        <Chip label="Enabled" color="primary" size="small" />
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Button 
                        variant="outlined" 
                        startIcon={<KeyIcon />}
                        size="small"
                        onClick={handleOpenApiKeyDialog}
                      >
                        Configure API Key
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                  
                  <Accordion elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 2, overflow: 'hidden' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Data Privacy
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        <ListItem>
                          <ListItemText
                            primary="Financial Data Encryption"
                            secondary="All your financial data is encrypted at rest"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              edge="end"
                              size="small"
                              defaultChecked
                              disabled
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Anonymous Analytics"
                            secondary="Share anonymous usage data to improve services"
                          />
                          <ListItemSecondaryAction>
                            <Switch
                              edge="end"
                              size="small"
                              defaultChecked
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Transaction History"
                            secondary="Clear all locally stored transaction history"
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Accordion elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 2, overflow: 'hidden' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Decentralized Storage
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          Lighthouse Storage
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Status
                          </Typography>
                          <Chip label="Connected" color="success" size="small" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Files Stored
                          </Typography>
                          <Typography variant="body2">
                            14 files
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Latest CID
                          </Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            bafybeie5gq...4ukbua
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                          Filecoin Network
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Status
                          </Typography>
                          <Chip label="Connected" color="success" size="small" />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Active Deals
                          </Typography>
                          <Typography variant="body2">
                            8 deals
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            Storage Miners
                          </Typography>
                          <Typography variant="body2">
                            3 miners
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Button 
                        variant="outlined" 
                        startIcon={<StorageIcon />}
                        size="small"
                        onClick={handleOpenApiKeyDialog}
                      >
                        Configure Storage Keys
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Button 
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      fullWidth
                    >
                      Delete All Data
                    </Button>
                    <Button 
                      variant="contained"
                      startIcon={<SyncIcon />}
                      fullWidth
                    >
                      Sync Settings
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onClose={handleCloseApiKeyDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          Configure API Keys
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Enter your API keys for connecting to privacy-preserving services.
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Lilypad API Key"
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Enter your Lilypad API key for zkML"
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              Visit <a href="https://lilypad.tech" target="_blank" rel="noopener noreferrer">lilypad.tech</a> to obtain your API key for zero-knowledge machine learning.
            </Typography>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Lighthouse API Key"
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Enter your Lighthouse storage API key"
              sx={{ mb: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              Visit <a href="https://lighthouse.storage" target="_blank" rel="noopener noreferrer">lighthouse.storage</a> to obtain your API key for decentralized storage.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseApiKeyDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCloseApiKeyDialog}>
            Save Keys
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings;