/**
 * AppShell.jsx — โครงหน้าร่วม (AppBar + Drawer + พื้นที่เนื้อหา)
 * What: เมนูนำทางไป Main/Credit และออกจากระบบ; แสดงชื่อหน้าตาม path
 * Why: หน้าที่อยู่ภายใต้ Route เดียวกันใช้ layout เดียวกัน โดยเนื้อหาแทรกผ่าน <Outlet />
 */
import { useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ChecklistIcon from '@mui/icons-material/Checklist'
import InfoIcon from '@mui/icons-material/Info'
import LogoutIcon from '@mui/icons-material/Logout'

const drawerWidth = 280

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const title = useMemo(() => {
    if (location.pathname.startsWith('/main')) return 'To-Do'
    if (location.pathname.startsWith('/credit')) return 'Credit'
    return 'Login'
  }, [location.pathname])

  // ปิด Drawer หลังเลือกเมนู — UX บนมือถือไม่ให้เมนูบังหน้าจอ
  const go = (path) => {
    setOpen(false)
    navigate(path)
  }

  // ล้างสถานะ mock แล้วกลับหน้า Login — หากมี token จริงควรลบจาก storage เช่นกัน
  const signOut = () => {
    localStorage.removeItem('todo_authed')
    go('/login')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open navigation menu"
            onClick={() => setOpen(true)}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: drawerWidth } }}
      >
        <Box sx={{ px: 2, py: 1.75 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            เมนู
          </Typography>
          <Typography variant="body2" color="text.secondary">
            To-Do Mockup (MUI + Router + Toast)
          </Typography>
        </Box>
        <Divider />
        <List sx={{ py: 1 }}>
          <ListItemButton
            selected={location.pathname.startsWith('/main')}
            onClick={() => go('/main')}
          >
            <ListItemIcon>
              <ChecklistIcon />
            </ListItemIcon>
            <ListItemText primary="Main" secondary="รายการ To-Do" />
          </ListItemButton>
          <ListItemButton
            selected={location.pathname.startsWith('/credit')}
            onClick={() => go('/credit')}
          >
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="Credit" secondary="ผู้จัดทำ" />
          </ListItemButton>
        </List>
        <Divider />
        <List sx={{ py: 1 }}>
          <ListItemButton onClick={signOut}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Sign Out" secondary="กลับไปหน้า Login" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}

