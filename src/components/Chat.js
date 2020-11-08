import React, { useState, useEffect } from 'react'
import { Avatar, IconButton, InputBase } from '@material-ui/core'
import { MdMoreVert, MdAttachFile, MdSearch, MdSend, MdMic } from 'react-icons/md'
import { InsertEmoticon} from '@material-ui/icons'
import axios from "../apis/axios";
import Pusher from "pusher-js";

function Chat() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]); 
    useEffect(() => {
        axios.get("/messages/sync").then((response) => {
            setMessages(response.data);
        });
    }, []);
    useEffect(() => {
        
 
        const pusher = new Pusher("02b865ac879689d71e48", {
        cluster: "ap1",
        });
    
        const channel = pusher.subscribe("messages");
            channel.bind("inserted", (newMessage) => {
            // alert(JSON.stringify(newMessage));
            setMessages([...messages, newMessage]);
        });
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [messages]);

    const sendMessage = async (e) => {
        //code here
        e.preventDefault();
        axios.post("/messages/new", {
            message: input,
            name: "nDs",
            timestamp: "just now",
            received: false,
        });
        setInput('');
    };

    return (
        <div className="chat">
            <div className="chat_header">
                <Avatar />
                <div className="chat_headerInfo">
                    <h4>Room name</h4>
                    <p>Last seen at...</p>
                </div>
                <div className="chat_headerRight" style={{ color: "rgba(0, 0, 0, 0.5)"}}>
                    <IconButton>
                        <MdSearch />
                    </IconButton>
                    <IconButton>
                        <MdAttachFile/>  
                    </IconButton>
                    <IconButton>
                        <MdMoreVert />  
                    </IconButton>
                </div>

            </div>
            <div className="chat_body">
                {messages.map((message) => {
                     if(message.received) {
                         return (
                            <div className="chat_deliver">
                                <span className="chat_info">
                                    <p className="chat_name">{message.name}</p> 
                                    <p className="chat_timestamp">{message.timestamp}</p>
                                </span>
                                <p className="chat_massage">
                                    {message.message}
                                </p>
                            </div>
                         )
                    } 
                    return (
                        <div className="chat_reciever">
                            <div className="chat_info chat_reciever">
                                <span className="chat_timestamp chat_reciever">
                                    {message.timestamp}
                                </span>
                            </div>
                            <p className="chat_massage chat_reciever">
                            <span className="chat_name_recieve">{message.name}</span>
                            <p>{message.message}</p>
                            </p>
                        </div>
                    )
                })}
               
                
               
            </div>
            <div className="chat_footer">
                <IconButton
                    color="inherit"
                    aria-label="Menu"
                >
                    <InsertEmoticon />
                </IconButton>
                
                <form onSubmit={e => sendMessage(e)}
                 style={{ width: "100%", display: "flex", background: "var(--clr-primary-8)", borderRadius: "1rem" }} >
                    <InputBase
                    fullWidth
                    placeholder="Type your message..."
                    autoFocus
                    style={{ color: "#303030", paddingLeft: "10px", marginTop: ".1rem", fontFamily: "Piazzolla, serif" }}
                    // onSubmit={e => onSearchSubmit(e)}
                    value={input}
                    onChange= { (e) => setInput(e.target.value)}
                    
                    // onChange={onChange}
                    // // on click we will show popper
                    // onClick={() => {
                    //     setSearchState("clicked");
                    //     setPopper(true);
                    // }}
                    />
                </form>
                <IconButton
                    color="inherit"
                    aria-label="Menu"
                >
                    <MdSend onClick={ sendMessage } type="submit"/>
                </IconButton>
                <IconButton
                    color="inherit"
                    aria-label="Menu"
                >
                    <MdMic />
                </IconButton>
            </div>
        </div>
    )
}

export default Chat
