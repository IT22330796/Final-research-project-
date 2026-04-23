import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material'
import { Close as CloseIcon, Print as PrintIcon, Download as DownloadIcon } from '@mui/icons-material'

function PDFPreviewModal({ open, onClose, onPrint, onDownload, children }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        style: {
          maxHeight: '90vh',
          height: '90vh'
        }
      }}
    >
      <DialogTitle className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <span className="text-lg font-semibold">Preview Patient Report</span>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers className="p-0 overflow-auto bg-gray-50">
        <div className="p-4" data-pdf-preview>
          {children}
        </div>
      </DialogContent>
      <DialogActions className="bg-gray-100 px-4 py-3 flex justify-between">
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
        >
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            onClick={onPrint}
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
          >
            Print
          </Button>
          <Button
            onClick={onDownload}
            variant="contained"
            color="success"
            startIcon={<DownloadIcon />}
          >
            Download PDF
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default PDFPreviewModal

