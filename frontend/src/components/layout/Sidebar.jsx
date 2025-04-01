import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  AccountBalance as AccountBalanceIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Storage as StorageIcon,
  AssuredWorkload as AssuredWorkloadIcon
} from '@mui/icons-material';

// Sidebar width
const drawerWidth = 240;

function Sidebar({ open }) {
  const location = useLocation();
  const [decentralizedOpen, setDecentralizedOpen] = useState(false);
  
  const handleDecentralizedClick = () => {
    setDecentralizedOpen(!decentralizedOpen);
  };
  
  // Nav links with their routes and icons
  const mainNavItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Transactions', path: '/transactions', icon: <ReceiptIcon /> },
    { text: 'Budget', path: '/budget', icon: <AccountBalanceIcon /> },
    { text: 'Analysis', path: '/analysis', icon: <BarChartIcon /> },
  ];
  
  const decentralizedNavItems = [
    { text: 'Lighthouse Storage', path: '/lighthouse', icon: <StorageIcon /> },
    { text: 'Filecoin Network', path: '/filecoin', icon: <AssuredWorkloadIcon /> }
  ];
  
  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {mainNavItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={NavLink}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  '&.active': {
                    bgcolor: 'primary.light',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
          
          <ListItem disablePadding>
            <ListItemButton onClick={handleDecentralizedClick}>
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary="Decentralized" />
              {decentralizedOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          
          <Collapse in={decentralizedOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {decentralizedNavItems.map((item) => (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                      pl: 4,
                      '&.active': {
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        '& .MuiListItemIcon-root': {
                          color: 'primary.main',
                        },
                      },
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </List>
        
        <Divider sx={{ my: 1 }} />
        
        <List>
          <ListItem disablePadding>
            <ListItemButton
              component={NavLink}
              to="/settings"
              selected={location.pathname === '/settings'}
              sx={{
                '&.active': {
                  bgcolor: 'primary.light',
                  color: 'primary.main',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;