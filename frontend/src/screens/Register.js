import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../port';
import axios from 'axios';

function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  async function handleFormSubmit(userobj) {
    const res = await axios.post(`${BASE_URL}/user-api/register`, userobj);
    if (res.data.message === 'User Registered') {
      navigate('/login');
    } else {
      setErr(res.data.message);
    }
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Register</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className="form-group mb-3">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  placeholder="Enter username"
                  {...register("username", { required: true })}
                />
                {errors.username && <span className="text-danger">Username is required</span>}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter password"
                  {...register("password", { required: true })}
                />
                {errors.password && <span className="text-danger">Password is required</span>}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter email"
                  {...register("email", { required: true })}
                />
                {errors.email && <span className="text-danger">Email is required</span>}
              </div>
              <div className="form-group mb-3">
                <label htmlFor="mobileNo">Mobile No</label>
                <input
                  type="tel"
                  id="mobileNo"
                  className="form-control"
                  placeholder="Enter mobile number"
                  {...register("mobileNo", { required: true })}
                />
                {errors.mobileNo && <span className="text-danger">Mobile number is required</span>}
              </div>
              {err && <p className="text-danger text-center">{err}</p>}
              <button type="submit" className="btn btn-success w-100">Register</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
