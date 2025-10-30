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
  TextField,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
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
  Add as AddIcon,
  LocalOffer as CouponIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { signOut } from 'next-auth/react';
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
  const [userPlan, setUserPlan] = React.useState('');
  const [walletBalance, setWalletBalance] = React.useState(0);
  const [transactions, setTransactions] = React.useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = React.useState(false);
  const [walletDialogOpen, setWalletDialogOpen] = React.useState(false);
  const [selectedAmount, setSelectedAmount] = React.useState(null);
  const [couponCode, setCouponCode] = React.useState('');
  const [discount, setDiscount] = React.useState(0);
  const [tabValue, setTabValue] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [userId, setUserId] = React.useState(null);


  // Coupon codes
  const validCoupons = {
    'SAVE10': 10,
    'SAVE20': 20,
    'WELCOME50': 50,
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
          // setWallet(data.user.wallet)
          // Also update localStorage for backup
          // localStorage.setItem('walletBalance', data.wallet.toString());
        }
      
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  // Update wallet via API
  const updateWalletAPI = async (amount, type = 'add') => {
    setLoading(true);
    try {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) {
        toast.error('User ID not found');
        return false;
      }

      const response = await fetch('/api/auth/signup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: storedUserId,
          amount: Number(amount),
          type: type, // 'add', 'deduct', or 'replace'
        }),
      });

      const data = await response.json();
      console.log("databbbbbbbbbbbbbbbbb",data);
      
      

      if (data.status) {
        // Fetch updated balance
        await fetchWalletBalance();
        return true;
      } else {
        toast.error(data.message || 'Failed to update wallet');
        return false;
      }
    } catch (error) {
      console.error('Wallet update error:', error);
      toast.error('Something went wrong');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get plan and wallet from localStorage and API on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPlan = localStorage.getItem('Plan');
      if (storedPlan) {
        setUserPlan(storedPlan);
      }

      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        setUserId(storedUserId);
        // Fetch real-time wallet balance
        fetchWalletBalance();
      } else {
        // Fallback to localStorage if no userId
        const storedBalance = localStorage.getItem('walletBalance');
        if (storedBalance) {
          setWalletBalance(parseInt(storedBalance));
        }
      }

      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    }
  }, []);

  // Refresh wallet balance periodically
  React.useEffect(() => {
    if (userId) {
      const interval = setInterval(() => {
        fetchWalletBalance();
      }, 30000); // Refresh every 30 seconds

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
    setUpgradeDialogOpen(true);
    handleMenuClose();
  };

  const handleUpgradeDialogClose = () => {
    setUpgradeDialogOpen(false);
  };

  const handleWalletClick = () => {
    // Refresh balance when opening wallet
    if (userId) {
      fetchWalletBalance();
    }
    router.push("/wallet")
  };

  const handleWalletDialogClose = () => {
    setWalletDialogOpen(false);
    setSelectedAmount(null);
    setCouponCode('');
    setDiscount(0);
    setTabValue(0);
  };

  const handleApplyCoupon = () => {
    const upperCoupon = couponCode.toUpperCase();
    if (validCoupons[upperCoupon]) {
      setDiscount(validCoupons[upperCoupon]);
      toast.success(`Coupon applied! ${validCoupons[upperCoupon]}% discount`);
    } else {
      setDiscount(0);
      toast.error('Invalid coupon code');
    }
  };

  const handleAddCoins = (amount) => {
    setSelectedAmount(amount);
  };

  const calculateFinalPrice = (price) => {
    if (discount > 0) {
      return (price - (price * discount / 100)).toFixed(2);
    }
    return price.toFixed(2);
  };

  const handleConfirmPurchase = async () => {
    if (selectedAmount) {
      const pkg = coinPackages?.find(p => p.amount === selectedAmount);
      const finalPrice = calculateFinalPrice(pkg.price);

      // Update wallet via API
      const success = await updateWalletAPI(selectedAmount, 'add');

      if (success) {
        // Save transaction locally
        const newTransaction = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          type: 'Credit',
          amount: selectedAmount,
          price: finalPrice,
          coupon: discount > 0 ? couponCode.toUpperCase() : 'None',
          discount: discount,
        };

        const updatedTransactions = [newTransaction, ...transactions];
        setTransactions(updatedTransactions);

        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
        }

        toast.success(`Successfully added ${selectedAmount} coins to your wallet!`);
        handleWalletDialogClose();
      }
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear all localStorage data
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }

      toast.success('Logged out successfully!');
      router.push("/login")
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

  const coinPackages = [
    { amount: 500, price: 5, popular: false },
    { amount: 1000, price: 10, popular: true },
    { amount: 2000, price: 18, popular: false },
    { amount: 3000, price: 25, popular: false },
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
      {/* <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleSignOut}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': { backgroundColor: '#d32f2f' },
          }}
        >
          Expire Session
        </Button>
      </Box> */}
    </Box>
  );

  console.log("user",user);
  

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />


        {/* AppBar */}
        <AppBar position="fixed" open={open}>
                <Toaster position="top-right" />

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
              {/* Wallet Chip */}
              <Chip
                label={`${walletBalance} Coins`}
                icon={<WalletIcon sx={{ color: 'white !important' }} />}
                onClick={handleWalletClick}
                sx={{
                  fontWeight: 600,
                  background: 'linear-gradient(to right, #667eea, #bbc7c3ff)',
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

              {/* Plan Chip with Upgrade Option */}
              <Chip
                label={localStorage.getItem("Plan")}
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

        {/* Wallet Dialog */}
        <Dialog
          open={walletDialogOpen}
          onClose={handleWalletDialogClose}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #667eea 100%)',
            color: 'white',
            fontWeight: 700,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WalletIcon />
                Wallet
              </Box>
              {loading && <CircularProgress size={24} sx={{ color: 'white' }} />}
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 2 }}>
              <Tab label="Add Coins" icon={<AddIcon />} iconPosition="start" />
              <Tab label="Transactions" icon={<HistoryIcon />} iconPosition="start" />
            </Tabs>

            {tabValue === 0 && (
              <>
                <Box sx={{ mb: 3, textAlign: 'center', p: 2, background: '#f0fdf4', borderRadius: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea' }}>
                    {walletBalance} Coins
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current Balance (Live)
                  </Typography>
                  <Button
                    size="small"
                    onClick={fetchWalletBalance}
                    disabled={loading}
                    sx={{ mt: 1 }}
                  >
                    {loading ? 'Refreshing...' : 'Refresh Balance'}
                  </Button>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3, px: 4 }}>
                  {coinPackages.map((pkg) => (
                    <Grid item xs={12} sm={6} key={pkg.amount}>
                      <Card
                        onClick={() => handleAddCoins(pkg.amount)}
                        sx={{
                          cursor: 'pointer',
                          border: selectedAmount === pkg.amount ? '3px solid #10b981' : '2px solid #e5e7eb',
                          borderRadius: 2,
                          transition: 'all 0.2s',
                          position: 'relative',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)',
                          },
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center', py: 3 }}>
                          <Box sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #10b981 0%, #667eea 100%)',
                            mb: 2,
                          }}>
                            <Typography sx={{ fontSize: 24, color: 'white', fontWeight: 700 }}>
                              {pkg.amount}
                            </Typography>
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                            {pkg.amount} Coins
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
                            ${pkg.price}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Coupon Code Section */}
                <Box sx={{ mb: 3, p: 2, background: '#fef3c7', borderRadius: 2, border: '1px dashed #f59e0b' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CouponIcon sx={{ color: '#f59e0b' }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Have a Coupon Code?
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      fullWidth
                      sx={{ background: 'white' }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleApplyCoupon}
                      sx={{
                        background: 'linear-gradient(to right, #f59e0b, #d97706)',
                        '&:hover': {
                          background: 'linear-gradient(to right, #d97706, #b45309)',
                        },
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                  {discount > 0 && (
                    <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 600, mt: 1, display: 'block' }}>
                      ✓ {discount}% discount applied!
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Try: SAVE10, SAVE20, or WELCOME50
                  </Typography>
                </Box>

                {selectedAmount && (
                  <Box sx={{
                    p: 2,
                    background: '#f0fdf4',
                    borderRadius: 2,
                    border: '1px solid #10b981',
                  }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
                      Purchase Summary
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Coins:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {selectedAmount} Coins
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Original Price:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        ${coinPackages.find(p => p.amount === selectedAmount)?.price}
                      </Typography>
                    </Box>
                    {discount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="success.main">Discount ({discount}%):</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                          -${(coinPackages.find(p => p.amount === selectedAmount)?.price * discount / 100).toFixed(2)}
                        </Typography>
                      </Box>
                    )}
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        Total Price:
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#10b981' }}>
                        ${calculateFinalPrice(coinPackages.find(p => p.amount === selectedAmount)?.price)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">New Balance:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {walletBalance + selectedAmount} Coins
                      </Typography>
                    </Box>
                  </Box>
                )}
              </>
            )}

            {tabValue === 1 && (
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Coins</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Coupon</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Discount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                            No transactions yet
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <Chip
                              label={transaction.type}
                              size="small"
                              color="success"
                            />
                          </TableCell>
                          <TableCell>{transaction.amount}</TableCell>
                          <TableCell>${transaction.price}</TableCell>
                          <TableCell>{transaction.coupon}</TableCell>
                          <TableCell>{transaction.discount}%</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={handleWalletDialogClose}
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            {tabValue === 0 && (
              <Button
                onClick={handleConfirmPurchase}
                variant="contained"
                disabled={!selectedAmount || loading}
                sx={{
                  textTransform: 'none',
                  background: 'linear-gradient(to right, #667eea, #667eea)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #667eea, #667eea)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Confirm Purchase'}
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Upgrade Dialog */}
        <Dialog
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
            <Typography variant="body1" sx={{ mb: 1 }}>
              Current Plan: <strong>{planConfig.label}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contact support to upgrade your plan.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUpgradeDialogClose}>Close</Button>
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

        {/* Main content */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f6fa' }}>
          <DrawerHeader />
          {children}
        </Box>
      </Box>
    </>
  );
}