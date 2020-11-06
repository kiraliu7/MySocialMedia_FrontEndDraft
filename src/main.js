import {Link} from "react-router-dom";
import React from "react";
import { connect } from 'react-redux';
import {  updateProfile, updateUsers , logout} from "./actions";
import Feeds from './feeds';
import Following from './following';
import Banner from './banner';

class Main extends React.Component {

    constructor(props) {
        super(props);

        let allpost=JSON.parse(localStorage.getItem("post"));
        let currentUser=JSON.parse(localStorage.getItem("currentuser"));
        let fetchpost=[];
        allpost.map(ele=>{
            // if(this.props.currentUser.following.includes(ele.userId)||ele.userId==this.props.currentUser.userId){ 
            if(currentUser.following.includes(ele.userId)||ele.userId==currentUser.userId){
                fetchpost.push(ele);
            }
        })

        this.state={
            //status:this.props.currentUser.status,
            status:JSON.parse(localStorage.getItem("currentuser")).status,
            firstload: true, 
            currentUser:JSON.parse(localStorage.getItem("currentuser")),
            followedpost:fetchpost
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handleLogout=this.handleLogout.bind(this);
        this.handleChangeFollow=this.handleChangeFollow.bind(this);
    }

    handleLogout(event){
        this.props.logout(event);
        window.location="/";
    }


    handleChangeFollow(newfollow){
        let updated={...this.state.currentUser,following: newfollow }
        this.setState({currentUser: updated});
        let allpost=JSON.parse(localStorage.getItem("post"));
        let fetchpost=[];
        allpost.map(ele=>{
            // if(this.props.currentUser.following.includes(ele.userId)||ele.userId==this.props.currentUser.userId){ 
            if(updated.following.includes(ele.userId)||ele.userId==updated.userId){
                fetchpost.push(ele);
            }
        })
        this.setState({followedpost: fetchpost});
    }

    handleSubmit(event){
        event.preventDefault();
        this.setState({status:event.target.newstatus.value});
        let updated={...JSON.parse(localStorage.getItem("currentuser")), status:event.target.newstatus.value};
        this.props.updateProfile(updated);
        this.props.updateUsers(updated);
        event.target.newstatus.value="";
    }

    render(){
        return (
            <div className="main">
                <div>
                    <div>
                        <Banner/>
                    </div>
                    <Link to={"/profile"}>To Profile</Link>
                    <br/>
                    <div>
                        <br/>
                        {/*
                        <img src={this.props.currentUser.img} width="150" height="150"/>
                        */}
                        <img src={this.state.currentUser.img} width="150" height="150"/>
                        <br/>
                        {/*
                        <span className="bold">{this.props.currentUser.username}</span> 
                        */}
                        <span className="bold">{this.state.currentUser.username}</span> 
                        <br/>
                        <span>{this.state.status}</span> 
                        <br/>
                        <div>
                            <form id="statusform" onSubmit={this.handleSubmit}>
                            <input type="text" id="newstatus" placeholder="New status"/>
                            &nbsp;&nbsp;
                            <input type="submit" value="update"/>
                            </form>
                        </div>
                    </div>
                    <div>
                        <h3>Following</h3>
                        <Following handleChangeFollow={this.handleChangeFollow}/>
                    </div>
                </div>
                <div>
                    <div className="logout">
                        <input id="logoutbtn" type="button" value="Log out" onClick={this.handleLogout}/>
                    </div>
                    <div> 
                        <Feeds followedpost={this.state.followedpost} />
                    </div>
                </div>
            </div>
        )
    }
}



const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        loggedin:state.loggedin
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateProfile: (p) => dispatch(updateProfile(p)),
        updateUsers:(p) => dispatch(updateUsers(p)),
        logout: (c) => dispatch(logout(c))        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Main);
