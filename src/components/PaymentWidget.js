import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PaymentWidget.scss';
import logo from '../components/img/plfsllc.png'

export default function PaymentWidget() {
  const [checkoutId, setCheckoutId] = useState(null);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [canPay, setCanPay] = useState(false);
  const [errors, setErrors] = useState({ email: '', phone: '', name: '', amount: '' });
  const [selectedAmounts, setSelectedAmounts] = useState([]);
  const [extraAmount, setExtraAmount] = useState('');
  const [showExtraInput, setShowExtraInput] = useState(false);

  const firstOption = 1495;
  const SecondOption = 2242.5;
  const fromGBPtoAED = 4.79;

  const firstOptionValue = selectedAmounts.includes(firstOption.toString()) ? firstOption : 0;
  const secondOptionValue = selectedAmounts.includes(SecondOption.toString()) ? SecondOption : 0;
  const extraValue = showExtraInput ? Number(extraAmount || 0) : 0;
  const totalAmount = selectedAmounts.reduce((sum, a) => sum + Number(a), 0) + Number(extraAmount || 0);

  useEffect(() => {
    const init = async () => {
      try {
        const { data } = await axios.post('http://localhost:5000/create-checkout', {
          amount: totalAmount * fromGBPtoAED,
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

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+\d{8,15}$/.test(phone);

  const handleAmountChange = (value, checked) => {
    if (checked) {
      setSelectedAmounts([...selectedAmounts, value]);
    } else {
      setSelectedAmounts(selectedAmounts.filter(a => a !== value));
    }
  };

  const handleProceed = () => {
    let valid = true;
    let newErrors = { email: '', phone: '', name: '', amount: '' };

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
    if (selectedAmounts.length === 0) {
      newErrors.amount = 'Please select at least one amount option';
      valid = false;
    }

    setErrors(newErrors);
    if (valid) setCanPay(true);
    else setCanPay(false);
  };



  return (
    <>
      <img src={logo} />
      <div className="payment-widget">

        {!checkoutId && <p>Preparing checkout…</p>}

        {checkoutId && (
          <div className="payment-card">

            <i>Every detail handled securely, every family treated with dignity. -The Pearl Promise.</i><br />

            <div className="user-form">
              {/* Name input */}
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

              {/* Email input */}
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

              {/* Phone input */}
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

              {/* Payment options */}
              <label>Payment Packages <span className="req">*</span></label>
              <div className="payment-options">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    value={firstOption}
                    onChange={(e) => handleAmountChange(e.target.value, e.target.checked)}
                  />
                  <span>£ {firstOption} <span className='payment-option'>(1 Person Cremation)</span></span>
                </label>

                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    value={SecondOption}
                    onChange={(e) => handleAmountChange(e.target.value, e.target.checked)}
                  />
                  <span>£ {SecondOption} <span className='payment-option'>(2 Person Cremation)</span></span>
                </label>

                {/* Extra amount as checkbox */}
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setShowExtraInput(checked);
                      if (!checked) {
                        setExtraAmount(''); // Reset extra amount if unchecked
                      }
                    }}
                  />
                  <span>Extra Amount <span className='payment-option'>(Additional Features)</span></span>
                </label>

                {showExtraInput && (
                  <input
                    type="number"
                    name="extra"
                    placeholder="Enter extra amount"
                    value={extraAmount}
                    onChange={(e) => setExtraAmount(e.target.value)}
                  />
                )}

                {errors.amount && <div className="error">{errors.amount}</div>}
              </div>

              {/* Display total dynamically */}
              <div className="payment-due">
                Payment due: £ {totalAmount}
              </div>

              {/* Proceed to payment */}
              {canPay === false && (
                <button type="button" className="proceed-btn" onClick={handleProceed}>
                  Proceed to Payment
                </button>
              )}
            </div>

            {/* Payment form */}
            {canPay && (
              <form
                action={`http://localhost:3000/result?name=${encodeURIComponent(userData.name)}&email=${encodeURIComponent(userData.email)}&phone=${encodeURIComponent(userData.phone)}&amount=${totalAmount}&firstOption=${firstOptionValue}&secondOption=${secondOptionValue}&extra=${extraValue}`}
                className="paymentWidgets"
                data-brands="VISA MASTER"
              >
              </form>
            )}
          </div>
        )}
      </div>
    </>
  );
}
