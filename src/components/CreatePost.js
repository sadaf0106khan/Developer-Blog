import React from 'react'
import { Row, Label, Button } from 'reactstrap'
import {Form, Control, Errors, actions} from 'react-redux-form'
import { connect } from 'react-redux'
import { savePost, editPost } from '../redux/ActionCreators'

const required = val => val && val.length
const maxlength = len => val => !(val ) || (val.length <= len)
const minlength = len => val => val && (val.length >= len)
const CreatePost = ({ history, match , postForm, dispatch }) => {
    let profileObj = localStorage.getItem('profile')
    if(profileObj===null) history.push('/createprofile')
    profileObj = JSON.parse(profileObj)
    const setImageUrl =  (url) => (dispatch(actions.change('postForm.imageUrl',url)))
    const handleSubmit = (values) => {
        let formData = new FormData()
        formData.append('title', values.title)
        formData.append('content', values.content)
        formData.append('image', values.image[0],values.title)
        const _id = match.params.id 
        if(_id){
            formData.append('_id', _id)
            dispatch(editPost(formData, history))
        }
        else{
            dispatch(savePost(formData, history))
        }
    }
    return (
        <div className="container-fluid">
            <h1 className="center">Create Post</h1>
            <div className="row mt-5">
                <div className="col-9 col-md-7 m-auto">

              
        <Form model="postForm" onSubmit={(values) => handleSubmit(values)}>
            <Row className="form-group my-3">
                <Label htmlFor="title" tag="h4">Title</Label>
                <Control.text model=".title" id="title" name="title" 
                    className="form-control"
                    placeholder="title"
                    validators={{ required, minlength: minlength(3), maxlength: maxlength(15) }}/>
                <Errors className="text-danger"
                        model=".title"
                        show="touched"
                        messages={{
                            required: 'Required! ',
                            minlength: 'Length must be atleast 3! ',
                            maxlength: 'Length must be atmost 15! '
                        }} />
            </Row>
            <Row className="form-group my-3">
                <Label htmlFor="content" tag="h4">Content</Label>
                <Control.textarea rows="6" model=".content" id="content" name="content" className="form-control"/>
            </Row>
            <Row className="form-group my-3">
                <Label htmlFor="image">Pick an image</Label>
                <Control.file 
                    model=".image" 
                    id="image" 
                    name = "image"
                    className="form-control-file"
                    onChange={(e)=> setImageUrl(URL.createObjectURL(e.target.files[0]))}
                    validators={{required}} />
                    <Errors className="text-danger"
                        model=".image"
                        show="touched"
                        messages={{
                            required: 'Required! ',
                        }} />
                
            </Row>
            <Row>
                <img src={postForm.imageUrl} style={{height: 150, width: 'auto'}} alt="No File Selected" />
            </Row>
            <Row>
                <Button type="submit" color="primary">Submit</Button>
            </Row>
        </Form>
        </div>
        </div>
            </div>
    )
}
const mapStateToProps = (state) => ({...state})
export default connect(mapStateToProps)(CreatePost)
