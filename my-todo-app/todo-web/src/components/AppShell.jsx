import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { slide as BurgerMenu } from 'react-burger-menu'
import { AppBar, Avatar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChecklistIcon from '@mui/icons-material/Checklist'
import InfoIcon from '@mui/icons-material/Info'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import KeyIcon from '@mui/icons-material/Key'
import PersonIcon from '@mui/icons-material/Person'
import { clearAuthToken, getFirstName, isAuthed } from '../lib/auth.js'

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const authed = isAuthed()
  const firstName = getFirstName()
  const firstNameInitial = firstName.trim().charAt(0).toUpperCase()
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password'

  const title = useMemo(() => {
    if (location.pathname.startsWith('/main')) return 'To-Do'
    if (location.pathname.startsWith('/credit')) return 'Credit'
    if (location.pathname.startsWith('/register')) return 'Register'
    if (location.pathname.startsWith('/forgot-password')) return 'Reset Password'
    return 'Login'
  }, [location.pathname])

  const go = (path) => {
    setOpen(false)
    navigate(path)
  }

  const signOut = () => {
    clearAuthToken()
    go('/login')
  }

  const menuItems = authed
    ? [
        { icon: <ChecklistIcon />, label: 'Main', onClick: () => go('/main') },
        { icon: <InfoIcon />, label: 'Credit', onClick: () => go('/credit') },
        { icon: <LogoutIcon />, label: 'Sign Out', onClick: signOut },
      ]
    : [
        { icon: <LoginIcon />, label: 'Login', onClick: () => go('/login') },
        { icon: <PersonAddIcon />, label: 'Register', onClick: () => go('/register') },
        {
          icon: <KeyIcon />,
          label: 'Forgot Password',
          onClick: () => go('/forgot-password'),
        },
      ]

  return (
    <Box id="outer-container" sx={{ minHeight: '100vh', bgcolor: '#f5f7fb' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {!isAuthPage ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open navigation menu"
              onClick={() => setOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {authed && !isAuthPage ? (
            <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {firstNameInitial || <PersonIcon fontSize="small" />}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {firstName || 'User'}
              </Typography>
            </Box>
          ) : null}
          {!authed && !isAuthPage ? (
            <Button color="inherit" sx={{ ml: 'auto' }} onClick={() => go('/login')}>
              Login
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>

      {!isAuthPage ? (
        <BurgerMenu
          isOpen={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          customBurgerIcon={false}
          width={280}
          outerContainerId="outer-container"
          pageWrapId="page-wrap"
        >
          <div className="menu-title">Navigation</div>
          {menuItems.map((item) => (
            <button key={item.label} className="menu-item-link" onClick={item.onClick}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </BurgerMenu>
      ) : null}

      <Box id="page-wrap" component="main" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

