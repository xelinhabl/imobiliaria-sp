import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, Slide, Typography } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CookiesConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookiesConsent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookiesConsent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookiesConsent', 'declined');
        setIsVisible(false);
    };

    return (
        <Dialog
            open={isVisible}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
            sx={{
                '& .MuiDialog-paper': {
                    minWidth: '400px',
                    maxWidth: '600px',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                }
            }}
        >
            <DialogContent>
                <Typography variant="h6" gutterBottom>
                    Uso de Cookies
                </Typography>
                <DialogContentText id="alert-dialog-slide-description">
                    Este site utiliza cookies para garantir que você obtenha a melhor experiência. Ao continuar a navegar no site, você concorda com o uso de cookies.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDecline} color="primary" variant="outlined">
                    Recusar
                </Button>
                <Button onClick={handleAccept} color="primary" variant="contained">
                    Aceitar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CookiesConsent;