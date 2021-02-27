import React from 'react'
import { Button, Row, Label, CardTitle, CardText, Card } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { actions, Control, LocalForm } from 'react-redux-form'
import { saveComment, likePost } from '../redux/ActionCreators'

const Post = (props) => {
    const { history, match, auth, post, profile, dispatch } = props
    const options = {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    }
    const handleEdit = async (post) => {
        const response = await fetch(post.imageUrl)
        const data = await response.blob()
        const image = new File([data], post.imageUrl, { type: data.type })
        dispatch(actions.change('postForm.title', post.title))
        dispatch(actions.change('postForm.content', post.content))
        dispatch(actions.change('postForm.image[0]', image))
        dispatch(
            actions.change('postForm.imageUrl', URL.createObjectURL(image))
        )
        history.push('/createpost/' + post._id)
    }
    const handleSubmit = (values) => {
        let formData = new FormData()
        formData.append('comment', values.comment)
        formData.append(
            'author',
            JSON.parse(localStorage.getItem('profile'))._id
        )
        dispatch(saveComment(formData, postObj[0]._id))
    }
    const id = match.params.id
    let profileObj = []
    const postObj = post.posts.filter((e) => e._id === id)
    if (postObj.length !== 0)
        profileObj = profile.profiles.filter(
            (e) => e.creator === postObj[0].creator
        )
    return (
        <>
            {postObj.length !== 0 && profileObj.length !== 0 && (
                <div className="container">
                    <div className="row">
                        <div className="col-10 col-md-7 m-auto">
                            <h3 className="my-3 text-capitalize">
                                {postObj[0].title}
                            </h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-10 col-md-7 m-auto">
                            <div className="row align-items-center">
                                <div className="col-3 col-md-2">
                                    <img
                                        src={profileObj[0].imageUrl}
                                        className="img-fluid rounded-circle"
                                        alt="profile-pic"
                                    />
                                </div>
                                <div className="col">
                                    <h5>{profileObj[0].username}</h5>
                                    Posted on:
                                    {new Intl.DateTimeFormat(
                                        'en-us',
                                        options
                                    ).format(
                                        new Date(
                                            Date.parse(postObj[0].createdAt)
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="d-flex justify-content-end  mb-3">
                                {auth.user &&
                                    profileObj[0].creator === auth.user._id && (
                                        <Button
                                            outline
                                            color="primary"
                                            onClick={() =>
                                                handleEdit(postObj[0])
                                            }
                                        >
                                            Edit Post
                                        </Button>
                                    )}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-9 col-md-7 m-auto">
                            <img
                                className="d-flex mb-5"
                                src={postObj[0].imageUrl}
                                alt="post_image"
                                style={{ height: 300 }}
                            />
                            {auth.user ? (
                                <>
                                    <Button
                                        close
                                        onClick={() =>
                                            dispatch(likePost(postObj[0]._id))
                                        }
                                    >
                                        {postObj[0].likes.filter(
                                            (e) => e.author === auth.user._id
                                        ).length ? (
                                            <span
                                                className="fa fa-heart"
                                                style={{ color: 'red' }}
                                            ></span>
                                        ) : (
                                            <span
                                                className="fa fa-heart-o"
                                                style={{ color: 'red' }}
                                            ></span>
                                        )}
                                    </Button>
                                    <p>{postObj[0].content}</p>
                                    <LocalForm
                                        onSubmit={handleSubmit}
                                        className="mb-5"
                                    >
                                        <Row className="form-group my-3">
                                            <Label htmlFor="comment" tag="h5">
                                                Leave your comment here
                                            </Label>
                                            <Control.textarea
                                                rows="2"
                                                model=".comment"
                                                id="comment"
                                                name="comment"
                                                className="form-control"
                                            />
                                        </Row>
                                        <Button type="submit" color="primary">
                                            Submit
                                        </Button>
                                    </LocalForm>
                                </>
                            ) : (
                                <p>{postObj[0].content}</p>
                            )}
                            {postObj[0].comments.lenght !== 0 &&
                                postObj[0].comments.map((e) => (
                                    <Card className="box-shadow container">
                                        <div className="row justify-content-center">
                                            <div className="col-md-7 mb-1">
                                                <CardTitle tag="h5">
                                                    {e.author.username}
                                                </CardTitle>
                                                <CardText>{e.comment}</CardText>
                                            </div>
                                            <div className="col-md-4">
                                                <CardText>
                                                    {new Intl.DateTimeFormat(
                                                        'en-us',
                                                        options
                                                    ).format(
                                                        new Date(
                                                            Date.parse(
                                                                e.createdAt
                                                            )
                                                        )
                                                    )}
                                                </CardText>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
const mapStateToProps = (state) => ({ ...state })
export default withRouter(connect(mapStateToProps)(Post))
