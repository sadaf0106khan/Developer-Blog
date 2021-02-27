import React, { useState } from 'react'
import  { Modal, ModalHeader, ModalBody, FormGroup, Label, Input, Form, Button, TabContent, TabPane , Nav, NavLink, NavItem}from 'reactstrap'
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import {loginUser, logoutUser} from '../redux/ActionCreators'
import { baseUrl } from '../baseUrl'

const Auth = ({ auth, dispatch }) => {
    const [password, setPassword] = useState('')
    const [email,setEmail] = useState('')
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [activeTab,setActiveTab] = useState('1')
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
      }
    const toggleAuth = (tab) => {
        if(activeTab!==tab) setActiveTab(tab)
    }
    const handleChangePassword = (e) => {
        setPassword(e.target.value)
    }
    const handleChangeEmail = (e) => {
        setEmail(e.target.value)
    }
    const handleLogin = (e) =>{
        e.preventDefault()
        toggleModal()
        dispatch(loginUser({email, password})) 
    }
    const handleLogout = (e) =>{ 
        e.preventDefault()
        dispatch(logoutUser()) 
    }
    const handleSignUp = (e) => {
        e.preventDefault()
        toggleModal()
        const url = baseUrl + 'signup'
        return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email,password})
            })
            .then(response => response.json())
            .then(data => {
                if(data.success){
                    toast.success(data.message)
                }else{
                    toast.error(data.message)
                }
            })
            .catch(err => toast.error(err.message))
    }
    const loader = auth.isLoading?
      <span className="fa fa-spinner fa-pulse fa-fw text-primary"></span>
      :<span></span>
    return (
        <>
        {
            !auth.isAuthenticated?
            <Button className="bg-primary ml-3" onClick={toggleModal}>Login{loader}</Button>
            :<Button className="bg-primary ml-3" onClick={handleLogout}>Logout{loader}</Button>
        }
        <Modal isOpen={isModalOpen} toggle={toggleModal} >
            <ModalHeader toggle={toggleModal}>Login/SignUp</ModalHeader>
            <ModalBody>
                <Nav tabs>
                    <NavItem>
                        <NavLink className={activeTab==='1'?'active':''} onClick={()=>{toggleAuth('1')}}>Login</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={activeTab==='2'?'active':''} onClick={()=>{toggleAuth('2')}}>SignUp</NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                    <Form onSubmit={handleLogin} >
                        <FormGroup className="mb-2">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" name="email" onChange={handleChangeEmail} required />
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <Label htmlFor="password">Password</Label>
                            <Input type="password" name="password" onChange={handleChangePassword} required/>
                        </FormGroup>
                        <Button type="submit" color="primary">Login</Button>
                    </Form>
                </TabPane>
                <TabPane tabId="2">
                    <Form onSubmit={handleSignUp} >
                        <FormGroup className="mb-2">
                            <Label htmlFor="email">Email</Label>
                            <Input type="email" name="email" onChange={handleChangeEmail} required/>
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <Label htmlFor="password">Password</Label>
                            <Input type="password" name="password" onChange={handleChangePassword} required />
                        </FormGroup>
                        <Button type="submit" color="primary">Register</Button>
                    </Form>
                </TabPane>
                </TabContent>  
            </ModalBody>
        </Modal>
        </>
    )
}
const mapStateToProps = (state) => ({ auth: state.auth })
export default connect(mapStateToProps)(Auth)