import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Divider,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Avatar,
  Chip,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  DirectionsCar as CarIcon,
  Fastfood as FoodIcon,
  Wifi as WifiIcon,
  LocalHospital as HealthIcon,
  ShoppingCart as ShoppingIcon,
  Theaters as EntertainmentIcon,
  School as EducationIcon,
  Flight as TravelIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { Pie } from 'react-chartjs-2';

// Sample data - This would be fetched from the backend in a real implementation
const categories = [
  { id: 1, name: 'Housing', icon: <HomeIcon />, color: '#3498db', budget: 1200, spent: 1150 },
  { id: 2, name: 'Food', icon: <FoodIcon />, color: '#2ecc71', budget: 500, spent: 420 },
  { id: 3, name: 'Transportation', icon: <CarIcon />, color: '#9b59b6', budget: 300, spent: 280 },
  { id: 4, name: 'Utilities', icon: <WifiIcon />, color: '#f1c40f', budget: 200, spent: 185 },
  { id: 5, name: 'Healthcare', icon: <HealthIcon />, color: '#e74c3c', budget: 250, spent: 75 },
  { id: 6, name: 'Shopping', icon: <ShoppingIcon />, color: '#1abc9c', budget: 150, spent: 210 },
  { id: 7, name: 'Entertainment', icon: <EntertainmentIcon />, color: '#e67e22', budget: 200, spent: 180 },
  { id: 8, name: 'Education', icon: <EducationIcon />, color: '#34495e', budget: 300, spent: 300 },
  { id: 9, name: 'Travel', icon: <TravelIcon />, color: '#16a085', budget: 400, spent: 100 }
];

const totalIncome = 4500;
const savingsGoals = [
  { id: 1, name: 'Emergency Fund', target: 10000, current: 6500, color: '#3498db' },
  { id: 2, name: 'Vacation', target: 3000, current: 1800, color: '#2ecc71' },
  { id: 3, name: 'Down Payment', target: 50000, current: 15000, color: '#9b59b6' }
];

function Budget() {
  const [budgetCategories, setBudgetCategories] = useState(categories);
  const [open, setOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [totalBudgeted, setTotalBudgeted] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  
  // Prepare pie chart data
  const pieData = {
    labels: budgetCategories.map(cat => cat.name),
    datasets: [
      {
        data: budgetCategories.map(cat => cat.budget),
        backgroundColor: budgetCategories.map(cat => cat.color),
        borderWidth: 0,
      },
    ],
  };
  
  const spendingData = {
    labels: budgetCategories.map(cat => cat.name),
    datasets: [
      {
        data: budgetCategories.map(cat => cat.spent),
        backgroundColor: budgetCategories.map(cat => cat.color),
        borderWidth: 0,
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: $${value}`;
          }
        }
      }
    },
    cutout: '70%',
  };
  
  useEffect(() => {
    // Calculate totals
    const budgeted = budgetCategories.reduce((sum, cat) => sum + cat.budget, 0);
    const spent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
    
    setTotalBudgeted(budgeted);
    setTotalSpent(spent);
    setRemaining(totalIncome - budgeted);
  }, [budgetCategories]);
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleAddCategory = () => {
    // Generate random color
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    
    const newCategoryObj = {
      id: budgetCategories.length + 1,
      name: newCategory,
      icon: <MoneyIcon />,
      color: randomColor,
      budget: parseInt(newBudget),
      spent: 0
    };
    
    setBudgetCategories([...budgetCategories, newCategoryObj]);
    setNewCategory('');
    setNewBudget('');
    handleClose();
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Budget Planner
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your monthly budget allocations
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
      
      {/* Budget Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                  Total Income
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                  ${totalIncome.toLocaleString()}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body1">Budgeted</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    ${totalBudgeted.toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(totalBudgeted / totalIncome) * 100} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color="primary"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body1">Spent</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    ${totalSpent.toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(totalSpent / totalIncome) * 100} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color="error"
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body1">Remaining</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: remaining < 0 ? 'error.main' : 'success.main' }}>
                    ${remaining.toLocaleString()}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(Math.max(0, remaining) / totalIncome) * 100} 
                  sx={{ height: 8, borderRadius: 4 }}
                  color="success"
                />
              </Box>
              
              <Button 
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
                fullWidth
                sx={{ mt: 2 }}
              >
                Add Category
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', height: '100%' }}>
            <CardHeader
              title="Budget Allocation"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <Divider />
            <CardContent sx={{ height: 300, pt: 2 }}>
              <Pie data={pieData} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', height: '100%' }}>
            <CardHeader
              title="Spending Distribution"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <Divider />
            <CardContent sx={{ height: 300, pt: 2 }}>
              <Pie data={spendingData} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Category Breakdown */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardHeader
              title="Budget Categories"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              action={
                <Button 
                  variant="outlined"
                  startIcon={<AddIcon />}
                  size="small"
                  onClick={handleClickOpen}
                >
                  Add
                </Button>
              }
            />
            <Divider />
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {budgetCategories.map((category) => {
                const percentSpent = (category.spent / category.budget) * 100;
                return (
                  <Box key={category.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton edge="end">
                          <MoreVertIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: category.color + '20', color: category.color }}>
                          {category.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {category.name}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              ${category.spent} / ${category.budget}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {percentSpent.toFixed(0)}% used
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color={percentSpent > 100 ? 'error.main' : 'text.secondary'}
                              >
                                ${Math.max(0, category.budget - category.spent)} left
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={Math.min(100, percentSpent)} 
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                bgcolor: 'rgba(0, 0, 0, 0.08)'
                              }}
                              color={percentSpent > 90 ? 'error' : 'primary'}
                            />
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </Box>
                );
              })}
            </List>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', mb: 3 }}>
            <CardHeader
              title="Savings Goals"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              action={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              {savingsGoals.map((goal) => {
                const progress = (goal.current / goal.target) * 100;
                return (
                  <Box key={goal.id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {goal.name}
                      </Typography>
                      <Typography variant="body2">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 4,
                            bgcolor: 'rgba(0, 0, 0, 0.08)',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: goal.color
                            }
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {progress.toFixed(0)}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
              <Button 
                variant="outlined"
                fullWidth
                startIcon={<AddIcon />}
              >
                Add Goal
              </Button>
            </CardContent>
          </Card>
          
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardHeader
              title="Budget Tips"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
            />
            <Divider />
            <CardContent>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Consider reducing entertainment budget by 15%"
                    secondary="This could save you $30 monthly"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Your food expenses are lower than budget"
                    secondary="You can reallocate $80 to savings"
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Shopping spending is over budget"
                    secondary="You've exceeded by $60 this month"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Add Category Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Add Budget Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Budget Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleAddCategory} 
            variant="contained"
            disabled={!newCategory || !newBudget}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Budget;