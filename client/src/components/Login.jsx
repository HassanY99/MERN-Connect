import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../actions/auth';
import PropTypes from 'prop-types';
import Alert from './Alert';

const Login = ({ loginUser, isAuthenticated }) => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();

        loginUser(email, password);
    }

    // if user authenticated redirect
    if(isAuthenticated) {
        return <Navigate to='/dashboard' />
    }

  return (
    <div>

<div className="bg-grey-lighter min-h-screen flex flex-col background">
            <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
                <form className="bg-white px-6 py-8 rounded shadow-md text-black w-full"
                onSubmit={e => onSubmit(e)}>
                    <h1 className="mb-8 text-3xl text-center">Sign in</h1>
                    <Alert />
                    <input 
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        placeholder="Email"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                        required />

                    <input 
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => onChange(e)}
                        minLength={6}
                        required />

                    <button
                        type="submit"
                        className="w-full text-center py-3 rounded bg-turq text-white hover:bg-green-dark focus:outline-none my-1"
                    >Sign in</button>

                    <div className="text-center text-sm text-grey-dark mt-4">
                    Don't have an account? 
                    <Link className="no-underline border-b border-blue text-blue ml-1" to="/register">
                        Sign up
                    </Link>.
                </div>
                </form>

                
            </div>
        </div>

    </div>
  )
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
}


const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {loginUser})(Login);