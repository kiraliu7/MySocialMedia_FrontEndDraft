import React from "react";
import { connect } from 'react-redux';
import {requestPost, updatePost} from "./actions";
class Feeds extends React.Component {
    
    constructor(props) {
        super(props);
        this.doSearch=this.doSearch.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        /**
         * let allpost=JSON.parse(localStorage.getItem("post"));
        let currentUser=JSON.parse(localStorage.getItem("currentuser"));
        let followedpost=[];
        allpost.map(ele=>{
            if(currentUser.following.includes(ele.userId)||ele.userId==currentUser.userId){
                followedpost.push(ele);
            }
        });
        */
        this.state={
            post: this.props.post,
            //displayedpost:followedpost,
            //followedcopy:followedpost
            displayedpost:this.props.followedpost,
            followedcopy:this.props.followedpost
        }
    }

    doSearch(event){
        let searching=event.target.value.toLowerCase();
        let result=[];
        if(searching==""){
            this.setState({displayedpost: this.state.followedcopy});
        }
        else{
            //JSON.parse(localStorage.getItem("post")).forEach(ele=>{
            this.state.followedcopy.forEach(ele=>{
                if(ele.title.toLowerCase().includes(searching) || ele.body.toLowerCase().includes(searching) || ele.username.toLowerCase().includes(searching) || ele.userId.toString()==searching){
                    result.push(ele);
                }
                })
            this.setState({displayedpost: result});
        }
    }

    handleSubmit(event){
        event.preventDefault();
        let currentUser=JSON.parse(localStorage.getItem("currentuser"));
        let update=JSON.parse(localStorage.getItem("post"));
        let currentLength=update.length;
        update.unshift({userId: currentUser.userId, username: currentUser.username, id:currentLength+1, title:event.target.title.value, body:event.target.text.value, time:Date.now().toString(), img: null, comments: []});
        let newdisplay=this.state.displayedpost
        newdisplay.unshift({userId: currentUser.userId, username: currentUser.username, id:currentLength+1, title:event.target.title.value, body:event.target.text.value, time:Date.now().toString(), img: null, comments: []});
        this.setState({displayedpost:newdisplay});
        event.target.title.value="";
        event.target.text.value="";
        this.props.updatePost(update);
        this.forceUpdate();
    }

    convertDate(epoch){
        return new Date(epoch);
    }

    render(){
        return (
            <div>
                <div>
                <h3>Make new post</h3>
                    <form id="makenewpost" onSubmit={this.handleSubmit}>
                        Title: <input type="text" id="title" placeholder="title" required/>
                        <br/>
                        <br/>
                        <textarea id="text" placeholder="write something" rows="10" cols="60" required/>  
                        <br/>
                        <input type="file"  accept="image/*"/>
                        <br/>
                        <br/>
                        <input type="hidden" name="timestamp" id="timestamp" value=""/>
                        <input type="submit" value="post"/>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="reset" value="clear"/>
                    </form>
                </div>
                <br/>
                <h3>Search posts</h3>
                <input id="articlesearch" type="text" placeholder="search by user or content" onChange={this.doSearch}/>
                {this.state.displayedpost.map(ele=>{
                    return(
                    <div key={ele.id}>
                        <p className="bold">{ele.userId}: {ele.title}</p>
                        <p>{ele.body}</p>
                        <img src={ele.img}/>
                        <br/>
                        <input type="button" value="Edit" />
                        &nbsp;&nbsp;
                        <input type="button" value="Comment" />
                        &nbsp;&nbsp;
                        <span>Posted on: {this.convertDate(parseInt(ele.time)).toString()}</span>
                        <br/>
                        <br/>
                        <details className="comments">
                            <summary>Comments:</summary>
                            {ele.comments.map(elee=>{
                                return(
                                    <div key={elee.commentId}>
                                        <span>{elee.display}:&nbsp;&nbsp;{elee.content}</span>
                                        <br/>
                                    </div>
                                )
                            })}
                        </details>
                    </div>)})}
            </div>
        )
    }
}



const mapStateToProps = (state) => {
    return {

        currentUser: state.currentUser,
        post: state.post
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePost: (post) => dispatch(updatePost(post)),
        requestPost: (players) => dispatch(requestPost(players))

        
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(Feeds);
