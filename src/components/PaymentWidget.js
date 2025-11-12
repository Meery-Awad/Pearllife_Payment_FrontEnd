import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PaymentWidget.scss';
import logo from '../components/img/plfsllc.png'

export default function PaymentWidget() {
  const [checkoutId, setCheckoutId] = useState(null);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [canPay, setCanPay] = useState(false);
  const [errors, setErrors] = useState({ email: '', phone: '', name: '' });


  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await axios.post('https://pearllifebackend.onrender.com/create-checkout', {
          amount: '7217.73',
          currency: 'AED',
          paymentType: 'DB'
        });
        if (data.id) setCheckoutId(data.id);
      } catch (err) {
        console.error('Error creating checkout:', err);
      }
    };
    init();
    
  }, []);


  useEffect(() => {
    if (!checkoutId || !canPay) return;

    const existing = document.getElementById('opp-widget');
    if (existing?.parentNode) existing.parentNode.removeChild(existing);

    const s = document.createElement('script');
    s.id = 'opp-widget';
    s.src = `https://eu-prod.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
    s.async = true;
    document.body.appendChild(s);

    return () => {
      const existingCleanup = document.getElementById('opp-widget');
      if (existingCleanup?.parentNode) existingCleanup.parentNode.removeChild(existingCleanup);
    };
  }, [checkoutId, canPay]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^\+\d{8,15}$/; // + ثم 8 إلى 15 رقم
    return regex.test(phone);
  };

  const handleProceed = () => {
    let valid = true;
    let newErrors = { email: '', phone: '', name: '' };

    if (!validateEmail(userData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }

    if (!validatePhone(userData.phone)) {
      newErrors.phone = 'Please enter a valid phone number with country code';
      valid = false;
    }
    if (!userData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setCanPay(true);
    } else {
      setCanPay(false);

    }
  };

  return (
    <>
      <img src={logo} />
      <div className="payment-widget">

        {!checkoutId && <p>Preparing checkout…</p>}

        {checkoutId && (
          <div className="payment-card">
            <h2 className="amount-title">
              <div> Payment due:&nbsp;<span>£ 1495 </span></div>
            </h2>
            <i>Every detail handled securely, every family treated with dignity. -The Pearl Promise.</i><br />

            <div className="user-form">
              <div className="form-group">
                <label htmlFor="name">Name <span className="req">*</span></label>
                <input
                  id="name"
                  type="text"
                  value={userData.name}
                  onChange={(e) => { setUserData({ ...userData, name: e.target.value }); setErrors({ ...errors, name: '' }); }}

                  placeholder="Full Name"
                />
                {errors.name && <div className="error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email <span className="req">*</span></label>
                <input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => { setUserData({ ...userData, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
                  placeholder='example@gmail.com'
                />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone <span className="req">*</span></label>
                <input
                  id="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={(e) => { setUserData({ ...userData, phone: e.target.value }); setErrors({ ...errors, phone: '' }) }}
                  placeholder='+971xxxxxxxxx'
                />
                {errors.phone && <div className="error">{errors.phone}</div>}
              </div>
            </div>

            {!canPay && (
              <button type="button" className="proceed-btn" onClick={handleProceed}>
                Proceed to Payment
              </button>
            )}

            {canPay && (
              <form
                action={`https://pearllife.netlify.app/result?name=${encodeURIComponent(userData.name)}&email=${encodeURIComponent(userData.email)}&phone=${encodeURIComponent(userData.phone)}&amount=1495`}
                className="paymentWidgets"
                data-brands="VISA MASTER"
              ></form>
            )}
          </div>

        )}
      </div>
    </>
  );
}
