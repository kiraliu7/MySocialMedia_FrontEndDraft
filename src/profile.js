import {Link} from "react-router-dom";
import React from "react";
import { connect } from 'react-redux';
import { updateProfile, updateUsers, updatePword, logout} from "./actions";
import Banner from './banner';


class Profile extends React.Component {
    constructor(props) {
        super(props);
        let currentUser=JSON.parse(localStorage.getItem("currentuser"));
        this.state={
            displayname: currentUser.displayname,
            email: currentUser.email,
            phone:currentUser.phone,
            zip:currentUser.zip,
            errormsg:``,
            error:``
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleLogout=this.handleLogout.bind(this);
    }

    handleLogout(event){
        this.props.logout(event);
        window.location="/";
    }
    
    handleSubmit(event){
        event.preventDefault();
        let newdisname=event.target.disname.value;
        let newemail=event.target.emailaddress.value;
        let newphone=event.target.phonenum.value;
        let newzip=event.target.zipcode.value;
        let newpword=event.target.pword.value;
        let newpwordconfirm=event.target.pwordconfirm.value;
        let newerrormsg=``;
        let noupdate=true;
        let updatepword=false;
        let updated={...JSON.parse(localStorage.getItem("currentuser"))}
        let valid=true;

        if(newdisname!=""){
            noupdate=false;
            this.setState({displayname:newdisname})
            updated={...updated, displayname:newdisname}
        }

        //validate zip
        if(newzip!=""){

            //return if invalid and display notice
            if(!/^[0-9]{5}(?:-[0-9]{4})?$/.test(newzip)){
                newerrormsg+=`zip,   `;
                valid=false;
            }
            else{
                noupdate=false;
                this.setState({zip:newzip})}
                updated={...updated, zip:newzip}
        }
        
        //validate email
        if(newemail!=""){

            //return if invalid and display notice
            if(!/^[a-zA-Z0-9_.]+@[a-zA-Z0-9]+.[a-zA-Z0-9]*$/.test(newemail)){
                newerrormsg+=`email,   `;
                valid=false;
            }
            else{
                noupdate=false;
                this.setState({email:newemail})}
                updated={...updated, email:newemail}
        }

        //validate phone number
        if(newphone!=""){

            //return if invalid and display notice
            if(!/^[0-9]{10}$/.test(newphone)){
                newerrormsg+=`phone,   `;
                valid=false;
            }
            else{
                noupdate=false;
                this.setState({phone:newphone})}
                updated={...updated, phone:newphone}
        }
        //check if password match
        if(newpword!="" || newpwordconfirm!=""){

            //return if invalid and display notice
            if(newpword!=newpwordconfirm){
                newerrormsg+=`passwords does not match,  `;
                valid=false;
            }
            else{
            noupdate=false;    
            updatepword=true;}
        }
        

        if(!noupdate && valid){
            this.setState({errormsg:``})
            this.setState({error:``})
            //update props
            this.props.updateProfile(updated);
            this.props.updateUsers(updated);
            if(updatepword){
                this.props.updatePword({userId: updated.userId, password: newpword});
            }
            event.target.disname.value="";
            event.target.emailaddress.value="";
            event.target.phonenum.value="";
            event.target.zipcode.value="";
            event.target.pword.value="";
            event.target.pwordconfirm.value="";
        }
        else{
            let currentUser={...JSON.parse(localStorage.getItem("currentuser"))}
            this.setState({error:`No Input OR invalid inputs detected from:  `})
            this.setState({errormsg: newerrormsg})
            this.setState({displayname:currentUser.displayname})
            this.setState({zip:currentUser.zip})
            this.setState({email:currentUser.email})
            this.setState({phone:currentUser.phone})
            this.setState({password:""})
        }
    }


    render(){
        return (
            <div className="bg">
                <div className="twoColWrapper">
                    <div>
                        <div>
                            <Banner/>
                        </div>
                        <div>
                            <Link to={"/main"}>To main</Link>
                        </div>
                        <div className="currentinfo">
                        <img src={JSON.parse(localStorage.getItem("currentuser")).img} width="150" height="150"/>
                        <br/>
                        <span>Upload new profile picture</span>
                        <br/>
                        <input type="file" accept="image/*"/>
                        <h3>Current Info</h3>
                        <p id="currentdisname">Display Name: {this.state.displayname}</p> 
                        <p id="currentemail">Email: {this.state.email}</p> 
                        <p id="currentphone">Phone: {this.state.phone}</p>
                        <p id="currentzipcode">Zip: {this.state.zip}</p>
                        </div>
                    </div>
                    <div>
                        <div className="logout"> 
                            <input id="logoutbtn" type="button" value="Log out" onClick={this.handleLogout}/>
                        </div>
                        <div className="changeinfo">
                        <h3>Update Info</h3>
                        <form id="update" onSubmit={this.handleSubmit}>
                        <p>Display Name: &nbsp;
                            <input id="disname" type="text" name="disname" placeholder="change display name" />  </p>
                        <p>Email Address: &nbsp;
                            <input id="emailaddress" type="email" name="emailaddress" placeholder="input format: ab@c.com" /> </p>
                        <p>Phone Number: &nbsp;
                            <input id="phonenum" type="tel" name="phonenum" placeholder="input format: 0000000000 "/> </p>
                        <p>Zipcode: &nbsp;
                            <input id="zipcode" type="text" name="zipcode" placeholder="change zipcode" />  </p>
                        <p>Password: &nbsp;
                            <input id="pword" type="password" name="pword" placeholder="change password" />  </p>
                        <p>Password Confirmation: &nbsp;
                            <input type="password" id="pwordconfirm" name="pwordconfirm" placeholder="confirm new password" />  </p>
                        <input type="submit" value="update changes"/>
                        <p>{this.state.error}</p>
                        <p>{this.state.errormsg}</p>
                        </form>
                        </div> 
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        userlist: state.userlist,
        userpassword: state.userpassword,
        loggedin:state.loggedin
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateProfile: (c) => dispatch(updateProfile(c)),
        updatePword: (c) => dispatch(updatePword(c)),
        updateUsers: (c) => dispatch(updateUsers(c)),
        logout: (c) => dispatch(logout(c))
        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
