import React, { useEffect } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Media } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Home=({post, profile}) =>{
  useEffect(()=>{
    console.log(post)
    console.log(profile)
  },[post,profile])
  const postsList = post.posts? post.posts.map(post => {return (
    <div className="col-12 col-md-6" key={post._id}>
    <Card className="box-shadow" style={{ padding: 0, borderRadius:15}}>
      <CardImg src={post.imageUrl} style={{height: 225,borderTopRightRadius: 15, borderTopLeftRadius:15}} />
      <CardBody className="p-5" style={{height:180}}>
        <CardTitle tag="h5">
          {post.title}
        </CardTitle>
        <CardText>
          {post.content.substr(0,35) + ' ... '}
          <Link to={"/post/" + post._id}>Read more</Link>
        </CardText>
      </CardBody>
    </Card>      
    </div>
   )}):<></>
   const profilesList = profile.profiles?profile.profiles.map(profile => {return (
    <div className="col-12" key={profile._id}>
      <Card className="box-shadow">
    <Media className="d-flex">
      <Media className="mr-3 pt-2">
        <Media object src={profile.imageUrl} className="img-fluid rounded-circle" style={{ width: 50, height: 50}} />
      </Media>
      <Media body>
        <Media heading>
          {profile.username}
        </Media>
          {profile.bio.substr(0,35) + ' ... '}
          <Link to={"/profile/"+profile._id} >Read more</Link>
      </Media>
    </Media>
    </Card>      
    </div>
   )}):<></>
 return(
<div className="container">
  <div className="row my-5 align-items-center">
    <div className="col-4 col-md-2 offset-1">
      <h2>Tell Your Story to the World</h2>
      <h5>Join with us. Login and Register. Tell your story to world</h5>
    </div>
    <div className="col-5 col-md-7 offset-2">
      <img className="img img-fluid" src="images/undraw_blog.png" alt="blog_image" />
    </div>
    <div className="col-12">
      <hr />
    </div>
  </div>
  <div className="row">
    <div className="col-11 col-md-8 m-auto">
      <div className="row">
      {postsList}
      </div>
    </div>
    <div className="col-11 col-md-4 m-auto">
      <div className="row">
        <div className="col-12">
          <h2>Popular Writers</h2>
          <hr />
        </div>
        {profilesList}
      </div>
    </div>
  </div>
</div>
 );
};
const mapStateToProps = (state) => ({...state})
export default connect(mapStateToProps)(Home);