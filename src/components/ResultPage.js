import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ResultPage.scss';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResultPage() {
  const q = useQuery();
  const resourcePath = q.get('resourcePath');

  const name = q.get('name') || '';
  const email = q.get('email') || '';
  const phone = q.get('phone') || '';
 
  const amount = q.get('amount') || '';
  
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!resourcePath) return;
    const fetchStatus = async () => {
      try {
        const res = await fetch('https://pearllifebackend.onrender.com/payment-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resourcePath }),
        });
        const data = await res.json();
        setStatus(data);

        const user = { name, email, phone, amount };

        await fetch('https://pearllifebackend.onrender.com/payment-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user}),
        });
       console.log('Payment email sent');
      } catch (error) {
        setStatus({ error: true, message: error.message });
        console.error('Failed to fetch status or send email:', error);
      }
    };

    fetchStatus();
  }, [resourcePath, name, email, phone, amount]);

  if (!resourcePath)
    return <div className="no-path">No resourcePath received.</div>;

  let content;
  if (!status) {
    content = <div className="loading fade-in">Checking payment status...</div>;
  } else if (status.result?.code?.startsWith('000.') || status.success === true) {
    content = (
      <div className="fade-in success">
        <div className="icon">✅</div>
        <h2>Payment completed successfully</h2>
        <p>Thank you, <strong>{name}</strong>, for choosing <strong>PEARLLIFE</strong>.</p>
        <p>Amount Paid: <strong> 1495 £</strong></p>
        <a href="https://www.pearllifefuneralservices.com/" className="custom-btn success-btn">
          Return to Homepage
        </a>
      </div>
    ); 
  } else {
    const errorReason = status.result?.description || status.message || 'Unknown error';
    content = (
      <div className="fade-in failed">
        <div className="icon">❌</div>
        <h2>Payment failed</h2>
        <p>Reason: {errorReason}</p>
        <a href="https://www.pearllifefuneralservices.com/" className="custom-btn failed-btn">
          Return to Homepage
        </a>
      </div>
    );
  }

  return (
    <div className="result-page">
      <div className="card">{content}</div>
    </div>
  );
}
