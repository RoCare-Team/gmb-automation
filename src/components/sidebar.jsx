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
  Card,
  CardContent,
  Grid,
  CircularProgress,
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
  AccountBalanceWallet as WalletIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

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
  const [userPlan, setUserPlan] = React.useState('Free');
  const [walletBalance, setWalletBalance] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = React.useState(false);
  const [userId, setUserId] = React.useState(null);
  const [subscriptionData, setSubscriptionData] = React.useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = React.useState(false);

  // Fetch user subscription details from API
  const fetchSubscriptionDetails = async () => {
    setSubscriptionLoading(true);
    try {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        console.error('No userId found');
        setUserPlan('Free');
        return;
      }

      const response = await fetch(`/api/auth/signup?userId=${storedUserId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptionData(data);
        
        // Check subscription status
        if (data.subscription && data.subscription.status === 'active') {
          setUserPlan(data.subscription.plan || 'Premium Plan');
          localStorage.setItem('Plan', data.subscription.plan || 'Premium Plan');
        } else {
          setUserPlan('Free');
          localStorage.setItem('Plan', 'Free');
        }

        // Update wallet balance from subscription data
        if (data.wallet !== undefined) {
          setWalletBalance(data.wallet);
          localStorage.setItem('walletBalance', data.wallet.toString());
        }
      } else {
        setUserPlan('Free');
        localStorage.setItem('Plan', 'Free');
      }
    } catch (error) {
      console.error('Error fetching subscription details:', error);
      setUserPlan('Free');
      localStorage.setItem('Plan', 'Free');
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Fetch wallet balance from API
  const fetchWalletBalance = async () => {
    try {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        console.error('No userId found');
        return;
      }

      const response = await fetch(`/api/users/userbalance?userId=${storedUserId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.user.wallet);
        localStorage.setItem('walletBalance', data.user.wallet.toString());
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  // Get plan and wallet from localStorage and API on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        fetchSubscriptionDetails();
        fetchWalletBalance();
      } else {
        const storedPlan = localStorage.getItem('Plan');
        if (storedPlan) {
          setUserPlan(storedPlan);
        } else {
          setUserPlan('Free');
        }

        const storedBalance = localStorage.getItem('walletBalance');
        if (storedBalance) {
          setWalletBalance(parseInt(storedBalance));
        }
      }
    }
  }, []);

  // Refresh wallet balance and subscription periodically
  React.useEffect(() => {
    if (userId) {
      const interval = setInterval(() => {
        fetchWalletBalance();
        fetchSubscriptionDetails();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [userId]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpgradeClick = () => {
    if (userPlan === 'Free' || subscriptionData?.subscription?.status !== 'active') {
      handleMenuClose();
      router.push('/subscription');
    } else {
      setUpgradeDialogOpen(true);
      handleMenuClose();
    }
  };

  const handleUpgradeDialogClose = () => {
    setUpgradeDialogOpen(false);
  };

  const handleWalletClick = () => {
    // Refresh balance before navigating
    if (userId) {
      fetchWalletBalance();
    }
    handleMenuClose();
    router.push('/wallet');
  };

  const handleSignOut = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      toast.success('Logged out successfully!');
      router.push('/login');
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

  const getPlanConfig = (plan) => {
    const planLower = plan?.toLowerCase() || 'free';

    switch (planLower) {
      case 'premium':
      case 'premium plan':
      case 'pro':
        return {
          label: 'Premium',
          gradient: 'linear-gradient(to right, #f59e0b, #d97706)',
          color: 'white',
        };
      case 'enterprise':
      case 'enterprise plan':
        return {
          label: 'Enterprise',
          gradient: 'linear-gradient(to right, #8b5cf6, #6d28d9)',
          color: 'white',
        };
      case 'standard':
      case 'standard plan':
        return {
          label: 'Standard',
          gradient: 'linear-gradient(to right, #3b82f6, #2563eb)',
          color: 'white',
        };
      case 'free':
      default:
        return {
          label: 'Free',
          gradient: 'linear-gradient(to right, #6b7280, #4b5563)',
          color: 'white',
        };
    }
  };

  const planConfig = getPlanConfig(userPlan);

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider />

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
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Toaster position="top-right" />

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
              {/* Wallet Chip - Click to navigate to wallet page */}
              <Chip
                label={`${walletBalance} Coins`}
                icon={<WalletIcon sx={{ color: 'white !important' }} />}
                onClick={handleWalletClick}
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(to right, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.9,
                    transform: 'scale(1.05)',
                    transition: 'all 0.2s',
                  },
                }}
              />

              {/* Plan Chip - Click to upgrade or view subscription */}
              <Chip
                label={subscriptionLoading ? 'Loading...' : (userPlan || 'Free')}
                icon={
                  subscriptionLoading ? (
                    <CircularProgress size={16} sx={{ color: 'white !important' }} />
                  ) : (
                    <UpgradeIcon sx={{ color: 'white !important' }} />
                  )
                }
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
                      {user?.name}
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
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || 'No email'}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleWalletClick}>
            <ListItemIcon>
              <WalletIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Wallet ({walletBalance} Coins)</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleUpgradeClick}>
            <ListItemIcon>
              <UpgradeIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>
              {userPlan === 'Free' || subscriptionData?.subscription?.status !== 'active'
                ? 'Upgrade Plan'
                : 'Manage Subscription'}
            </ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              router.push('/settings');
            }}
          >
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

        {/* Subscription Details Dialog */}
        <Dialog open={upgradeDialogOpen} onClose={handleUpgradeDialogClose} maxWidth="md" fullWidth>
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 700,
            }}
          >
            Subscription Details
          </DialogTitle>
          <DialogContent sx={{ mt: 3 }}>
            {subscriptionLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                      Current Plan
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Plan Name
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {subscriptionData?.subscription?.plan || 'Free'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">
                            Status
                          </Typography>
                          <Chip
                            label={
                              subscriptionData?.subscription?.status === 'active' ? 'Active' : 'Inactive'
                            }
                            color={
                              subscriptionData?.subscription?.status === 'active' ? 'success' : 'default'
                            }
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Grid>
                      {subscriptionData?.subscription?.status === 'active' && (
                        <>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Start Date
                              </Typography>
                              <Typography variant="body1">
                                {new Date(subscriptionData.subscription.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Expiry Date
                              </Typography>
                              <Typography variant="body1">
                                {new Date(subscriptionData.subscription.expiry).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Order ID
                              </Typography>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                {subscriptionData.subscription.orderId}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Payment ID
                              </Typography>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                {subscriptionData.subscription.paymentId}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                Wallet Balance
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 600, color: '#10b981' }}>
                                {subscriptionData.wallet || walletBalance} Coins
                              </Typography>
                            </Box>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </CardContent>
                </Card>

                {subscriptionData?.subscription?.status !== 'active' && (
                  <Box
                    sx={{
                      p: 3,
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      Unlock Premium Features
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Upgrade your plan to access advanced features and boost your productivity!
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => {
                        handleUpgradeDialogClose();
                        router.push('/subscription');
                      }}
                      sx={{
                        background: 'linear-gradient(to right, #667eea, #764ba2)',
                        color: 'white',
                        fontWeight: 600,
                        px: 4,
                        '&:hover': {
                          background: 'linear-gradient(to right, #5568d3, #6941a0)',
                        },
                      }}
                    >
                      View Plans & Upgrade
                    </Button>
                  </Box>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={handleUpgradeDialogClose} variant="outlined">
              Close
            </Button>
            {subscriptionData?.subscription?.status === 'active' && (
              <Button
                onClick={() => {
                  handleUpgradeDialogClose();
                  router.push('/subscription');
                }}
                variant="contained"
                sx={{
                  background: 'linear-gradient(to right, #667eea, #764ba2)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #5568d3, #6941a0)',
                  },
                }}
              >
                Change Plan
              </Button>
            )}
          </DialogActions>
        </Dialog>

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

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f6fa' }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </>
  );
}