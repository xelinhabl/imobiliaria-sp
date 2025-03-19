import React, { useState, useEffect } from 'react';

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

    if (!isVisible) return null;

    return (
        <div style={{ position: 'fixed', bottom: 0, width: '100%', background: '#f8f9fa', padding: '10px', boxShadow: '0 -2px 5px rgba(0,0,0,0.1)' }}>
            <p style={{ margin: 0 }}>Este site utiliza cookies para melhorar sua experiência. Você aceita?</p>
            <button onClick={handleAccept} style={{ margin: '5px', padding: '5px 10px' }}>Aceitar</button>
            <button onClick={handleDecline} style={{ margin: '5px', padding: '5px 10px' }}>Recusar</button>
        </div>
    );
};

export default CookiesConsent;
