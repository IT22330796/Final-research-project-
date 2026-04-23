import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Button, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    TextField, 
    Grid, 
    MenuItem, 
    CircularProgress, 
    Alert 
} from '@mui/material';
import axios from 'axios';

const LiverRiskPredictor = ({ open, handleClose, initialData = null }) => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        age: '',
        tb: '',
        db: '',
        sgpt: '',
        sgot: '',
        alkphos: '',
        tp: '',
        alb: '',
        'a/g_ratio': '',
        gender_Male: '1'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
            // Automatically predict if initialData is provided via report upload
            if (initialData.autoPredict) {
                handleSubmit(null, { ...formData, ...initialData });
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e, forcedData = null) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const dataToSend = forcedData || { ...formData };
            
            // Convert everything to numbers
            Object.keys(dataToSend).forEach(key => {
                if (key !== 'autoPredict') {
                    dataToSend[key] = parseFloat(dataToSend[key]) || 0;
                }
            });

            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/liver/predict-risk`, dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResult(response.data.prediction);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to get prediction. Ensure Flask server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle className="bg-indigo-900 text-white font-bold">
                Liver Disease Risk Prediction (Clinical Data)
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent dividers>
                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Gender" name="gender_Male" select value={formData.gender_Male} onChange={handleChange} required>
                                <MenuItem value="1">Male</MenuItem>
                                <MenuItem value="0">Female</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Total Bilirubin (TB)" name="tb" type="number" inputProps={{ step: "0.1" }} value={formData.tb} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Direct Bilirubin (DB)" name="db" type="number" inputProps={{ step: "0.1" }} value={formData.db} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Alkphos" name="alkphos" type="number" value={formData.alkphos} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="SGPT (ALT)" name="sgpt" type="number" value={formData.sgpt} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="SGOT (AST)" name="sgot" type="number" value={formData.sgot} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Total Protein (TP)" name="tp" type="number" inputProps={{ step: "0.1" }} value={formData.tp} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="Albumin (ALB)" name="alb" type="number" inputProps={{ step: "0.1" }} value={formData.alb} onChange={handleChange} required />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField fullWidth label="A/G Ratio" name="a/g_ratio" type="number" inputProps={{ step: "0.01" }} value={formData['a/g_ratio']} onChange={handleChange} required />
                        </Grid>
                    </Grid>

                    {result && (
                        <Box className="mt-6 p-4 bg-indigo-50 border-2 border-indigo-200 rounded-xl text-center">
                            <Typography className="text-indigo-900 font-bold uppercase tracking-wider text-sm mb-1">
                                Predicted Risk Level
                            </Typography>
                            <Typography variant="h4" className={`font-black uppercase ${
                                result.toLowerCase() === 'high' ? 'text-rose-600' : 
                                result.toLowerCase() === 'medium' ? 'text-orange-500' : 'text-green-600'
                            }`}>
                                {result}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="p-4 bg-gray-50">
                    <Button onClick={handleClose} color="inherit" className="font-bold">Close</Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8"
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Re-Predict'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default LiverRiskPredictor;
