import { Snackbar, Alert, Box, Typography } from '@mui/material'
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material'

function SuccessMessage({ open, onClose, message }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        '& .MuiSnackbar-root': {
          top: '24px !important'
        }
      }}
    >
      <Alert
        onClose={onClose}
        severity="success"
        icon={false}
        sx={{
          width: '100%',
          minWidth: '320px',
          maxWidth: '450px',
          backgroundColor: '#ffffff',
          color: '#1a202c',
          borderRadius: '10px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          padding: '12px 16px',
          border: '2px solid #10b981',
          '& .MuiAlert-message': {
            width: '100%',
            padding: 0
          },
          '& .MuiAlert-action': {
            paddingTop: 0,
            alignItems: 'flex-start'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
          <Box
            sx={{
              backgroundColor: '#10b981',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}
          >
            <CheckCircleIcon sx={{ color: 'white', fontSize: 22 }} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 700,
                color: '#1a202c',
                marginBottom: '2px'
              }}
            >
              Success!
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                color: '#4a5568',
                lineHeight: 1.4
              }}
            >
              {message || 'Operation completed successfully!'}
            </Typography>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  )
}

export default SuccessMessage

