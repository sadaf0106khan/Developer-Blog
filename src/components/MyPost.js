import React from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const MyPost =({auth, post}) =>{
    const postObj = post.posts.filter((e) => e.creator === auth.user._id)
    const postsList = postObj.length!==0? postObj.map(post => {
        return (
        <div className="col-10 col-md-4 m-auto" key={post._id}>
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
        <div className="container">
            <div className="d-flex justify-content-center">
                <h3 className="my-3 text-capitalize">My Posts</h3>
            </div>
            <div className="row">
                {postsList}
            </div>
        </div>
    );
};
const mapStateToProps = (state) => ({...state})
export default connect(mapStateToProps)(MyPost)