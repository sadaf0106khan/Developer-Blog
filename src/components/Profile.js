import React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Button } from 'reactstrap';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
const Profile =(props) => {
    const { history, match, auth, profile, post, dispatch } = props
    const handleEdit = async profile => {
        const response = await fetch(profile.imageUrl)
        const data = await response.blob()
        const image = new File([data], profile.imageUrl, {type: data.type})
        dispatch(actions.change('profileForm.username', profile.username))
        dispatch(actions.change('profileForm.bio', profile.bio))
        dispatch(actions.change('profileForm.image[0]', image))
        dispatch(actions.change('profileForm.imageUrl', URL.createObjectURL(image)))    
        history.push('/createprofile')
    }
    const id = match.params.id 
    let profileObj
    if(id){
        profileObj = profile.profiles.filter((e) => e._id === id)[0]
    } 
    else if(localStorage.getItem('profile')){
        profileObj = JSON.parse(localStorage.getItem('profile'))
        console.log(profileObj)
    }else{
        history.push('/createprofile')
    }
    const postObj = post.posts.filter((e) => e.creator === profileObj.creator)
    const postsList = postObj.length!==0? postObj.map(post => {
        return (
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
    return(
    <>
    {profileObj &&
    <div className="container mt-5">
        <div className="row">
            <div className="col-11 col-md-6 m-auto mb-5">  
                <div className="row align-items-center">
                    <div className="col-4 col-md-3">
                    <img className="img-fluid rounded-circle" src={profileObj.imageUrl} alt="profile-pic" />  
                    </div>
                    <div className="col-6 col-md-5">
                        <h3 className="mr-3">{profileObj.username}</h3>
                        <p>{profileObj.bio}</p>
                    </div> 
                    <div className="col-4 offset-7 offset-md-0">
                        {auth.user && profileObj.creator === auth.user._id&&
                        <Button outline color="primary"
                        onClick={() => handleEdit(profileObj)}>Edit</Button>}
                    </div>
                </div>     
            </div> 
        </div> 
        <div className="row">
            <div className="col-10 col-md-7 m-auto mt-5">
                <h3>{profileObj.username + "'s posts"}</h3>
                <hr />
                <div className="row">
                {postsList}
                </div>
            </div>   
        </div>
    </div>}
    </>
    );
};
const mapStateToProps = (state) => ({...state})
export default withRouter(connect(mapStateToProps)(Profile));