import React from 'react';
import './App.css';
import CreatePost from './components/CreatePost';
import MyPost from './components/MyPost';
import Profile from './components/Profile';
import Home from './components/Home';
import Header from './components/Header';
import {Switch,Route,Redirect} from 'react-router-dom';
import Conformation from './components/Conformation';
import { connect } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateProfile from './components/CreateProfile';
import { fetchPost, fetchProfile } from './redux/ActionCreators';
import { useEffect } from 'react';
import Post from './components/Post';
  

const App =({ auth, dispatch })  =>{
  useEffect(() => {
    dispatch(fetchPost())
    dispatch(fetchProfile())
  },[])
  return (
    <>
      <Header/>
      <Switch>
        <Route exact path="/" component ={Home}/>
        <Route exact path="/confirm/:token" component={Conformation} />
        <Route exact path="/profile/:id" component ={Profile}/>
        <Route exact path="/post/:id" component ={Post}/>
        {auth.isAuthenticated? <Route exact path="/profile" component ={Profile}/>:<Redirect to='/'/>}
        {auth.isAuthenticated? <Route exact path="/mypost" component ={MyPost}/>:<Redirect to='/'/>}
        {auth.isAuthenticated? <Route exact path="/createpost" component ={CreatePost}/>:<Redirect to='/'/>}
        {auth.isAuthenticated? <Route exact path="/createpost/:id" component ={CreatePost}/>:<Redirect to='/'/>}
        {auth.isAuthenticated? <Route exact path="/createprofile" component ={CreateProfile}/>:<Redirect to='/'/>}
        <Redirect to='/'/>
      </Switch>
      <ToastContainer />      
    </>
  );
};
const mapStateToProps = (state) => ({...state})
export default connect(mapStateToProps)(App);
