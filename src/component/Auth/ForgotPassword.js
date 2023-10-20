import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import config from '../../config';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [buttonText, setButtonText] = useState('Send');

  const handleChange = (event) => {
    setEmail(event.target.value);
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setButtonText('Sending');
    axios({
      method: 'POST',
      url: `${config.NEW_SERVER_URL}/admin/forgotPassword`,
      data: { email },
    })
      .then((response) => {
        toast.success(response.data.message);
        setButtonText('Sent');
        // Redirect logic here if needed
      })
      .catch((error) => {
        toast.error(error.response.data.error);
        setButtonText('Send');
      });
  };

  return (
    <div className="App">
      <div className="wrapper">
        <div className="authentication-forgot d-flex align-items-center justify-content-center">
          <div className="card forgot-box">
            <div className="card-body">
              <div className="p-3">
                <div className="text-center">
                  <img src="assets/images/icons/forgot-2.png" width="100" alt="" />
                </div>
                <h4 className="mt-5 font-weight-bold">Forgot Password?</h4>
                <p className="text-muted">Enter your registered email ID to reset the password</p>
                <div className="my-4">
                  <label className="form-label">Email id</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="example@user.com"
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-primary" onClick={clickSubmit}>
                    {buttonText}
                  </button>
                  <a href="/" className="btn btn-light"><i className='bx bx-arrow-back me-1'></i>Back to Login</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
