import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../Alert';
import { DashboardActions } from './DashboardActions';
import Experience from './Experience';
import Educations from './Educations';

const Dashboard = ({ getCurrentProfile, auth: { user }, profile: { loading, profile} }) => {

     useEffect(() => {
      getCurrentProfile();
    }, [getCurrentProfile]);
    

  return loading && profile === null ? <i class="fa-solid fa-spinner"></i> : <div className='flex flex-col justify-center my-20  '>
    <h1>Dasboard</h1>
    <Alert />
    <p>Welcome { user.name}</p>
    {profile !== null ? <div><DashboardActions /> 
                              <Experience experience={profile.experience} />
                              <Educations education={profile.education} /> </div> : <div>
        <p>You do not have a profile, please create your profile.</p>
        <Link to='/create-profile' className='btn btn-primary'> Create Profile </Link> </div>}
  </div>
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile})(Dashboard)