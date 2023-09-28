import React, { useState } from 'react';
import '../../style/app.css';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';import axios from 'axios';
import { useHistory } from 'react-router-dom';
import config from '../../config'; // Import or define 'config' here
import { Link } from 'react-router-dom';

function SignIn() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    buttonText: 'Sign In',
  });

  const { email, password, buttonText } = values;
  const history = useHistory(); // Initialize 'history' here

  if (localStorage.getItem('admin')) {
    history.push('/news');
  }

  const handleChange = (inputValue) => (event) => {
    setValues({ ...values, [inputValue]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
  
    // Check if email or password is empty
    if (!email || !password) {
      toast.error('Email and password are required.');
      return;
    }
  
    setValues({ ...values, buttonText: 'Submitting..' });
    axios({
      method: 'POST',
      url: `${config.SERVER_URL}/admin/signin`,
      data: { email, password },
    })
      .then((response) => {
        setValues({
          ...values,
          email: '',
          password: '',
          buttonText: 'Submitted',
        });
        toast.success(response.data.message);
        localStorage.setItem('admin', response.data.token);
        history.push('/news'); // Updated route to '/news'
      })
      .catch((error) => {
        setValues({ ...values, buttonText: 'Sign In' });
        // Check for specific error messages from the server
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('An error occurred. Please try again later.');
        }
      });
  };
  

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="App">
      <div class="wrapper">
        <div class="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
          <div class="container">
            <div class="row row-cols-1 row-cols-lg-2 row-cols-xl-3">
              <div class="col mx-auto">
                <div class="card mb-0">
                  <div class="card-body">
                    <div class="p-4">
                      <div class="text-center mb-4">
                        <h5 class="">Sign In </h5>
                        <p class="mb-0">Please log in to your account</p>
                      </div>
                      <div class="form-body">
                        <form class="row g-3">
                          <div class="col-12">
                            <label for="inputEmailAddress" class="form-label">Email</label>
                            <input
                              type="email"
                              class="form-control"
                              id="inputEmailAddress"
                              placeholder="jhon@example.com"
                              onChange={handleChange('email')}
                              value={email}
                            />
                          </div>
                          <div class="col-12">
                            <label for="inputChoosePassword" class="form-label">Password</label>
                            <div class="input-group" id="show_hide_password">
                              <input
                                type={passwordVisible ? 'text' : 'password'}
                                class="form-control border-end-0"
                                id="inputChoosePassword"
                                value={password}
                                placeholder="Enter Password"
                                onChange={handleChange('password')}
                              />
                              <IconButton
                                onClick={togglePasswordVisibility}
                                class="input-group-text bg-transparent"
                              >
                                {passwordVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                              </IconButton>
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-check form-switch">
                              <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" />
                              <label class="form-check-label" for="flexSwitchCheckChecked">Remember Me</label>
                            </div>
                          </div>
                          <div className="col-md-6 text-end">
                            <Link to="/forgotpass">Forgot Password ?</Link>
                          </div>
                          <div class="col-12">
                            <div class="d-grid">
                              <button type="submit" className="btn btn-primary" onClick={clickSubmit}>
                                {buttonText}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
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

export default SignIn;
