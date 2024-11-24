import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userLoginThunk } from '../Redux/slices/userLoginSLice';
import { admin_uname } from '../port';
import { NavLink } from 'react-router-dom';

function Login() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm(); // Added reset to clear form after submission
  const dispatch = useDispatch();
  const { currentuser, errorMessage, loginStatus } = useSelector(state => state.userLogin);
  const navigate = useNavigate();

  function handleFormSubmit(usercred) {
    let actionobj = userLoginThunk(usercred);
    dispatch(actionobj);
  }

  useEffect(() => {
    if (loginStatus === true) {
      if (currentuser.username === admin_uname) {
        navigate('/admin-profile');
      } else {
        navigate(`/user-profile/${currentuser.username}`);
      }
      reset(); // Reset form after successful login
    }
  }, [loginStatus, currentuser.username, navigate, reset]);

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
          <div className="card shadow-sm p-4">
            <h2 className="text-center mb-4">Login</h2>
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
                {errors.username && errors.username.type === "required" && <span className="text-danger">Username is required</span>}
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
                {errors.password && errors.password.type === "required" && <span className="text-danger">Password is required</span>}
              </div>
              {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
              <button type="submit" className="btn btn-success w-100">Login</button>
              <p>Dont have an account? <NavLink to='/register'>Register here</NavLink></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
