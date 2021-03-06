import axios from 'axios';
import { setAlert } from './alert';
import {
    GET_PROFILE,
    UPDATE_PROFILE,
    PROFILE_ERROR
} from './types';


//Get current users profile
export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profile/me'); 

        dispatch({ 
            type: GET_PROFILE,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        });
    }
}

//Create or update a profile
export const createProfile = (FormData, history, edit = false) => 
async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': "application/json"
            }
        }

        const res = await axios.post('/api/profile', FormData, config);
        dispatch({ 
            type: GET_PROFILE,
            payload: res.data
        });

        dispatch(setAlert( edit ? 'Profile Updated' : 'Profile Created', 'success'));
        
        //push to history object
        if(!edit){
            history.push('/dashboard');
        }
    } catch (err) {
        const errors  =err.response.data.errors;
        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }


        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        });
    }
}

//add experience
export const addExperience = (formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                'Content-Type': "application/json"
            }
        }

        const res = await axios.put('/api/profile/experience', FormData, config);
        dispatch({ 
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert( 'Experience Added',  'success'));
        
        //push to history object
    
            history.push('/dashboard');
        
    } catch (err) {
        const errors  =err.response.data.errors;
        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }


        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        });
    }
}


//add education
export const addEducation = (formData, history) => async (dispatch) => {
    try {
        const config = {
            headers: {
                'Content-Type': "application/json"
            }
        }

        const res = await axios.put('/api/profile/education', FormData, config);
        dispatch({ 
            type: UPDATE_PROFILE,
            payload: res.data
        });

        dispatch(setAlert( 'Education Added',  'success'));
        
        //push to history object
    
            history.push('/dashboard');
        
    } catch (err) {
        const errors  =err.response.data.errors;
        if(errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }


        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        });
    }
};