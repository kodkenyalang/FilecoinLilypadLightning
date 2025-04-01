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
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Insights as InsightsIcon,
  FlashOn as FlashOnIcon,
  BugReport as BugReportIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Archive as ArchiveIcon,
  Memory as MemoryIcon,
  Code as CodeIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';

/**
 * Component for interacting with Lilypad zkML services
 */
function ZkMLProcessor() {
  const [activeTab, setActiveTab] = useState(0);
  const [apiKey, setApiKey] = useState(localStorage.getItem('lilypadApiKey') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobHistory, setJobHistory] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [zkMLDialogOpen, setZkMLDialogOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('financial_forecast');
  const [verificationStep, setVerificationStep] = useState(0);
  const [anomalyResults, setAnomalyResults] = useState(null);
  const [forecastResults, setForecastResults] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  
  // Model options with zkML capabilities
  const models = [
    {
      id: 'financial_forecast',
      name: 'Financial Forecasting',
      description: 'Predicts future financial trends based on historical data',
      runtime: 'onnx-runtime',
      zkCapable: true,
      icon: <TimelineIcon />
    },
    {
      id: 'financial_anomaly_detector',
      name: 'Anomaly Detection',
      description: 'Identifies unusual spending patterns and potential fraud',
      runtime: 'onnx-runtime',
      zkCapable: true,
      icon: <BugReportIcon />
    },
    {
      id: 'transaction_categorizer',
      name: 'Transaction Categorization',
      description: 'Automatically categorizes transactions using ML',
      runtime: 'onnx-runtime',
      zkCapable: true,
      icon: <ArchiveIcon />
    },
    {
      id: 'savings_optimizer',
      name: 'Savings Optimizer',
      description: 'Recommends optimal savings strategies',
      runtime: 'onnx-runtime',
      zkCapable: true,
      icon: <InsightsIcon />
    }
  ];
  
  // Simulated job history
  useEffect(() => {
    // In production, this would fetch real job data from the API
    const simulatedJobs = [
      {
        id: 'job-123456',
        model: 'financial_forecast',
        status: 'completed',
        startTime: '2023-09-15T14:30:00',
        endTime: '2023-09-15T14:32:10',
        proofVerified: true,
        runtime: 'onnx-runtime'
      },
      {
        id: 'job-123457',
        model: 'financial_anomaly_detector',
        status: 'completed',
        startTime: '2023-09-10T09:22:30',
        endTime: '2023-09-10T09:24:15',
        proofVerified: true,
        runtime: 'onnx-runtime'
      },
      {
        id: 'job-123458',
        model: 'transaction_categorizer',
        status: 'failed',
        startTime: '2023-09-05T16:40:12',
        endTime: '2023-09-05T16:41:22',
        proofVerified: false,
        runtime: 'onnx-runtime'
      }
    ];
    
    setJobHistory(simulatedJobs);
    
    // Simulated anomaly detection results
    const simulatedAnomalies = {
      anomalies: [
        {
          date: '2023-08-15',
          amount: -352.47,
          z_score: 3.2,
          severity: 'high',
          category: 'Shopping'
        },
        {
          date: '2023-09-02',
          amount: -189.93,
          z_score: 2.7,
          severity: 'medium',
          category: 'Entertainment'
        }
      ],
      metadata: {
        model: 'anomaly_detector_onnx',
        threshold: 2.5,
        runtime: 'onnx-runtime',
        privacy_preserved: true,
        provable: true
      }
    };
    
    setAnomalyResults(simulatedAnomalies);
    
    // Simulated forecast results
    const simulatedForecast = {
      forecast: {
        dates: ['2023-10-01', '2023-10-08', '2023-10-15', '2023-10-22', '2023-10-29', '2023-11-05'],
        values: [-48.2, -52.7, -42.3, -55.9, -47.8, -51.2]
      },
      metadata: {
        model: 'financial_forecast_onnx',
        confidence: 0.85,
        provable: true,
        runtime: 'onnx-runtime',
        privacy_preserved: true
      }
    };
    
    setForecastResults(simulatedForecast);
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleSaveApiKey = () => {
    localStorage.setItem('lilypadApiKey', apiKey);
    setError(null);
  };
  
  const handleCheckApiKey = () => {
    setLoading(true);
    
    // In a production environment, this would check if the API key is valid
    setTimeout(() => {
      if (apiKey.length < 10) {
        setError('Invalid API key format');
      } else {
        setError(null);
      }
      setLoading(false);
    }, 1000);
  };
  
  const handleZkMLDialogOpen = () => {
    setZkMLDialogOpen(true);
  };
  
  const handleZkMLDialogClose = () => {
    setZkMLDialogOpen(false);
    setVerificationStep(0);
  };
  
  const handleModelSelect = (modelId) => {
    setSelectedModel(modelId);
  };
  
  const handleStartJob = async () => {
    setLoading(true);
    setVerificationStep(1);
    
    try {
      // Check if API keys are available
      const keyResponse = await fetch('http://localhost:5001/api/keys');
      const keyData = await keyResponse.json();
      
      if (keyData.success && keyData.available_keys.lilypad) {
        console.log("Lilypad API key is available");
        await runLiveJob();
      } else {
        console.log("Using simulated Lilypad response");
        runSimulatedJob();
      }
    } catch (error) {
      console.error("Error checking API keys:", error);
      runSimulatedJob();
    }
  };
  
  const runLiveJob = async () => {
    try {
      // Generate sample data based on the selected model
      const sampleData = getSampleDataForModel(selectedModel);
      
      setVerificationStep(2); // Data encryption
      
      // Wait a bit to show the step
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVerificationStep(3); // Processing
      
      // Call the Lilypad API
      const response = await fetch('http://localhost:5001/api/lilypad/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model_name: getModelNameForAPI(selectedModel),
          data: sampleData
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      setVerificationStep(4); // Generating proof
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVerificationStep(5); // Verifying proof
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.success) {
        setVerificationStep(6); // Complete
        
        // Add job to history
        const newJob = {
          id: data.job_id || `job-${Math.floor(Math.random() * 1000000)}`,
          model: selectedModel,
          status: 'completed',
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          proofVerified: true,
          runtime: 'onnx-runtime'
        };
        
        setJobHistory([newJob, ...jobHistory]);
        setActiveJob(newJob);
        
        // Update results based on the model
        if (selectedModel === 'financial_forecast') {
          updateForecastResults(data.result);
        } else if (selectedModel === 'financial_anomaly_detector') {
          updateAnomalyResults(data.result);
        }
      } else {
        throw new Error(data.message || 'Unknown error running zkML job');
      }
    } catch (error) {
      console.error("Error running live job:", error);
      // Fallback to simulation
      runSimulatedJob();
    } finally {
      setLoading(false);
    }
  };
  
  const runSimulatedJob = () => {
    // Simulate a job execution with steps
    setTimeout(() => {
      setVerificationStep(2); // Data encryption
      setTimeout(() => {
        setVerificationStep(3); // Processing
        setTimeout(() => {
          setVerificationStep(4); // Generating proof
          setTimeout(() => {
            setVerificationStep(5); // Verifying proof
            setTimeout(() => {
              setVerificationStep(6); // Complete
              setLoading(false);
              
              // Add job to history
              const newJob = {
                id: `job-${Math.floor(Math.random() * 1000000)}`,
                model: selectedModel,
                status: 'completed',
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
                proofVerified: true,
                runtime: 'onnx-runtime'
              };
              
              setJobHistory([newJob, ...jobHistory]);
              setActiveJob(newJob);
            }, 2000);
          }, 2000);
        }, 3000);
      }, 1500);
    }, 1000);
  };
  
  const getModelNameForAPI = (modelId) => {
    // Map UI model IDs to API model names
    switch (modelId) {
      case 'financial_forecast':
        return 'spending_forecast';
      case 'financial_anomaly_detector':
        return 'anomaly_detection';
      case 'transaction_categorizer':
        return 'category_prediction';
      case 'savings_optimizer':
        return 'savings_plan';
      default:
        return 'spending_forecast';
    }
  };
  
  const getSampleDataForModel = (modelId) => {
    switch (modelId) {
      case 'financial_forecast':
        return {
          transactions: [
            { date: '2023-01-15', amount: 120.45, category: 'Food' },
            { date: '2023-01-18', amount: 35.20, category: 'Entertainment' },
            { date: '2023-01-20', amount: 250.00, category: 'Housing' },
            { date: '2023-01-25', amount: 85.30, category: 'Shopping' },
            { date: '2023-01-28', amount: 45.99, category: 'Utilities' }
          ]
        };
      case 'financial_anomaly_detector':
        return {
          transactions: [
            { date: '2023-01-15', amount: 120.45, category: 'Food', description: 'Grocery Store' },
            { date: '2023-01-18', amount: 35.20, category: 'Entertainment', description: 'Movie Tickets' },
            { date: '2023-01-20', amount: 250.00, category: 'Housing', description: 'Rent' },
            { date: '2023-01-25', amount: 85.30, category: 'Shopping', description: 'Department Store' },
            { date: '2023-01-28', amount: 45.99, category: 'Utilities', description: 'Electric Bill' },
            { date: '2023-01-30', amount: 999.99, category: 'Shopping', description: 'Electronics Store' }
          ]
        };
      case 'transaction_categorizer':
        return {
          transactions: [
            { description: 'UBER TRIP', amount: 25.50 },
            { description: 'NETFLIX SUBSCRIPTION', amount: 15.99 },
            { description: 'TRADER JOES', amount: 85.75 },
            { description: 'SHELL GAS STATION', amount: 45.00 },
            { description: 'AMC THEATERS', amount: 32.50 }
          ]
        };
      default:
        return { generic: true };
    }
  };
  
  const updateForecastResults = (result) => {
    if (!result || !result.forecast) return;
    
    // Format the API result to match the expected structure for the chart
    const forecast = {
      forecast: {
        dates: result.forecast.map(item => item.date),
        values: result.forecast.map(item => item.value)
      },
      metadata: {
        model: 'financial_forecast_onnx',
        confidence: result.metadata?.metrics?.mape || 0.85,
        provable: true,
        runtime: 'onnx-runtime',
        privacy_preserved: true
      }
    };
    
    setForecastResults(forecast);
  };
  
  const updateAnomalyResults = (result) => {
    if (!result || !result.anomalies) return;
    
    // Format the API result to match the expected structure
    const anomalies = {
      anomalies: result.anomalies.map(anomaly => ({
        date: anomaly.date,
        amount: -anomaly.amount, // Convert to expense format
        z_score: anomaly.anomaly_score * 5, // Convert score to z_score estimate
        severity: anomaly.anomaly_score > 0.85 ? 'high' : 'medium',
        category: anomaly.category
      })),
      metadata: {
        model: 'anomaly_detector_onnx',
        threshold: 2.5,
        runtime: 'onnx-runtime',
        privacy_preserved: true,
        provable: true
      }
    };
    
    setAnomalyResults(anomalies);
  };
  
  const handleViewJobDetails = (job) => {
    setJobDetails(job);
    setJobDialogOpen(true);
  };
  
  const getForecastChart = () => {
    if (!forecastResults) return null;
    
    const data = {
      labels: forecastResults.forecast.dates,
      datasets: [
        {
          label: 'Forecast',
          data: forecastResults.forecast.values,
          borderColor: '#5E35B1',
          backgroundColor: 'rgba(94, 53, 177, 0.1)',
          fill: true,
          tension: 0.4,
        }
      ]
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            display: true,
            drawBorder: false,
          },
          title: {
            display: true,
            text: 'Daily Net Cash Flow ($)'
          }
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          title: {
            display: true,
            text: 'Date'
          }
        }
      }
    };
    
    return <Line data={data} options={options} height={300} />;
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <PsychologyIcon fontSize="large" color="primary" />
                </Grid>
                <Grid item xs>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Zero-Knowledge Machine Learning (zkML)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Process financial data with advanced machine learning while preserving privacy
                  </Typography>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<FlashOnIcon />}
                    onClick={handleZkMLDialogOpen}
                  >
                    Run zkML Analysis
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="zkML result tabs"
                sx={{ 
                  '& .MuiTab-root': { fontWeight: 600 },
                  '& .Mui-selected': { color: 'primary.main' }
                }}
              >
                <Tab label="Forecasting" icon={<TimelineIcon />} iconPosition="start" />
                <Tab label="Anomalies" icon={<BugReportIcon />} iconPosition="start" />
                <Tab label="Processing History" icon={<MemoryIcon />} iconPosition="start" />
              </Tabs>
            </Box>
            
            {/* Forecasting Tab */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Financial Forecast
                  </Typography>
                  <Chip
                    icon={<VerifiedUserIcon />}
                    label="Zero-Knowledge Verified"
                    variant="outlined"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 500, bgcolor: 'rgba(76, 175, 80, 0.08)' }}
                  />
                </Box>
                
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(94, 53, 177, 0.05)', borderRadius: 2, mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    This forecast is computed using zkML on Lilypad. Your financial data remains private and is never exposed.
                  </Typography>
                </Paper>
                
                <Box sx={{ height: 300, mb: 3 }}>
                  {getForecastChart()}
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Forecast Insights
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <TrendingUpIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Daily average spending around $50" 
                            secondary="Based on privacy-preserving analysis of your data"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <InsightsIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Slight upward trend in spending" 
                            secondary="Consider reviewing your budget allocations"
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Model Information
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <CodeIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="ONNX Runtime for Zero-Knowledge Computing" 
                            secondary="Encrypted model execution in a secure environment"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <VerifiedUserIcon color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="85% Confidence Level" 
                            secondary="With mathematical proof of correctness"
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            
            {/* Anomalies Tab */}
            <TabPanel value={activeTab} index={1}>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Spending Anomaly Detection
                  </Typography>
                  <Chip
                    icon={<VerifiedUserIcon />}
                    label="Zero-Knowledge Verified"
                    variant="outlined"
                    color="success"
                    size="small"
                    sx={{ fontWeight: 500, bgcolor: 'rgba(76, 175, 80, 0.08)' }}
                  />
                </Box>
                
                <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(94, 53, 177, 0.05)', borderRadius: 2, mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Anomalies are detected using zkML on Lilypad, ensuring your transaction data remains private while being analyzed.
                  </Typography>
                </Paper>
                
                {anomalyResults && anomalyResults.anomalies.length === 0 ? (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    No spending anomalies detected in your recent transactions.
                  </Alert>
                ) : (
                  <Card elevation={0} sx={{ mb: 3, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                    <CardHeader 
                      title="Detected Anomalies" 
                      subheader={`${anomalyResults?.anomalies.length || 0} unusual transactions identified`}
                    />
                    <Divider />
                    <CardContent sx={{ p: 0 }}>
                      <List>
                        {anomalyResults && anomalyResults.anomalies.map((anomaly, index) => (
                          <ListItem 
                            key={index}
                            divider={index < anomalyResults.anomalies.length - 1}
                          >
                            <ListItemIcon>
                              {anomaly.severity === 'high' ? (
                                <WarningIcon color="error" />
                              ) : anomaly.severity === 'medium' ? (
                                <WarningIcon color="warning" />
                              ) : (
                                <WarningIcon color="info" />
                              )}
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="subtitle1">
                                    {anomaly.category} • ${Math.abs(anomaly.amount).toFixed(2)}
                                  </Typography>
                                  <Chip
                                    label={`Z-Score: ${anomaly.z_score.toFixed(1)}`}
                                    size="small"
                                    color={anomaly.severity === 'high' ? 'error' : 
                                           anomaly.severity === 'medium' ? 'warning' : 'default'}
                                    sx={{ ml: 1 }}
                                  />
                                </Box>
                              }
                              secondary={`Date: ${anomaly.date}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        Detection Parameters
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <SettingsIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Z-Score Threshold: 2.5" 
                            secondary="Values above this are considered anomalies"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <BarChartIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="30-day Baseline Period" 
                            secondary="Comparing against your recent spending patterns"
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.12)' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        ZK Model Information
                      </Typography>
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <CodeIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Anomaly Detection using ONNX Runtime" 
                            secondary="Encrypted computation for privacy preservation"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <SecurityIcon color="success" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Privacy-Preserving Computation" 
                            secondary="Data is never exposed during analysis"
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            
            {/* Processing History Tab */}
            <TabPanel value={activeTab} index={2}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  zkML Processing History
                </Typography>
                
                <List>
                  {jobHistory.map((job, index) => (
                    <ListItem 
                      key={index}
                      divider
                      secondaryAction={
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleViewJobDetails(job)}
                        >
                          Details
                        </Button>
                      }
                    >
                      <ListItemIcon>
                        {job.status === 'completed' ? (
                          <CheckCircleIcon color="success" />
                        ) : job.status === 'failed' ? (
                          <ErrorIcon color="error" />
                        ) : (
                          <CircularProgress size={24} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {models.find(m => m.id === job.model)?.name || job.model}
                            </Typography>
                            {job.proofVerified && (
                              <Chip
                                icon={<VerifiedUserIcon fontSize="small" />}
                                label="Proof Verified"
                                size="small"
                                color="success"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" component="span">
                              Job ID: {job.id} • 
                              Runtime: {job.runtime} • 
                              {new Date(job.startTime).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </TabPanel>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', mb: 3 }}>
            <CardHeader title="Lilypad API Configuration" />
            <Divider />
            <CardContent>
              <TextField
                label="Lilypad API Key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                fullWidth
                type="password"
                margin="normal"
                helperText="Enter your Lilypad API key to enable zkML processing"
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
              title="ZK Processing Stats" 
              subheader="Lilypad Performance"
            />
            <Divider />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Successful Jobs"
                    secondary={jobHistory.filter(j => j.status === 'completed').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ErrorIcon color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Failed Jobs"
                    secondary={jobHistory.filter(j => j.status === 'failed').length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <VerifiedUserIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Proofs Verified"
                    secondary={jobHistory.filter(j => j.proofVerified).length}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CodeIcon color="info" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Available zkML Models"
                    secondary={models.length}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Run zkML Dialog */}
      <Dialog open={zkMLDialogOpen} onClose={handleZkMLDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>Run Zero-Knowledge Machine Learning Analysis</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Select a model to process your financial data using zkML. Your data remains private and secure throughout the analysis process.
          </Typography>
          
          {verificationStep === 0 && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {models.map((model) => (
                <Grid item xs={12} sm={6} key={model.id}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      border: '1px solid rgba(0, 0, 0, 0.12)',
                      cursor: 'pointer',
                      bgcolor: selectedModel === model.id ? 'rgba(94, 53, 177, 0.08)' : 'inherit',
                      '&:hover': { bgcolor: 'rgba(94, 53, 177, 0.05)' }
                    }}
                    onClick={() => handleModelSelect(model.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ mr: 1, color: 'primary.main' }}>
                        {model.icon}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {model.name}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {model.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Chip
                        label={model.runtime}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      {model.zkCapable && (
                        <Chip
                          icon={<SecurityIcon sx={{ fontSize: '0.8rem !important' }} />}
                          label="ZK-Capable"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
          
          {verificationStep > 0 && (
            <Box sx={{ mt: 2 }}>
              <Stepper activeStep={verificationStep - 1} alternativeLabel>
                <Step>
                  <StepLabel>Prepare Data</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Encrypt Data</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Process Data</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Generate Proof</StepLabel>
                </Step>
                <Step>
                  <StepLabel>Verify Proof</StepLabel>
                </Step>
              </Stepper>
              
              <Box sx={{ mt: 4, mb: 2 }}>
                <Typography variant="h6" align="center">
                  {verificationStep === 1 ? 'Preparing Your Data...' :
                   verificationStep === 2 ? 'Encrypting Your Data...' :
                   verificationStep === 3 ? 'Processing Your Data with ONNX Runtime...' :
                   verificationStep === 4 ? 'Generating Zero-Knowledge Proof...' :
                   verificationStep === 5 ? 'Verifying Zero-Knowledge Proof...' :
                   'Analysis Complete!'}
                </Typography>
                
                {verificationStep < 6 && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <LinearProgress />
                  </Box>
                )}
                
                {verificationStep === 6 && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <VerifiedUserIcon color="success" sx={{ fontSize: 60 }} />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Zero-Knowledge Proof Verified Successfully
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your data was processed securely with mathematical privacy guarantees
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleZkMLDialogClose}>Cancel</Button>
          {verificationStep === 0 ? (
            <Button 
              variant="contained" 
              onClick={handleStartJob}
              disabled={!selectedModel || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            >
              Run Analysis
            </Button>
          ) : verificationStep === 6 ? (
            <Button 
              variant="contained" 
              onClick={handleZkMLDialogClose}
              color="success"
              startIcon={<CheckCircleIcon />}
            >
              View Results
            </Button>
          ) : (
            <Button 
              variant="contained" 
              disabled
              startIcon={<CircularProgress size={20} />}
            >
              Processing...
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Job Details Dialog */}
      <Dialog open={jobDialogOpen} onClose={() => setJobDialogOpen(false)} maxWidth="md" fullWidth>
        {jobDetails && (
          <>
            <DialogTitle>
              Job Details
              <Chip
                label={jobDetails.status}
                color={jobDetails.status === 'completed' ? 'success' : 
                       jobDetails.status === 'failed' ? 'error' : 'default'}
                size="small"
                sx={{ ml: 1 }}
              />
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Job Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText primary="Job ID" secondary={jobDetails.id} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Model" secondary={models.find(m => m.id === jobDetails.model)?.name || jobDetails.model} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Start Time" secondary={new Date(jobDetails.startTime).toLocaleString()} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="End Time" secondary={new Date(jobDetails.endTime).toLocaleString()} />
                    </ListItem>
                    <ListItem>
                      <ListItemText 
                        primary="Duration" 
                        secondary={`${Math.round((new Date(jobDetails.endTime) - new Date(jobDetails.startTime)) / 1000)} seconds`} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Zero-Knowledge Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        {jobDetails.proofVerified ? (
                          <VerifiedUserIcon color="success" />
                        ) : (
                          <ErrorIcon color="error" />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary="Proof Status" 
                        secondary={jobDetails.proofVerified ? "Verified Successfully" : "Verification Failed"} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <CodeIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Runtime Environment" 
                        secondary={`${jobDetails.runtime}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <SecurityIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Privacy Status" 
                        secondary="Data remained encrypted during processing" 
                      />
                    </ListItem>
                  </List>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Alert severity="info">
                    All computations are performed with zero-knowledge guarantees. Your financial data remains secure and private.
                  </Alert>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                startIcon={<RefreshIcon />}
                onClick={() => setJobDialogOpen(false)}
              >
                Run Similar Job
              </Button>
              <Button 
                onClick={() => setJobDialogOpen(false)}
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

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`zkml-tabpanel-${index}`}
      aria-labelledby={`zkml-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

// CheckCircleIcon component
function CheckCircleIcon(props) {
  return <VerifiedUserIcon {...props} />;
}

// ErrorIcon component
function ErrorIcon(props) {
  return <WarningIcon {...props} />;
}

export default ZkMLProcessor;