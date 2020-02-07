import React, { Component } from 'react'
import logo from './img/logo.svg'
import google from './img/google.png'
import microsoft from './img/microsoft.png'
import { Form, Button, Input } from 'reactstrap';
import { connectWithAccount } from '../../services/requests'

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
/*    this.state = {
        name: '',
        surname1: '',
        surname2: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        initial_role: '',
        language: '',
        latestActions: [],
        active: true,
        adminFictitious: false,
        buttonText: 'Deactivate',
        openModal: false,
        errors: {
            name: false,
            surname1: false,
            surname2: false,
            email: false,
            password: false,
            confirmPassword: false,
            role: false,
            language: false
        },
        errorMsg: {
            name: false,
            email: false,
            password: false,
            role: false,
            language: false
        }
    };*/
    this.connect = this.connect.bind(this)
    this.showMessage = this.showMessage.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    //this.handleUsernameChange = this.handleUsernameChange.bind(this)
    //this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleFieldChange = this.handleFieldChange.bind(this)
  }

  handleFieldChange = (field, e) => {
    e.preventDefault()
    this.setState({[field]: e.target.value})
  }

  handleSubmit = (e) => {
    e.preventDefault()
    alert('Submit!!')
    /*
    wsMoveTeacherSchool(this.state.idprofesor,
      this.state.data.c_centro,
      this.state.data.t_premium, (err, data) => {
        if (err) {
          console.log(err)
          this.props.action(this.state.data, this.props.status.KO_CHANGESCHOOL)
        } else {
          this.props.action(this.state.data, this.props.status.SUCCESS)
        }
      })*/
  }

  showMessage(message) {
    console.log(message)
  }

  connect(account) {
    console.log('CONNECT: ', account)
    connectWithAccount(account)
    .then(result => {
      this.showMessage(result)
    })
    .catch((err) => this.showMessage(err))
  }

  render() {
    return (
      <div className="wrapper">
        <Form className="form-signin" onSubmit={this.handleSubmit} inline>   
          <img src={logo} className="App-logo" alt="logo" />
          <h2 className="form-signin-heading">Please login</h2>
          <Input type="text" className="form-control" name="username" placeholder="Email Address" required="" autoFocus="" onChange={e => this.handleFieldChange('username', e)}/>
          <Input type="password" className="form-control" name="password" placeholder="Password" required="" onChange={e => this.handleFieldChange('password', e)}/>      
          <Button className="btn btn-lg btn-primary btn-block" type="submit">Login</Button>
          <Button id="google" type="button" className="img-container" outline color="primary" size="sm" onClick={() => this.connect('google')}><img src={google} alt="google" /></Button>
          <Button className="img-container" outline color="primary" size="sm" onClick={() => alert("I'm Microsoft!!")}><img src={microsoft} alt="microsoft" /></Button>
        </Form>
      </div>
)
}
}

export default Login