import React from 'react'
import { Row, Label, Button } from 'reactstrap'
import {Form, Control, Errors, actions} from 'react-redux-form'
import { connect } from 'react-redux'
import { saveProfile, editProfile } from '../redux/ActionCreators'

const required = val => val && val.length
const maxlength = len => val => !(val ) || (val.length <= len)
const minlength = len => val => val && (val.length >= len)
const CreateProfile = ({ history, profileForm, dispatch }) => {
    let profileObj = localStorage.getItem('profile')
    if(profileForm.username==='' && profileObj)
        history.replace('/profile')
    profileObj = JSON.parse(profileObj)
    const setImageUrl= (url) => (dispatch(actions.change('profileForm.imageUrl',url)))
    const handleSubmit = (values) => {
        let formData = new FormData()
        formData.append('username', values.username)
        formData.append('bio', values.bio)
        formData.append('image', values.image[0],values.username)
        if(profileObj){
            formData.append('_id', profileObj._id)
            dispatch(editProfile(formData, history))
        }else{
            dispatch(saveProfile(formData, history))
        }
    }
    return (
        <div className="container-fluid">
            <h1 className="center">Create Profile</h1>
            <div className="row mt-5">
                <div className="col-9 col-md-7 m-auto">

        <Form model="profileForm" onSubmit={(values) => handleSubmit(values)} className="container">
            <Row className="form-group my-3">
                <Label htmlFor="username" tag="h4">Username</Label>
                <Control.text model=".username" id="username" name="username" 
                    className="form-control"
                    placeholder="username"
                    validators={{ required, minlength: minlength(3), maxlength: maxlength(15) }}/>
                <Errors className="text-danger"
                        model=".username"
                        show="touched"
                        messages={{
                            required: 'Required! ',
                            minlength: 'Length must be atleast 3! ',
                            maxlength: 'Length must be atmost 15! '
                        }} />
            </Row>
            <Row className="form-group my-3">
                <Label htmlFor="bio" tag="h4">Bio</Label>
                <Control.textarea rows="6" model=".bio" id="bio" name="bio" className="form-control"/>
            </Row>
            <Row className="form-group my-3">
                <Label htmlFor="image">Pick an image</Label>
                <Control.file 
                    model=".image" 
                    id="image" 
                    name = "image"
                    onChange={(e)=> setImageUrl(URL.createObjectURL(e.target.files[0]))}
                    className="form-control-file"
                    validators={{required}} />
                    <Errors className="text-danger"
                        model=".image"
                        show="touched"
                        messages={{
                            required: 'Required! ',
                        }} />
                
            </Row>
            <Row>
                <img src={profileForm.imageUrl} style={{height: 150, width: 'auto'}} alt="No File Selected" />
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
export default connect(mapStateToProps)(CreateProfile)
