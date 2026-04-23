import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogContentText, Box, IconButton } from '@mui/material'
import { Warning as WarningIcon, Close as CloseIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material'

function ConfirmationModal({ open, onClose, onConfirm, title, message }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      PaperProps={{
        sx: {
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          minWidth: '320px',
          maxWidth: '400px'
        }
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '16px 20px',
          color: 'white',
          position: 'relative'
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 6,
            top: 6,
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)'
            }
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <WarningIcon sx={{ fontSize: 24 }} />
          </Box>
          <DialogTitle
            id="confirmation-dialog-title"
            sx={{
              color: 'white',
              padding: 0,
              fontSize: '18px',
              fontWeight: 700,
              flex: 1
            }}
          >
            {title || 'Confirm Action'}
          </DialogTitle>
        </Box>
      </Box>
      
      <DialogContent sx={{ padding: '16px 20px', paddingTop: '20px' }}>
        <DialogContentText
          id="confirmation-dialog-description"
          sx={{
            fontSize: '14px',
            color: '#4a5568',
            lineHeight: 1.5,
            marginTop: 0.5
          }}
        >
          {message || 'Are you sure you want to proceed?'}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions
        sx={{
          padding: '12px 20px',
          gap: 1.5,
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f7fafc'
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            borderColor: '#cbd5e0',
            color: '#4a5568',
            fontWeight: 600,
            fontSize: '14px',
            '&:hover': {
              borderColor: '#a0aec0',
              backgroundColor: '#edf2f7'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          autoFocus
          startIcon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
          sx={{
            textTransform: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.39)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              boxShadow: '0 6px 20px 0 rgba(102, 126, 234, 0.5)'
            }
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationModal

