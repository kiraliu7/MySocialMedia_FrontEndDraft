import {Redirect} from "react-router-dom";
import React from "react";
import { connect } from 'react-redux';
import {login} from "./actions";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.state={
            errormsg:"",
            loggedin: JSON.parse(localStorage.getItem("loggedin"))
        }
    }
    handleSubmit(event){
        event.preventDefault();
        let userfound=false;
        let checkuser=JSON.parse(localStorage.getItem("userpassword")).find(
            (item)=>{return item.username==event.target.username.value});
        if(checkuser!=null){
            if(checkuser.password==event.target.pword.value){
                userfound=true;
            }
        }
        else{

        }
        if(userfound){
            this.setState({errormsg:""})
            let currentuser=JSON.parse(localStorage.getItem("userlist"))[checkuser.userId-1];
            this.props.login(currentuser);
            event.target.username.value="";
            event.target.pword.value="";
            this.setState({loggedin: true});
        }
        else{
            this.setState({errormsg:"Unrecognized Combination of username and password"})
        }
        
    }
    render(){
        if(this.state.loggedin){
            return <Redirect to='/main' />
        }
        return (
            <div>
                <h1>Login</h1>
                    <form id="loginform" onSubmit={this.handleSubmit}>
                        <p>Username: <br/> <input type="text" name="username" id="username" placeholder="enter username"  required/>  </p>
                        <p>Password: <br/> <input type="password" name="pword" id="pword" placeholder="enter password" required/>  </p>
                        <input type="hidden" id="logintimestamp" value=""/>
                        <input type="submit" id="loginsubmit" value="login"/>
                        <p>{this.state.errormsg}</p>
                    </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userpassword: state.userpassword,
        userlist:state.userlist,
        loggedin:state.loggedin
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        login: (c) => dispatch(login(c)),
        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Login);
