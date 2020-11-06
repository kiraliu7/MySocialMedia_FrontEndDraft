import React from "react";
import { connect } from 'react-redux';
import { updateProfile, updateUsers } from "./actions";

class Following extends React.Component {

    constructor(props) {
        super(props);
        this.handleunfollow=this.handleunfollow.bind(this);
        this.handlefollow=this.handlefollow.bind(this);
        this.state={
            //followlist:this.props.currentUser.following, 
            followlist:JSON.parse(localStorage.getItem("currentuser")).following,
            errormsg:""
        }
    }
    handleunfollow(event){
        let index=(this.state.followlist.length-1)-event.target.name;
        let newfollowlist=this.state.followlist;
        newfollowlist.splice(index, 1);
        this.setState({followlist:newfollowlist});
        let updated={...JSON.parse(localStorage.getItem("currentuser")), following:newfollowlist};
        this.props.updateProfile(updated);
        this.props.updateUsers(updated);
        this.props.handleChangeFollow(newfollowlist);
        window.location.reload(false);
    }
    handlefollow(event){
        event.preventDefault();
        let newfollowlist=this.state.followlist;
        let checkuser=JSON.parse(localStorage.getItem("userlist")).find(
            (item)=>{return item.username==event.target.tofollow.value});
        if(checkuser==null){
            this.setState({errormsg: "User not found"});
        }
        else if(checkuser.userId==JSON.parse(localStorage.getItem("currentuser")).userId){
            this.setState({errormsg: "You cannot follow yourself"});
        }
        else if(this.state.followlist.includes(checkuser.userId)){
            this.setState({errormsg: "User already followed"});
        }
        else{
            newfollowlist.push(checkuser.userId);
            this.setState({followlist:newfollowlist, errormsg: ""});
            let updated={...JSON.parse(localStorage.getItem("currentuser")), following:newfollowlist};
            this.props.updateProfile(updated);
            this.props.updateUsers(updated);
            this.props.handleChangeFollow(newfollowlist);
            window.location.reload(false);
        }
        event.target.tofollow.value="";
    }
    render(){
        return (
            <div>
                <div>
                    <form id="followform" onSubmit={this.handlefollow}>
                        <input type="text" id="tofollow" placeholder="add user by username"/>
                        &nbsp;&nbsp;
                        <input type="submit" value="follow" />
                        <p>{this.state.errormsg}</p>
                    </form>
                </div>
                {/* {this.state.followlist.reverse().map((ele, index)=>{
                    let followed=this.props.userlist.find(
                        */}
                {JSON.parse(localStorage.getItem("currentuser")).following.reverse().map((ele, index)=>{
                    let followed=JSON.parse(localStorage.getItem("userlist")).find(
                        (item)=>{return item.userId==ele});
                    return(
                    <div key={ele}>
                        <img src={followed.img} width="150" height="150"/>
                        <br/>
                        <div>
                        <span className="bold">{followed.username}</span>
                        &nbsp;
                        <input type='button' value="unfollow" id={"unfollow"+index} name={index} onClick={this.handleunfollow}/>
                        </div>
                        <div>{followed.status}</div>
                        <br/>
                    </div>)})}
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser,
        userlist: state.userlist
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateProfile: (c) => dispatch(updateProfile(c)),
        updateUsers: (c) => dispatch(updateUsers(c))
        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Following);
