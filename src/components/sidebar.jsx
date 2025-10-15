'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  Drawer as MuiDrawer,
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  useMediaQuery,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  AccountCircle as AccountIcon,
  Article as PostIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Upgrade as UpgradeIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  background: '#f9fafb',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 72,
  [theme.breakpoints.up('sm')]: {
    width: 80,
  },
  background: '#f9fafb',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  })
);

export default function Sidebar({ children, user }) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = React.useState(!isMobile);
  const [userPlan, setUserPlan] = React.useState('Standard');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = React.useState(false);

  // Get plan from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('Plan');
      if (storedPlan) {
        setUserPlan(storedPlan);
      }
    }
  }, []);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpgradeClick = () => {
    setUpgradeDialogOpen(true);
    handleMenuClose();
  };

  const handleUpgradeDialogClose = () => {
    setUpgradeDialogOpen(false);
  };

  const handleSignOut = async () => {
    try {
      // Clear all localStorage data
      if (typeof window !== 'undefined') {
        localStorage.clear();
        // Or clear specific keys if you want to keep some data
        // localStorage.removeItem('Plan');
        // localStorage.removeItem('token');
        // Add other keys you want to clear
      }

      toast.success('Logged out successfully!');
      router.push("/login")
      
      // Sign out from NextAuth
      // await signOut({ 
      //   callbackUrl: '/auth/signin',
      //   redirect: true 
      // });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout. Please try again.');
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'POST Managements', icon: <AccountIcon />, path: '/post-management' },
    { text: 'Review Mangements', icon: <PostIcon />, path: '/review-management' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  // Get plan color and display
  const getPlanConfig = (plan) => {
    const planLower = plan?.toLowerCase() || 'standard';
    
    switch (planLower) {
      case 'premium':
      case 'pro':
        return {
          label: 'Premium',
          gradient: 'linear-gradient(to right, #f59e0b, #d97706)',
          color: 'white',
        };
      case 'enterprise':
        return {
          label: 'Enterprise',
          gradient: 'linear-gradient(to right, #8b5cf6, #6d28d9)',
          color: 'white',
        };
      case 'standard':
      default:
        return {
          label: 'Standard',
          gradient: 'linear-gradient(to right, #3b82f6, #2563eb)',
          color: 'white',
        };
    }
  };

  const planConfig = getPlanConfig(userPlan);

const drawerContent = (
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    {/* Header */}
    <DrawerHeader>
      <IconButton onClick={handleDrawerClose}>
        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </DrawerHeader>

    <Divider />

    {/* Menu List */}
    <List sx={{ flex: 1, overflowY: 'auto' }}>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => {
              if (isMobile) handleDrawerClose();
              if (item.path) router.push(item.path);
            }}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              mx: 1,
              my: 0.5,
              borderRadius: 2,
              '&:hover': { 
                backgroundColor: '#e3f2fd',
                transform: 'translateX(4px)',
                transition: 'all 0.2s ease-in-out',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 2 : 'auto',
                justifyContent: 'center',
                color: '#667eea',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>

    {/* Logout Button at Bottom */}
    <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={() =>
          signOut({ callbackUrl: '/auth/signin', redirect: true })
        }
        sx={{
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': { backgroundColor: '#d32f2f' },
        }}
      >
        Expire Session
      </Button>
    </Box>
  </Box>
);
  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        
        {/* AppBar */}
        <AppBar position="fixed" open={open}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {(!open || isMobile) && (
                <IconButton color="inherit" onClick={handleDrawerOpen} edge="start">
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" noWrap sx={{ ml: 2, fontWeight: 700 }}>
                AI GMB Manager
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Plan Chip with Upgrade Option */}
              <Chip
                label={planConfig.label}
                icon={<UpgradeIcon sx={{ color: 'white !important' }} />}
                onClick={handleUpgradeClick}
                sx={{ 
                  fontWeight: 600,
                  background: planConfig.gradient,
                  color: planConfig.color,
                  border: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.9,
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s',
                  },
                }}
              />

              {/* User Menu */}
              <Box 
                onClick={handleMenuOpen}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Badge 
                  color="success" 
                  variant="dot"
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <Avatar 
                    alt={user?.name || 'User'} 
                    src={user?.image || user?.avatar}
                    sx={{ width: 36, height: 36 }}
                  />
                </Badge>
                {!isMobile && (
                  <>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {user?.name || 'Guest'}
                    </Typography>
                    <ArrowDownIcon />
                  </>
                )}
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* User Menu Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 3,
            sx: {
              mt: 1.5,
              minWidth: 200,
              borderRadius: 2,
            },
          }}
        >
          <MenuItem disabled>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {user?.name || 'Guest'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || 'No email'}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleUpgradeClick}>
            <ListItemIcon>
              <UpgradeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Upgrade Plan</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); router.push('/settings'); }}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={handleSignOut}
            sx={{ 
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.dark',
              },
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        {/* Upgrade Dialog */}
        {/* <Dialog 
          open={upgradeDialogOpen} 
          onClose={handleUpgradeDialogClose}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 700,
          }}>
            Upgrade Your Plan
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Current Plan: <strong>{planConfig.label}</strong>
              </Typography>

              {/* Standard Plan */}
              {/* <Box sx={{ 
                p: 2, 
                border: '2px solid #e5e7eb', 
                borderRadius: 2,
                opacity: userPlan.toLowerCase() === 'standard' ? 0.6 : 1,
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Standard Plan
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • 1 GMB Profile<br />
                  • Basic Analytics<br />
                  • Email Support
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                  Free
                </Typography>
              </Box> */}

             
              {/* Enterprise Plan */}
              {/* <Box sx={{ 
                p: 2, 
                border: '2px solid #8b5cf6', 
                borderRadius: 2,
                background: 'linear-gradient(to bottom right, #f5f3ff, #ffffff)',
              }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Enterprise Plan
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • Unlimited GMB Profiles<br />
                  • Full Analytics Suite<br />
                  • 24/7 Premium Support<br />
                  • Custom Integrations<br />
                  • Dedicated Account Manager
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                  $99/month
                </Typography>
              </Box> */}
            {/* </Box> */}
          {/* </DialogContent> */}
          

        {/* Drawer */}
        {isMobile ? (
          <MuiDrawer
            variant="temporary"
            open={open}
            onClose={handleDrawerClose}
            sx={{
              '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
            }}
          >
            {drawerContent}
          </MuiDrawer>
        ) : (
          <Drawer variant="permanent" open={open}>
            {drawerContent}
          </Drawer>
        )}

        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f6fa' }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </>
  );
}