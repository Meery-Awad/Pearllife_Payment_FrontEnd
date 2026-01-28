import { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentWidget.scss';
import logo from '../components/img/plfsllc.png';
// import { useNavigate } from 'react-router-dom';

export default function PaymentWidget() {
  const [checkoutId, setCheckoutId] = useState(null);
  const [userData, setUserData] = useState({ name: '', email: '', phone: '' });
  const [canPay, setCanPay] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', phone: '', amount: '' });
  const [selectedAmounts, setSelectedAmounts] = useState([]);
  const [extraAmount, setExtraAmount] = useState('');
  const [showExtraInput, setShowExtraInput] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);


  const firstOption = 1495;
  const secondOption = 2242.5;
  const fromGBPtoAED = 4.81;

  const firstOptionValue = selectedAmounts.includes(firstOption.toString()) ? firstOption : 0;
  const secondOptionValue = selectedAmounts.includes(secondOption.toString()) ? secondOption : 0;
  const extraValue = showExtraInput ? Number(extraAmount || 0) : 0;
  const totalAmount = selectedAmounts.reduce((sum, a) => sum + Number(a), 0) + Number(extraAmount || 0);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\+\d{8,15}$/.test(phone);

  const handleAmountChange = (value, checked) => {
    if (checked) setSelectedAmounts([...selectedAmounts, value]);
    else setSelectedAmounts(selectedAmounts.filter(a => a !== value));
  };
// const navigate = useNavigate();

  const handleProceed = async () => {
    let valid = true;
    const newErrors = { name: '', email: '', phone: '', amount: '' };
  //   navigate(
  //   `/result?name=${encodeURIComponent(userData.name)}
  //   &email=${encodeURIComponent(userData.email)}
  //   &phone=${encodeURIComponent(userData.phone)}
  //   &amount=${totalAmount}
  //   &firstOption=${firstOptionValue}
  //   &secondOption=${secondOptionValue}
  //   &extra=${extraValue}`
  // );

    if (!userData.name) {
      newErrors.name = 'Name is required';
      valid = false;
    }
    if (!validateEmail(userData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }
    if (!validatePhone(userData.phone)) {
      newErrors.phone = 'Please enter a valid phone number with country code';
      valid = false;
    }
    if (selectedAmounts.length === 0) {
      newErrors.amount = 'Please select at least one amount option';
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    try {
      setLoadingPayment(true)
      const convertedAmount = (totalAmount * fromGBPtoAED).toFixed(2);

      const { data } = await axios.post('https://pearllifebackend.onrender.com/create-checkout', {
        amount: convertedAmount,
        currency: 'AED',
        paymentType: 'DB'
      });

      if (data.id) {
        setCheckoutId(data.id);
        setCanPay(true);
      }
    } catch (err) {
      console.error('Error creating checkout:', err);
    }
    finally {
      setLoadingPayment(false)
    }
  };


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

  return (
    <>
      <img src={logo} alt="Pearl Life Logo" />
      <div className="payment-widget">
        <div className="payment-card">
          <i className='intro'>Every detail handled securely, every family treated with dignity. -The Pearl Promise.</i>

          <div className="user-form">
            {/* Name */}
            <div className="form-group">
              <label>Name <span className="req">*</span></label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => { setUserData({ ...userData, name: e.target.value }); setErrors({ ...errors, name: '' }) }}
                placeholder="Full Name"
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email <span className="req">*</span></label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => { setUserData({ ...userData, email: e.target.value }); setErrors({ ...errors, email: '' }) }}
                placeholder="example@gmail.com"
              />
              {errors.email && <div className="error">{errors.email}</div>}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Phone <span className="req">*</span></label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => { setUserData({ ...userData, phone: e.target.value }); setErrors({ ...errors, phone: '' }) }}
                placeholder="+44XXXXXXXXXX"
              />
              {errors.phone && <div className="error">{errors.phone}</div>}
            </div>

            {/* Payment Options */}
            <label>Payment Packages <span className="req">*</span></label>
            <div className="payment-options">
              <label className="checkbox-item">
                <input type="checkbox" value={firstOption} onChange={(e) => handleAmountChange(e.target.value, e.target.checked)} />
                <span>£ {firstOption} (1 Person Cremation)</span>
              </label>
              <label className="checkbox-item">
                <input type="checkbox" value={secondOption} onChange={(e) => handleAmountChange(e.target.value, e.target.checked)} />
                <span>£ {secondOption} (2 Person Cremation)</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  value={extraAmount}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    handleAmountChange(e.target.value, checked);
                    setShowExtraInput(checked);
                    if (!checked) setExtraAmount('');
                  }}
                />
                <span>Extra Amount (Additional Features)</span>
              </label>
              {showExtraInput && (
                <input type="number" placeholder="Enter extra amount" value={extraAmount} onChange={(e) => setExtraAmount(e.target.value)} />
              )}
              {errors.amount && <div className="error">{errors.amount}</div>}
            </div>

            {/* Total Amount */}
            <div className="payment-due">
              Payment due: £ {totalAmount}
            </div>

            {/* Proceed Button */}
            {loadingPayment && (
              <div className="payment-loading">
                🔒 Preparing secure payment, please wait...
              </div>
            )}

            {!canPay && (
              <button type="button" className="proceed-btn" onClick={handleProceed}>
                Proceed to Payment
              </button>
            )}

            {/* Payment Form */}
            {canPay && checkoutId && (
              <form
                action={`https://pearllife.netlify.app/result?name=${encodeURIComponent(userData.name)}&email=${encodeURIComponent(userData.email)}&phone=${encodeURIComponent(userData.phone)}&amount=${totalAmount}&firstOption=${firstOptionValue}&secondOption=${secondOptionValue}&extra=${extraValue}`}
                method="GET"
                className="paymentWidgets"
                data-brands="VISA MASTER"
                data-checkout-id={checkoutId}
              >
                <button type="submit" className="opp-btn">Pay Now</button>
              </form>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
