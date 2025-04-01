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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  GetApp as DownloadIcon,
  Security as SecurityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
// Temporarily removing date picker imports to fix build issues
// Will replace with a regular text field for now

// Sample data - This would be fetched from the backend in a real implementation
const sampleTransactions = [
  { id: 1, date: '2023-03-28', description: 'Grocery Shopping', amount: -120.50, category: 'Food', account: 'Checking' },
  { id: 2, date: '2023-03-27', description: 'Salary Deposit', amount: 2500.00, category: 'Income', account: 'Checking' },
  { id: 3, date: '2023-03-25', description: 'Electric Bill', amount: -85.20, category: 'Utilities', account: 'Credit Card' },
  { id: 4, date: '2023-03-22', description: 'Restaurant Dinner', amount: -65.30, category: 'Food', account: 'Credit Card' },
  { id: 5, date: '2023-03-20', description: 'Online Shopping', amount: -39.99, category: 'Shopping', account: 'Credit Card' },
  { id: 6, date: '2023-03-18', description: 'Gas Station', amount: -45.00, category: 'Transportation', account: 'Checking' },
  { id: 7, date: '2023-03-15', description: 'Movie Tickets', amount: -25.00, category: 'Entertainment', account: 'Checking' },
  { id: 8, date: '2023-03-10', description: 'Freelance Payment', amount: 350.00, category: 'Income', account: 'Savings' },
  { id: 9, date: '2023-03-05', description: 'Internet Bill', amount: -75.00, category: 'Utilities', account: 'Checking' },
  { id: 10, date: '2023-03-01', description: 'Health Insurance', amount: -180.00, category: 'Insurance', account: 'Checking' }
];

const categories = [
  'Food', 'Housing', 'Transportation', 'Entertainment', 'Utilities', 
  'Insurance', 'Healthcare', 'Shopping', 'Income', 'Other'
];

const accounts = ['Checking', 'Savings', 'Credit Card', 'Investment'];

function Transactions() {
  const [transactions, setTransactions] = useState(sampleTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState(sampleTransactions);
  const [open, setOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [transactionDate, setTransactionDate] = useState(new Date());
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [amountMin, setAmountMin] = useState('');
  const [amountMax, setAmountMax] = useState('');
  
  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };
  
  const handleFilterModalOpen = () => {
    setFilterModalOpen(true);
  };
  
  const handleFilterModalClose = () => {
    setFilterModalOpen(false);
  };
  
  const resetForm = () => {
    setTransactionDate(new Date());
    setDescription('');
    setAmount('');
    setCategory('');
    setAccount('');
  };
  
  const handleSubmit = () => {
    const newTransaction = {
      id: transactions.length + 1,
      date: format(transactionDate, 'yyyy-MM-dd'),
      description,
      amount: parseFloat(amount),
      category,
      account
    };
    
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    setFilteredTransactions(updatedTransactions);
    handleClose();
  };
  
  const handleDelete = (id) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
    setFilteredTransactions(updatedTransactions);
  };
  
  const applyFilters = () => {
    let filtered = [...transactions];
    
    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(transaction => 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date filters
    if (dateFrom) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.date) >= new Date(dateFrom)
      );
    }
    
    if (dateTo) {
      filtered = filtered.filter(transaction => 
        new Date(transaction.date) <= new Date(dateTo)
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(transaction => 
        transaction.category === categoryFilter
      );
    }
    
    // Apply account filter
    if (accountFilter) {
      filtered = filtered.filter(transaction => 
        transaction.account === accountFilter
      );
    }
    
    // Apply amount filters
    if (amountMin) {
      filtered = filtered.filter(transaction => 
        transaction.amount >= parseFloat(amountMin)
      );
    }
    
    if (amountMax) {
      filtered = filtered.filter(transaction => 
        transaction.amount <= parseFloat(amountMax)
      );
    }
    
    setFilteredTransactions(filtered);
    handleFilterModalClose();
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setDateFrom(null);
    setDateTo(null);
    setCategoryFilter('');
    setAccountFilter('');
    setAmountMin('');
    setAmountMax('');
    setFilteredTransactions(transactions);
    handleFilterModalClose();
  };
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value === '') {
      setFilteredTransactions(transactions);
    } else {
      const filtered = transactions.filter(transaction => 
        transaction.description.toLowerCase().includes(value.toLowerCase()) ||
        transaction.category.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredTransactions(filtered);
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Transactions
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your financial transactions
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
      
      <Card elevation={0} sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <TextField
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />} 
                onClick={handleFilterModalOpen}
                sx={{ mr: 1 }}
              >
                Filter
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                sx={{ mr: 1 }}
              >
                Export
              </Button>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={handleClickOpen}
              >
                Add Transaction
              </Button>
            </Box>
          </Box>
          
          <TableContainer component={Paper} elevation={0}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Account</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.category} 
                        size="small"
                        sx={{
                          bgcolor: transaction.category === 'Income' 
                            ? 'rgba(76, 175, 80, 0.1)' 
                            : 'rgba(0, 0, 0, 0.08)',
                          color: transaction.category === 'Income' 
                            ? 'success.main' 
                            : 'text.primary'
                        }}
                      />
                    </TableCell>
                    <TableCell>{transaction.account}</TableCell>
                    <TableCell align="right" sx={{ 
                      fontWeight: 600,
                      color: transaction.amount > 0 ? 'success.main' : 'inherit'
                    }}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      
      {/* Add Transaction Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Transaction</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Date"
                type="date"
                value={format(transactionDate, 'yyyy-MM-dd')}
                onChange={(e) => setTransactionDate(new Date(e.target.value))}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  label="Category"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Account</InputLabel>
                <Select
                  value={account}
                  label="Account"
                  onChange={(e) => setAccount(e.target.value)}
                >
                  {accounts.map((acc) => (
                    <MenuItem key={acc} value={acc}>{acc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!description || !amount || !category || !account}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Filter Dialog */}
      <Dialog open={filterModalOpen} onClose={handleFilterModalClose} fullWidth maxWidth="sm">
        <DialogTitle>Filter Transactions</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="From Date"
                type="date"
                value={dateFrom ? format(new Date(dateFrom), 'yyyy-MM-dd') : ''}
                onChange={(e) => setDateFrom(e.target.value ? new Date(e.target.value) : null)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="To Date"
                type="date"
                value={dateTo ? format(new Date(dateTo), 'yyyy-MM-dd') : ''}
                onChange={(e) => setDateTo(e.target.value ? new Date(e.target.value) : null)}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Account</InputLabel>
                <Select
                  value={accountFilter}
                  label="Account"
                  onChange={(e) => setAccountFilter(e.target.value)}
                >
                  <MenuItem value="">All Accounts</MenuItem>
                  {accounts.map((acc) => (
                    <MenuItem key={acc} value={acc}>{acc}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Min Amount"
                type="number"
                value={amountMin}
                onChange={(e) => setAmountMin(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Max Amount"
                type="number"
                value={amountMax}
                onChange={(e) => setAmountMax(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetFilters}>Reset</Button>
          <Button onClick={handleFilterModalClose}>Cancel</Button>
          <Button variant="contained" onClick={applyFilters}>Apply</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Transactions;