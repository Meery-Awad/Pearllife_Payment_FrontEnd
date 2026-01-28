import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useBetween } from "use-between";
import './ResultPage.scss';
import axios from 'axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResultPage() {
  const state = useSelector((state) => state.data);
  const { serverUrl } = useBetween(state.useShareState);
  const q = useQuery();
  const resourcePath = q.get('resourcePath');

  const name = q.get('name') || '';
  const email = q.get('email') || '';
  const phone = q.get('phone') || '';

  const amount = q.get('amount') || '';
  const firstOptionValue = q.get('firstOption') || 0;
  const secondOptionValue = q.get('secondOption') || 0;
  const extraValue = q.get('extra') || 0;
  const currency = 'AED'; const paymentType = 'DB'

  const [status, setStatus] = useState(null);

  useEffect(() => {
     if (!resourcePath) return;
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${serverUrl}/payment-status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resourcePath }),
        });

        const data = await res.json();
        setStatus(data);

        const isSuccess =
          data.result?.code?.startsWith('000.') || data.success === true;
        console.log('isSucess', isSuccess)

        if (isSuccess) {

          const usersData =
          {
            name, email, phone, amount, firstOptionValue, secondOptionValue, extraValue,
            currency, paymentType
          };
          console.log('Sending email notification with user:', usersData);
          console.log(serverUrl)

          const res = await axios.post(`${serverUrl}/payment-notification`, usersData);

          console.log("RESPONSE STATUS:", res.status);
          console.log("RESPONSE BODY:", res.data);
        } else {

          console.log('Payment failed — email NOT sent');
        }

      } catch (error) {
        setStatus({ error: true, message: error.message });
        console.error('Failed to fetch status:', error);
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
        <p>Your invoice has been sent to your email.</p>
        <p>Your policy documentation and welcome pack will be sent to your registered address.</p>
        <p>Thank you, <strong>{name}</strong>, for choosing <strong>Pearl Cremation</strong>. Should you have any questions or need further assistance regarding your plan, our UK-based team is available 24/7 via phone or WhatsApp on 0800 046 5660</p>
        <p>Amount Paid: <strong> £ {amount}</strong></p>
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
