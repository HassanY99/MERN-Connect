import axios from 'axios';
import { setAlert } from './alert';
import { GET_POSTS, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, GET_POST, ADD_COMMENT, REMOVE_COMMENT } from './types';

// Get Posts
export const getPosts = () => async dispatch => {

    try {

    const res = await axios.get('/api/posts');

    dispatch({
        type: GET_POSTS,
        payload: res.data
    });   

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
        
    }
}

// Get Post by ID
export const getPostById = id => async dispatch => {

    try {

    const res = await axios.get(`/api/posts/${id}`);

    dispatch({
        type: GET_POST,
        payload: res.data
    });   

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
        
    }
}

// Add Comment
export const addComment = (postId, formData) => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {

    const res = await axios.post(`/api/posts/comment/${postId}`, formData, config);

    dispatch({
        type: ADD_COMMENT,
        payload: res.data
    });   

    dispatch(setAlert('Comment Posted', 'success'));

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
        
    }
}


// Add Comment
export const deleteComment = (postId, commentId) => async dispatch => {

    try {

     await axios.delete(`/api/posts/delete/comment/${postId}/${commentId}`);

    dispatch({
        type: REMOVE_COMMENT,
        payload: commentId
    });   

    dispatch(setAlert('Comment Deleted', 'danger'));

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
        
    }
}


// Add Like
export const addLike = id => async dispatch => {

    try {

    const res = await axios.put(`/api/posts/likes/${id}`);

    dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data}
    });   

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
        
    }
}

// Add Unlike
export const removeLike = id => async dispatch => {

    try {

    const res = await axios.put(`/api/posts/unlike/${id}`);

    dispatch({
        type: UPDATE_LIKES,
        payload: { id, likes: res.data}
    });   

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
        
    }
}

// Delete Post
export const deletePost = id => async dispatch => {

    try {

    await axios.delete(`/api/posts/${id}`);

    dispatch({
        type: DELETE_POST,
        payload: id
    });   

    dispatch(setAlert('Post Removed', 'success'));

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
        
    }
}


// Create a Post
export const addPost = formData => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {

    const res = await axios.post('/api/posts', formData, config);

    dispatch({
        type: ADD_POST,
        payload: res.data
    });   

    dispatch(setAlert('Post Created', 'success'));

    } catch (err) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
        
    }
}