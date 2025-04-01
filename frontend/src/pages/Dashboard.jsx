import { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  Card, 
  CardContent, 
  CardHeader,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  Avatar
} from '@mui/material';
import { 
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

// Sample data - This would be fetched from the backend in a real implementation
const sampleTransactions = [
  { id: 1, date: '2023-03-28', description: 'Grocery Shopping', amount: -120.50, category: 'Food' },
  { id: 2, date: '2023-03-27', description: 'Salary Deposit', amount: 2500.00, category: 'Income' },
  { id: 3, date: '2023-03-25', description: 'Electric Bill', amount: -85.20, category: 'Utilities' },
  { id: 4, date: '2023-03-22', description: 'Restaurant Dinner', amount: -65.30, category: 'Food' },
  { id: 5, date: '2023-03-20', description: 'Online Shopping', amount: -39.99, category: 'Shopping' },
];

// Chart data
const monthlySpendingData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Income',
      data: [2800, 2900, 3100, 2950, 3200, 3500, 3400],
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Expenses',
      data: [1800, 2100, 1900, 2200, 2100, 2300, 2400],
      borderColor: '#E91E63',
      backgroundColor: 'rgba(233, 30, 99, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const spendingByCategoryData = {
  labels: ['Food', 'Housing', 'Transport', 'Entertainment', 'Utilities', 'Shopping'],
  datasets: [
    {
      data: [25, 30, 15, 10, 12, 8],
      backgroundColor: [
        '#FF9800', '#2196F3', '#4CAF50', '#9C27B0', '#F44336', '#00BCD4'
      ],
      borderWidth: 1,
    },
  ],
};

function Dashboard() {
  const [balance, setBalance] = useState(6500);
  const [income, setIncome] = useState(3500);
  const [expenses, setExpenses] = useState(2200);
  const [savingsRate, setSavingsRate] = useState(37); // percentage
  const [transactions, setTransactions] = useState(sampleTransactions);
  
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
  
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    cutout: '70%',
  };

  // Fetch data - would come from API in real implementation
  useEffect(() => {
    // Fetch balance, income, expenses, transactions
    // This is where we would call our backend API
  }, []);
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Financial overview and recent activity
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

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                  <WalletIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary" sx={{ flexShrink: 0 }}>
                  Balance
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                ${balance.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.light', mr: 2 }}>
                  <ArrowUpwardIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary" sx={{ flexShrink: 0 }}>
                  Income
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'success.main' }}>
                ${income.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'error.light', mr: 2 }}>
                  <ArrowDownwardIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary" sx={{ flexShrink: 0 }}>
                  Expenses
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'error.main' }}>
                ${expenses.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.light', mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Typography variant="h6" color="text.secondary" sx={{ flexShrink: 0 }}>
                  Savings Rate
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'info.main' }}>
                {savingsRate}%
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LinearProgress 
                  variant="determinate" 
                  value={savingsRate} 
                  sx={{ 
                    flex: 1, 
                    height: 8, 
                    borderRadius: 4,
                    bgcolor: 'rgba(0, 0, 0, 0.08)'
                  }} 
                  color="info"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardHeader
              title="Income vs Expenses"
              subheader="Last 7 months"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <Line data={monthlySpendingData} options={chartOptions} height={300} />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardHeader
              title="Spending by Category"
              subheader="This month"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ height: 300 }}>
              <Doughnut data={spendingByCategoryData} options={doughnutOptions} height={300} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)' }}>
            <CardHeader
              title="Recent Transactions"
              titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent sx={{ p: 0 }}>
              <List sx={{ width: '100%' }}>
                {transactions.map((transaction) => (
                  <ListItem
                    key={transaction.id}
                    sx={{ 
                      borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
                      '&:last-child': { borderBottom: 'none' },
                      pr: 12 // Add extra padding to the right to make room for the chip
                    }}
                  >
                    <ListItemText
                      primary={transaction.description}
                      secondary={transaction.date}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600,
                        color: transaction.amount > 0 ? 'success.main' : 'inherit',
                        mr: 2,
                        flexShrink: 0
                      }}
                    >
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </Typography>
                    <Box sx={{ position: 'absolute', right: 16 }}>
                      <Chip
                        label={transaction.category}
                        size="small"
                        icon={<CategoryIcon fontSize="small" />}
                        sx={{ 
                          bgcolor: transaction.category === 'Income' 
                            ? 'rgba(76, 175, 80, 0.1)' 
                            : 'rgba(0, 0, 0, 0.08)',
                          color: transaction.category === 'Income' 
                            ? 'success.main' 
                            : 'text.primary',
                          ml: 2
                        }}
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;