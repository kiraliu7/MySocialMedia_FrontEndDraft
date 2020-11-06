import {Redirect} from "react-router-dom";
import React from "react";
import { connect } from 'react-redux';
import { updateProfile, updatePword, updateUsers} from "./actions";
//import {buttons} from "react-materialize"


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.state={
            errormsg:``,
            error:``,
            loggedin: false
        }
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    
    handleSubmit(event){
        event.preventDefault();
        let bday=new Date(event.target.bday.value);
        var currentdate=new Date();
        var age = currentdate.getFullYear() - bday.getFullYear();
        var m = currentdate.getMonth() - bday.getMonth();
        if (m < 0 || (m === 0 && currentdate.getDate() < bday.getDate())) {age--;}
      
        let newusername=event.target.rusername.value;
        let newemail=event.target.emailaddress.value;
        let newphone=event.target.phonenum.value;
        let newzip=event.target.zipcode.value;
        let newpword=event.target.rpword.value;
        let newpwordconfirm=event.target.pwordconfirm.value;
        let newerrormsg=``;
        let doupdate=true;
        let newuser={"userId":null, "username":null, "displayname":null, "email": null, "phone":null, "zip":null, "img":"https://pbs.twimg.com/profile_images/1145725169765429248/E18K03-5_400x400.png", "following":[], "status": "nothing"}
        let userpword=null;
        let checkname=JSON.parse(localStorage.getItem("userlist")).find(
            (item)=>{return item.username==newusername});
        
        if(checkname!=null){
            doupdate=false;
            this.setState({errormsg:"Username is not available."});
        }
        else if(age<18){
            doupdate=false;
            this.setState({errormsg:"You need to be 18 years old to register."});
        }
        else{
            newuser={...newuser, username:newusername, displayname:event.target.disname.value}

        //validate zip
        //return if invalid and display notice
            if(!/^[0-9]{5}(?:-[0-9]{4})?$/.test(newzip)){
                doupdate=false;
                newerrormsg+=`zip,   `;
            }
            else{newuser={...newuser,zip:newzip}}
        
        //validate email
            //return if invalid and display notice
            if(!/^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+.[a-zA-Z0-9]*$/.test(newemail)){
                doupdate=false;
                newerrormsg+=`email,   `;
            }
            else{newuser={...newuser,email:newemail}}

        //validate phone number
            //return if invalid and display notice
            if(!/^[0-9]{10}$/.test(newphone)){
                doupdate=false;
                newerrormsg+=`phone,   `;
            }
            else{
                newuser={...newuser,phone:newphone}}
            
        //check if password match
            //return if invalid and display notice
            if(newpword!=newpwordconfirm){
                doupdate=false;
                newerrormsg+=`passwords not match,  `;
            }
            else{userpword={userId:null, password:newpword, username: newusername}}

            if(doupdate){
                this.setState({errormsg:`Successfully registered, but you cannot login`})
                this.setState({error:``})
                //update props
                
                //PARTS THAT ARE COMMENTED OUT WERE EFFECTIVE IN HW5, BUT UNDESIRED IN HW6
                //this.props.updateProfile(newuser);
                //this.props.updateUsers(newuser);
                //this.props.updatePword(userpword);
                event.target.rusername.value="";
                event.target.disname.value="";
                event.target.emailaddress.value="";
                event.target.phonenum.value="";
                event.target.zipcode.value="";
                event.target.rpword.value="";
                event.target.pwordconfirm.value="";
                //this.setState({loggedin: true});
            }
            else{
                this.setState({error:`Invalid inputs detected from:  `})
                this.setState({errormsg: newerrormsg})
            }
        }
    }
    render(){
        if(this.state.loggedin){
            return <Redirect to='/main' />
        }
        return (
            
            <div>
                <h1>Create an account</h1>
                    <form id="registerform" onSubmit={this.handleSubmit}>
                        <p>Username: (Must Start With Character) <br/> <input type="text" id="rusername" placeholder="choose a username" pattern="[a-zA-Z]+[a-zA-Z0-9]*" required/>  </p>
                        <p>Display Name: <br/> <input type="text" id="disname" placeholder="choose a display name" required/>  </p>
                        <p>Birthday: <br/> <input type="date" id="bday" required/> </p>
	                    <p>Email Address: <br/> <input type="email" id="emailaddress" placeholder="abc@example.com" required/> </p>
	                    <p>Phone Number (Expected Format: 0000000000): <br/> <input type="tel" id="phonenum" placeholder="0000000000"  required/> </p>  
                        <p>Zipcode: <br/> <input type="text" id="zipcode" placeholder="enter your zipcode" required/>  </p>
                        <p>Password: <br/> <input type="password" id="rpword" placeholder="create a password" required/>  </p>
                        <p>Password Confirmation: <br/> <input type="password" id="pwordconfirm" placeholder="re-enter your password" required/>  </p>
                        <input type="hidden" id="registertimestamp" value=""/>
                        <input type="submit" value="create account"/>
                        &nbsp;&nbsp;
                        <input type="reset" value="clear input"/>
                        <p>{this.state.error}</p>
                        <p>{this.state.errormsg}</p>
                    </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {

        userlist: state.userlist,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateProfile: (c) => dispatch(updateProfile(c)),
        updatePword: (c) => dispatch(updatePword(c)),
        updateUsers: (c) => dispatch(updateUsers(c))
        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Register);
