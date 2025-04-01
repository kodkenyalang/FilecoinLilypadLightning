import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Divider,
  Chip,
  IconButton,
  Button,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ErrorOutline as ErrorIcon,
  Lightbulb as LightbulbIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import { Line, Bar } from 'react-chartjs-2';

// Import zkML components
import ZkMLProcessor from '../components/zkml/ZkMLProcessor';
import StorageManager from '../components/zkml/StorageManager';

// Sample data - This would come from ZK-ML processing via Lilypad in real implementation
const spendingTrendsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  datasets: [
    {
      label: 'Spending',
      data: [2100, 2300, 2200, 2400, 2000, 2600, 2300, 2500, 2200],
      borderColor: '#5E35B1',
      backgroundColor: 'rgba(94, 53, 177, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Income',
      data: [3500, 3500, 3700, 3500, 3600, 3800, 3900, 4000, 4200],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const categoryTrendsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
  datasets: [
    {
      label: 'Food',
      data: [450, 470, 490, 510, 480, 520, 490, 500, 530],
      borderColor: '#FF9800',
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Housing',
      data: [1200, 1200, 1200, 1250, 1250, 1250, 1300, 1300, 1300],
      borderColor: '#2196F3',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Transportation',
      data: [250, 280, 260, 290, 230, 310, 270, 300, 260],
      borderColor: '#9C27B0',
      backgroundColor: 'rgba(156, 39, 176, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const forecastData = {
  labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  datasets: [
    {
      label: 'Predicted Spending',
      data: [2300, 2500, 2800, 2400, 2300, 2200],
      borderColor: '#5E35B1',
      backgroundColor: 'rgba(94, 53, 177, 0.1)',
      borderDash: [5, 5],
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Predicted Income',
      data: [4300, 4300, 4500, 4400, 4300, 4500],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      borderDash: [5, 5],
      fill: true,
      tension: 0.4,
    },
  ],
};

const anomalies = [
  { id: 1, date: '2023-09-15', description: 'Unusual transaction at Electronics Store', amount: 899.99, score: 95, category: 'Shopping' },
  { id: 2, date: '2023-09-10', description: 'Duplicate subscription payment', amount: 12.99, score: 88, category: 'Entertainment' },
  { id: 3, date: '2023-09-05', description: 'Large restaurant bill', amount: 245.30, score: 75, category: 'Food' },
  { id: 4, date: '2023-09-03', description: 'Out-of-state gas purchase', amount: 45.00, score: 65, category: 'Transportation' }
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `analysis-tab-${index}`,
    'aria-controls': `analysis-tabpanel-${index}`,
  };
}

function Analysis() {
  const [value, setValue] = useState(0);
  const [zkProofStatus, setZkProofStatus] = useState('verified'); // 'verified', 'pending', 'failed'
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
  };
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const getAnomalyStatus = (score) => {
    if (score >= 85) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <CheckCircleIcon color="success" />;
      default:
        return <CheckCircleIcon color="success" />;
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Financial Analysis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Privacy-preserving financial insights
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
      
      {/* Zero-Knowledge Proof Status */}
      <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Avatar sx={{ bgcolor: 'primary.light' }}>
                <VerifiedUserIcon />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Zero-Knowledge Proof Status: {zkProofStatus === 'verified' ? 'Verified' : zkProofStatus === 'pending' ? 'Pending' : 'Failed'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All financial analyses are processed using Zero-Knowledge Machine Learning via Lilypad
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label="Last verified: Today at 14:35"
                  color={zkProofStatus === 'verified' ? 'success' : zkProofStatus === 'pending' ? 'warning' : 'error'}
                  sx={{ mr: 1 }}
                />
                <IconButton size="small" sx={{ bgcolor: 'primary.light', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}>
                  <StorageIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Tabs for different analysis views */}
      <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="analysis tabs"
            sx={{ 
              '& .MuiTab-root': { fontWeight: 600 },
              '& .Mui-selected': { color: 'primary.main' }
            }}
          >
            <Tab label="Spending Trends" {...a11yProps(0)} />
            <Tab label="Category Analysis" {...a11yProps(1)} />
            <Tab label="Forecasting" {...a11yProps(2)} />
            <Tab label="Anomaly Detection" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        {/* Spending Trends Panel */}
        <TabPanel value={value} index={0}>
          <Box sx={{ height: 350, mb: 3 }}>
            <Line data={spendingTrendsData} options={chartOptions} />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Key Insights</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Income has been steadily increasing" 
                      secondary="20% growth over the past 9 months"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingDownIcon color="error" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Spending spiked in June" 
                      secondary="30% higher than the previous month"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LightbulbIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Your savings rate has fluctuated" 
                      secondary="Consider setting up automatic savings"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Recommendations</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedUserIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Set a monthly spending limit of $2,300" 
                      secondary="Based on your income and savings goals"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedUserIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Increase emergency fund contributions" 
                      secondary="Consider allocating 5% more to your emergency fund"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedUserIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Review recurring subscriptions" 
                      secondary="You might be able to save $50/month by optimizing"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Category Analysis Panel */}
        <TabPanel value={value} index={1}>
          <Box sx={{ height: 350, mb: 3 }}>
            <Line data={categoryTrendsData} options={chartOptions} />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Category Insights</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Food spending is gradually increasing" 
                      secondary="5% increase month over month"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Housing costs have increased in steps" 
                      secondary="Reflects rent increases every 3 months"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingDownIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Transportation costs vary seasonally" 
                      secondary="Lower in summer months, higher in winter"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Category Recommendations</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedUserIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Consider meal planning to reduce food costs" 
                      secondary="Could save up to $100 monthly"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedUserIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Housing costs are 42% of your income" 
                      secondary="Financial experts recommend staying under 30%"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedUserIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Transportation expenses are well-managed" 
                      secondary="Your spending in this category is optimized"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Forecasting Panel */}
        <TabPanel value={value} index={2}>
          <Box sx={{ height: 350, mb: 3 }}>
            <Line data={forecastData} options={chartOptions} />
          </Box>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Forecast Insights</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Spending expected to increase in November-December" 
                      secondary="Holiday season typically sees 20% higher spending"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Income projected to remain stable" 
                      secondary="With a slight increase in December (bonus)"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingDownIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Spending expected to decrease in Q1 2024" 
                      secondary="Based on your historical patterns"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Projection Highlights</Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedUserIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Projected savings over next 6 months: $8,000" 
                      secondary="Based on current income and spending patterns"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedUserIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Projected total expenses: $15,200" 
                      secondary="Higher than your 6-month average of $14,100"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <VerifiedUserIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Savings growth rate: 4.5% annualized" 
                      secondary="Compared to national average of 3.2%"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Anomaly Detection Panel */}
        <TabPanel value={value} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Detected Spending Anomalies
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Our Zero-Knowledge ML has detected these potentially unusual transactions in your spending patterns. 
                  Review them to ensure they're authorized.
                </Typography>
                <List>
                  {anomalies.map((anomaly) => {
                    const status = getAnomalyStatus(anomaly.score);
                    return (
                      <Paper 
                        key={anomaly.id} 
                        elevation={0} 
                        sx={{ 
                          mb: 2, 
                          p: 2, 
                          borderRadius: 2, 
                          bgcolor: status === 'high' 
                            ? 'rgba(244, 67, 54, 0.08)' 
                            : status === 'medium' 
                              ? 'rgba(255, 152, 0, 0.08)' 
                              : 'rgba(76, 175, 80, 0.08)',
                          border: 1,
                          borderColor: status === 'high' 
                            ? 'error.light' 
                            : status === 'medium' 
                              ? 'warning.light' 
                              : 'success.light'
                        }}
                      >
                        <Grid container spacing={2} alignItems="center">
                          <Grid item>
                            <Avatar sx={{ 
                              bgcolor: status === 'high' 
                                ? 'error.light' 
                                : status === 'medium' 
                                  ? 'warning.light' 
                                  : 'success.light' 
                            }}>
                              {getStatusIcon(status)}
                            </Avatar>
                          </Grid>
                          <Grid item xs>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                              {anomaly.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {anomaly.date} • {anomaly.category} • ${anomaly.amount.toFixed(2)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Typography variant="caption" sx={{ mr: 1 }}>
                                Anomaly Score: {anomaly.score}/100
                              </Typography>
                              <Box sx={{ flexGrow: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={anomaly.score} 
                                  sx={{ 
                                    height: 6, 
                                    borderRadius: 3,
                                    bgcolor: 'rgba(0, 0, 0, 0.08)',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: status === 'high' 
                                        ? 'error.main' 
                                        : status === 'medium' 
                                          ? 'warning.main' 
                                          : 'success.main'
                                    }
                                  }}
                                />
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item>
                            <Box>
                              <Button 
                                size="small" 
                                variant="outlined" 
                                color={status === 'high' ? 'error' : status === 'medium' ? 'warning' : 'success'}
                                sx={{ mr: 1 }}
                              >
                                Details
                              </Button>
                              <Button size="small" variant="contained">
                                Dismiss
                              </Button>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    );
                  })}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Anomaly Detection Methods</Typography>
                <Typography variant="body2" paragraph>
                  Our system uses Zero-Knowledge Machine Learning to detect unusual patterns without 
                  compromising your financial privacy.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Private Transaction Analysis" 
                      secondary="Analyzes patterns while keeping data encrypted"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Secure Pattern Recognition" 
                      secondary="Identifies anomalies without exposing details"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SecurityIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Verifiable Computation" 
                      secondary="All results include zero-knowledge proof of accuracy"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Privacy Technology</Typography>
                
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: 1, borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.light', mb: 1 }}>
                          <StorageIcon />
                        </Avatar>
                        <Typography variant="subtitle2" align="center" gutterBottom>
                          Lighthouse Storage
                        </Typography>
                        <Chip 
                          label="14 files stored" 
                          size="small"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: 1, borderColor: 'divider' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'secondary.light', mb: 1 }}>
                          <SecurityIcon />
                        </Avatar>
                        <Typography variant="subtitle2" align="center" gutterBottom>
                          Filecoin Network
                        </Typography>
                        <Chip 
                          label="8 deals active" 
                          size="small"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Latest CID:</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    bafybeie5gq...4ukbua
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Filecoin Miners:</Typography>
                  <Typography variant="body2">3 active miners</Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
      
      {/* Zero-Knowledge Machine Learning Interface */}
      <Box sx={{ mt: 4, mb: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Zero-Knowledge Machine Learning & Storage
            </Typography>
          </Grid>
        </Grid>
        
        {/* ZkML Processor Component */}
        <Box sx={{ mb: 4 }}>
          <ZkMLProcessor />
        </Box>
        
        {/* Decentralized Storage Manager Component */}
        <Box sx={{ mb: 4 }}>
          <StorageManager />
        </Box>
      </Box>
    </Box>
  );
}

export default Analysis;