import React, { Component } from 'react'
// import defaultImg from '../images/Logosvg3.svg';
import className from 'classnames';
import { Link, Redirect } from 'react-router-dom';
import { OrderedMap } from 'immutable';
import _ from 'lodash';
import {ObjectID} from "../helpers/objectid";
import { IconButton } from '@material-ui/core';
import { CgCloseO, CgSoftwareUpload, CgMoreVerticalAlt } from 'react-icons/cg'
import { SiConvertio } from 'react-icons/si';
import { FaSun, FaMoon } from 'react-icons/fa';
import { MdSettings, MdDeleteForever, MdInsertEmoticon, MdMic, MdVideocam, MdNavigateNext, MdPlayCircleOutline } from 'react-icons/md';
// import moment from 'moment';
import Moment from 'react-moment';
import { UserBar } from "./UserBar";
import Dropzone from "react-dropzone";
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import AudioAnalyser from './library/AudioAnalyser';
import Draggable from './Draggable';



export default class App3 extends Component {
    constructor(props){
        super(props);
        this.state = {
            height: window.innerHeight,
            newMessage: '',
            searchUser: '',
            showSearchUser : false,
            isTyping: false,
            showEmoji: false,
            audio: null,
            temp : 5000,
            isShowGetAud: false,
            record: false,
            openToolChat: false,
            English: true,
            iShowConfig: false,
            idRoomChat: '',
            redirect: false,
            isDark: true,
        }

    }
    
    updateTheme = (theme) => {
      
        console.log(this.state.isDark);
        console.log(typeof(theme));
        const themeBool = JSON.parse(theme);
        console.log(typeof(themeBool));
        this.setState({
            isDark : !themeBool
        })
    }

    handleChangeTheme = (e) => {
        
        const { isDark } = this.state;
        e.preventDefault();

        if(!isDark){
            this.setState({
                isDark: true
            })
        } else {
            this.setState({
                isDark: false
            })
        }
        this.sendThemeToLocal()
    }

    sendThemeToLocal = () => {
        const { isDark } = this.state;
        const { store } = this.props;
       
            store.setThemeToLocalStorage(isDark);
        
        console.log("Sent: ", isDark);
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }


    handleCreateR = (e) => {
        e.preventDefault();
            const idRoomChat = this.generateId(24);
            this.setState({idRoomChat: idRoomChat});
            console.log(idRoomChat);
      }
    dec2hex = (dec) => {
        return dec < 10
        ? '0' + _.toString(dec)
        : dec.toString(16)
    }
    generateId = (len) => {
        var arr = new Uint8Array((len || 40) / 2)
        window.crypto.getRandomValues(arr)
        return Array.from(arr, this.dec2hex).join('')
    }

    handleCreateRoom = (e) => {
        const { store } = this.props;
        e.preventDefault();
        const { idRoomChat } = this.state;
       

        if(_.trim(idRoomChat).length){
            const messageId = new ObjectID().toString();
            const channel = store.getActiveChannel();
            const channelId = _.get(channel , '_id', null);
            const currentUser = store.getCurrentUser();
            const message = {
                _id: messageId,
                channelId: channelId,
                body : 'A new Face Moment Created with ID: '+ idRoomChat,
                userId: _.get(currentUser, '_id'),
                type:"text",
                me: true,
            };
            
            store.addMessage(messageId, message);
        }
        
        this.setState({
            iShowConfig: false,
            redirect: true,
        });
    }
   
   
    async startRecording() {
        const {store} = this.props;
        const audio = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        this.setState({ audio });
        this.setState({isShowGetAud: true});
        this.setState({ record: true });

        const chunks = [];
        const recoder = new MediaRecorder(audio);
        recoder.start();

        recoder.ondataavailable = function(e) {
            chunks.push(e.data);
            const namefile = new ObjectID().toString();
            let files = new File(chunks, `${namefile+'.mp3'}` , {type: "audio/wav"});
            const path = URL.createObjectURL(files);
            files.path = `${_.toString(path.substring(27)+'.mp3')}`;
            const name = _.toString(files.path);
            files.fileName = `${name}`;
            // console.log("file goc 1: ", files);
            let file = [];
            file.push(files);
            // console.log("File goc", file);
            const formData = new FormData();
            formData.append('file', file[0] );
            store.upLoadfile(formData);
        }
    }
        
    //stop
    stopRecording() {
       if(this.state.audio !== null){
            this.state.audio.getTracks().forEach(track => track.stop());
            this.setState({ audio: null });
            this.setState({ record: false }); 
        } else {
            console.log("Error shortage-lenght!");
        }
               
        
    }


        
        onClickOutSide = (e) => {
            if(this.ref && !this.ref.contains(e.target)){
                // console.log("Here click out side login form!");
                this.setState({
                    showEmoji: false,
                })
            }
        }

        onDrop = (files) => {
            const {store} = this.props;
            // console.log("file goc: ",files);
            let formData = new FormData();
            formData.append("file", files[0]);
            store.upLoadfile(formData);
            // console.log("file format: ",formData);
        }


        sendTyping = () =>{
            const { store } = this.props;
            const activeChannel = store.getActiveChannel();
            this.lastUpdateTime = Date.now()
            if(!this.state.isTyping){
                this.setState({isTyping:true});
                store.addTyping(activeChannel, true);
                this.startCheckingTyping();

            }
        }

	/*
	*	startCheckingTyping
	*	Start an interval that checks if the user is typing.
	*/
        startCheckingTyping = ()=>{
            console.log("Typing");
            this.typingInterval = setInterval(() => {
                if((Date.now() - this.lastUpdateTime) > 350){
                    this.setState({isTyping:false})
                    this.stopCheckingTyping()
                }
            }, 300)
        }
	/*
	*	stopCheckingTyping
	*	Start the interval from checking if the user is typing.
	*/
        stopCheckingTyping = () => {
            const { store } = this.props;
            const activeChannel = store.getActiveChannel();
            console.log("Stop Typing");
            if(this.typingInterval){
                clearInterval(this.typingInterval)
                store.addTyping(activeChannel, false);
            // console.log(this.state.isTyping);
            }
        }


    renderChannelAvatar(channel){
        const {store} = this.props;

        const members = store.getMembersFromChannel(channel);

        const maxDisplay = 4;
        const total = members.size > maxDisplay ? maxDisplay : members.size;

        const avatars = members.map((user, index) => {

            return index < maxDisplay ?  <img key={index} src={`http://localhost:8080/${_.get(user, 'avatar')}`} alt={_.get(user, 'name')} /> : null

        });

        return <div className={className('channel-avatars', `channel-avatars-${total}`)}>{avatars}</div>
    }

    renderChannelTitle = (channel = null) => {
        const { store } = this.props;
        const members = store.getMembersFromChannel(channel);
         const names = [];

         members.forEach((user) => {
             const name = _.get(user, 'name')
             names.push(name);
         });
         let title = _.join(names, ', ');
         if(!title && _.get(channel, 'isNew')){
             title = 'New Mss';
         }
        return <h4>{title}</h4>
    }
   
    handleOnClick = (user) => {
       
        const { store } =this.props;
        const userId = _.get(user, '_id');
        const channelId = _.get( store.getActiveChannel(),'_id')
        store.addUserToChannel(channelId, userId);
        this.setState({
            searchUser: '',
        })
    }
    _onCreateChannel = (e) => {
        e.preventDefault()
        const { store } =this.props;
        const currentUser = store.getCurrentUser();
        const currentUserId = _.get(currentUser, '_id');
        const channelId = new ObjectID().toString();
        const channel = {
            _id: channelId,
            title: "",
            lastMessage: "Let's a chat",
            members: new OrderedMap(),
            messages: new OrderedMap(),
            isNew: true,
            userId: currentUserId,
            created: new Date(),
            typing: false,
        };
        channel.members = channel.members.set(currentUserId, true);
        store.onCreateNewChannel(channel);
    }
    scrollMessagesToBottom = () => {
        if(this.messagesRef){
            this.messagesRef.scrollTop = this.messagesRef.scrollHeight;
        }
    }
 

    handlePlayMusic = (music) => {
       
        try {
            this.audio.pause();
            this.audio.currentTime = 0;
         
        } catch (e) {
          console.log(e);
        }
       
        this.audio = new Audio(music);
        this.audio.play();
        
    }


    handleStopMusic = (music) => {
        this.audio = new Audio(music);
        this.audio.pause()
    }
    handleSubmit = (e) => {

        const { newMessage } = this.state;
        const { store } = this.props;
        e.preventDefault();

        if(_.trim(newMessage).length){
            const messageId = new ObjectID().toString();
            const channel = store.getActiveChannel();
            const channelId = _.get(channel , '_id', null);
            const currentUser = store.getCurrentUser();
            const message = {
                _id: messageId,
                channelId: channelId,
                body : newMessage,
                userId: _.get(currentUser, '_id'),
                type:"text",
                me: true,
            };
            
            store.addMessage(messageId, message);
            this.setState({newMessage: ""});
        }
        this.setState({
            newMessage: "",
            showEmoji: false
        });

    };
    _onResi = () => {
        this.setState({height: window.innerHeight});
    }
    // addTestMessages = () => {
    //     const {store} = this.props

      
    //     for(let i = 0; i < 20; i++){
    //         let isMe = false;
    //         if(i % 2 === 0) {
    //             isMe = true;
    //         }
    //         const newMsg = {
    //             _id: `${i}`,
    //             author: `Author: ${i}`,
    //             body: `The body of message ${i}`,
    //             avatar: defaultImg,
    //             me: isMe,
    //             timing: '0:00'
    //         }
    //         store.addMessage(i, newMsg);

    //     }

    //     for (let c = 0; c<10; c++){
    //         const newChannel ={
    //             _id: `${c}`,
    //             title: `Channel title ${c}`,
    //             lastMessage: `Hey there is.. ${c}`,
    //             members: new OrderedMap({
    //                 '1': true,
    //                 '2': true,
    //             }),
    //             messages: new OrderedMap(),
    //             created: new Date(),
    //         }
    //         const moreMsgId =`${c + 1}`;
    //         const msgId = `${c}`;
    //         newChannel.messages = newChannel.messages.set(msgId, true);
    //         newChannel.messages = newChannel.messages.set(moreMsgId, true);
    //         store.addChannel(c, newChannel);
    //     }

    // }
    componentDidUpdate(){
        this.scrollMessagesToBottom();
        // console.log(this.state.isDark)
        // console.log("CDidUpdate");
       
    }
    componentDidMount(){
        const { store } = this.props;
        window.addEventListener('resize', this._onResi);
        window.addEventListener('mousedown', this.onClickOutSide);
        const theme = store.getThemeFromLocalStorage();
        this.updateTheme(theme);
        // this.addTestMessages();
        // console.log("CDidMount");
    }
    componentWillUnmount(){
        this.stopCheckingTyping()
        window.removeEventListener('resize', this._onResi);
        window.removeEventListener('mousedown', this.onClickOutSide);
        // console.log("CWillUnMount");
    }
    
    render() {

        const { height, newMessage, showEmoji, isShowGetAud, openToolChat, English, iShowConfig, redirect, isDark } = this.state;
        const { store } = this.props;
        const isConnected = store.isConnected();
        const activeChannel = store.getActiveChannel();
        const messages = store.getMessagesFromChannel(activeChannel);
        const members = store.getMembersFromChannel(activeChannel);
        const channels = store.getChannels();
        const usersList = store.getSearchUsers();
        const me = store.getCurrentUser();
      

        const onEmojiClick = (event, emojiObject) => {
            this.setState({newMessage:`${emojiObject.emoji}`});
            // console.log(`${emojiObject.emoji}`);
        }
       

        const style = {
            height: height,
        }
        
        const resultSearch = () => {

                return (
                    <div className="search-user">
                        <div className="user-list">
                        {usersList.map((user, index) =>{
                            return <div onClick={() => this.handleOnClick(user)} key={index} className="user">
                            <img src={`http://localhost:8080/${user.avatar}`} alt={user.name} />
                            <span>{user.name}</span>
                        </div>
                        })
                        } 
                        </div>
                    </div>
                )
        }
        if(redirect){
            return <Redirect to={"/page3/Facemoment/" 
            + this.state.idRoomChat
            + '?' + _.get(me, '_id') + this.getRandomInt(9)
        }/>
        }

        return (

            <div style={style} className="app3">
               <div className={className('chat-header', {'darkTheme': !isDark})}>
                    <div className="header-left">
                        <div className="action">
                            <Link to='' onClick={(e) => this._onCreateChannel(e)} className="btn-primary">AddNew</Link>
                        </div>
                    </div>
                    {_.get(activeChannel, 'isNew') ? <div className="toolbar">
                        <form className="tool">
                            <textarea
                            type="text"
                            value ={ this.state.searchUser }
                            placeholder="Name/ID/Email"
                            onChange = {(e) => {
                                const searchTxt = _.get(e, 'target.value');
                                this.setState({
                                    searchUser: searchTxt,
                                }, () => {
                                    store.startSearchUsers(searchTxt);
                                })
                            }}
                            />
                        </form>
                        {resultSearch()}
                        </div> : null }

                    <div className="header-mid">
                        { this.renderChannelTitle(activeChannel) }
                    </div>
                    <div className="header-right">
                        <UserBar store = { store } />
                        <div className="toolsRight-bar" >
                            <IconButton onClick={this.handleChangeTheme} style={{ color: "rgba(199, 119, 199, 0.9)"}}>
                                { !isDark ? <FaSun /> : <FaMoon />}
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div className='chat-main'>
                    <div className={className('sidebar-left', {'darkTheme': !isDark})}>
                        <div className="chanels">
                            {channels.map((channel, index) => {
                                return (
                                    <div onClick= {(index) => {
                                        store.setActiveChannelId(channel._id);
                                    }} key={channel._id} className={className('chanel', {'active' : _.get(activeChannel, '_id') === _.get(channel, '_id', null)})}>
                                        <div className="user-img">
                                            {this.renderChannelAvatar(channel)}
                                        </div>
                                        <div className={className('chanel-info',{'notify': _.get(channel, 'notify', null)})}>
                                            {this.renderChannelTitle(channel)}
                                            <p>{
                                            (( `${channel.lastMessage}`).substring(0, 7) === 'uploads') ? 'An Attached file'
                                            :
                                            `${channel.lastMessage}`
                                            }</p>
                                        </div>
                                    </div>
                                )
                            })}
                            
                        </div>
                    </div>
                    {
                        iShowConfig ?  <Draggable style={{
                            zIndex: 101,
                            position: 'absolute',
                            right: 0,
                            cursor: 'move',
                            maxHeight: '40rem',
                        }}>
                            <div className="conf-video">
                                 <ul className="form-container">
                                     <h4>
                                        Config Face Moment
                                     </h4>
                                     <form onSubmit={this.handleCreateRoom} >
                                     <li>
                                        <label htmlFor="text">
                                        ID Room
                                        </label>
                                        <input
                                        // onChange={(e) => this.onTxtfieldChange(e) } 
                                        placeholder="ndsRoom" 
                                        required="true" type="text" name="room"
                                        value ={ this.state.idRoomChat }
                                        onChange = {({target})=>{
                                            this.setState({ idRoomChat: target.value })
                                        }}
                                        id="room" ></input>
                                    </li>
                                    <li>
                                        <div onClick = {this.handleCreateR} className="autofill-ID">CreateRanDom</div>
                                    </li>
                                     </form>
                                    
                                    <div className="footer-conf-video">
                                       
                                        <button type="button"  onClick = { (e) => {this.setState({iShowConfig: false})}} className="login-btn">CANCEL</button>
                                        <button type="submit"  onClick = {this.handleCreateRoom} className="login-btn">CONTINUE</button>
                                         
                                    </div>

                                    <div>
                                        <h5>Instruction <SiConvertio onClick = {(e) => {this.setState({English: !English})}}/></h5>

                                        {English ?  <p>
                                            <li>Enter ID for the Face Moment room and choose continue</li>
                                            <li>Continue means you accept access we using your account registered with the system. And all are confidential.</li>
                                            <li>Make sure your friend knows <b>exactly</b> ID of the Face Moment room so they can re-enter and continue with it</li>
                                            <li>After choosing to continue, the browser will open a Face Moment window consisting of people who have joined by the room name Face Moment</li>
                                            <li style={{alignItems:'center'}}>To leave the Face Moment session you select the <CgCloseO /> icon, Face Moment will self-cancel when there is no member.</li>
                                            <li>Shouldn't leaving Face Moment <b>the wrong way</b> to avoid affecting the connection of the other people.</li>
                                            <span>ThankYou so much, according to nDs</span>
                                        </p>
                                        :
                                        <p>
                                            <li>Nhập ID phòng Face Moment và chọn tiếp tục</li>
                                            <li>Tiếp tục đồng nghĩa bạn chấp nhận truy cập dùng tài khoản của bạn đã đăng kí với hệ thống. Và tất cả đều được bảo mật.</li>
                                            <li>Đảm bảo rằng bạn của bạn biết <b>chính xác</b> ID của phòng Face Moment để họ có thể nhập lại và tiếp tục với nó</li>
                                            <li>Sau khi chọn tiếp tục trình duyệt sẽ mở cửa sổ Face Moment gồm những người đã tham gia bằng tên phòng Face Moment</li>
                                            <li style={{alignItems:'center'}}>Để rời khỏi phiên Face Moment bạn chọn vào biểu tượng <CgCloseO />, Face Moment sẽ tự huỷ khi không còn thành viên nào.</li>
                                            <li>Hạn chế rời khỏi Face Moment <b>sai cách</b> để tránh ảnh hưởng đến kết nối của những người còn lại.</li>
                                            <span>Cảm ơn mọi người, theo nDs</span>
                                        </p>
                                        }
                                       
                                        
                                    </div>
                                 </ul>
                            </div>
                        </Draggable>
                        : null
                    }
                   
                    <div className={className("chat-content", {'darkTheme': !isDark})}>
                    {   me ? <div className={className("toolChat", {'darkTheme': !isDark})}>
                            <div>
                                {!openToolChat ?  <IconButton style={{ color: "rgba(199, 119, 199, 0.9)"}} onClick = {()=>this.setState({openToolChat: !openToolChat})}><CgMoreVerticalAlt /></IconButton> : <div className="toolChats">
                                    <IconButton style={{ color: "rgba(199, 119, 199, 0.9)"}} onClick = {()=>this.setState({iShowConfig: !iShowConfig})}>
                                        <MdVideocam />
                                    </IconButton>
                                     <IconButton style={{ color: "rgba(199, 119, 199, 0.9)"}}>
                                    <Dropzone onDrop={this.onDrop}>
                                        {({getRootProps, getInputProps}) => (
                                            <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                    <CgSoftwareUpload />
                                            </div>
                                            </section>
                                        )}
                                    </Dropzone>
                                    </IconButton >
                                    <IconButton style={{ color: "rgba(199, 119, 199, 0.9)"}} onClick = {(e) => {this.setState({openToolChat: !openToolChat})}}>
                                        <MdNavigateNext  />
                                    </IconButton>
                                </div>
                                }
                            </div>
                           
                        </div>
                        : 
                        <div className={className("app-say", {'darkTheme': !isDark})}>
                            <h3>LOGIN to ACTIVE PAGE</h3>
                        </div>
                    }
                        
                        <div ref={(ref) => this.messagesRef = ref} className="messages">
                            { 
                                messages.map((mess, index) => { 
                                    const user = _.get(mess, 'user');
                                    return (
                                    <div key={index} className={`${mess.me ? 'message-me' : 'message'}`}>

                                    <img src={`http://localhost:8080/${_.get(user, 'avatar')}`} alt="user-img" className="img-user"></img>

                                    <div className="message-body">

                                        <div className="username">{`${mess.me ? 'You' : _.get(mess, 'user.name')}`} say: </div>
                                        
                                        <p className="message-text">
                                    
                                                { (mess.type === `text`) ? <p>{mess.body}</p>
                                                // this will be either video or image 
                                                :
                                                
                                                ((`${mess.body}`).substring((`${mess.body}`).length - 3, (`${mess.body}`).length) === 'mp3' ? 
                                        
                                                    <div className="audio-message" > <MdPlayCircleOutline style={{fontSize: '1.5rem', alignItems:'center'}} onClick= {() => this.handlePlayMusic(`http://localhost:8080/${mess.body}`)} /> Click to Play</div>
                                                    :
                                                    ((`${mess.body}`).substring((`${mess.body}`).length - 3, (`${mess.body}`).length) === 'mp4' ?
                                                        <video style={{ maxWidth: '20rem' }} src={`http://localhost:8080/${mess.body}`} alt="video" controls />
                                                        :
                                                        <img style={{ maxWidth: '20rem' }} src={`http://localhost:8080/${mess.body}`} alt="img" />
                                                    )
                                                    )
                                             } 
                                            {/* { this.renderMessage(mess) } */}
                                            <p className="timing"><Moment fromNow>{mess.created}</Moment></p>

                                        </p>
                                    </div>
                                    </div>
                                    );
                                   
                                })
                            }
                                {showEmoji ? <div className="emoji" ref = {(ref) => this.ref = ref}>
                                    <Picker  onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_DARK}/>
                                </div> : null }
                              
                                 
                        </div>
                        {
                        isShowGetAud ? <div className="getAdi">
                                <div>
                                {this.state.audio ? <AudioAnalyser audio={this.state.audio} /> : null}
                                </div>
                        </div> : null
                        }
                        
                        {_.get(activeChannel, 'typing') && _.get(activeChannel, 'typier') !== _.get(me, '_id') ? <div  disabled = { newMessage.length > 1 } className="typing-status">Is Typing..</div> : null}
                        {   members.size > 0 ? <div className="message-input">
                            <form 
                                onSubmit= { this.handleSubmit }
                                disabled = { newMessage.length < 1 }
                                className="message-form">
                                <IconButton style={{ color: "rgba(199, 119, 199, 0.9)"}} onClick = {() => {this.setState({showEmoji: !showEmoji})}}>
                                    <MdInsertEmoticon />
                                </IconButton>
                                <textarea  
                                    id = "message"
                                    ref={(input)=> this.input = input}
                                    type = "text"
                                    className = "form-control"
                                    value = { newMessage }
                                    autoComplete = {'off'}
                                    placeholder = "Type something interesting"
                                    onKeyUp = { (e) => { 
                                        { if(e.keyCode === 13 && !e.shiftKey) 
                                            { this.handleSubmit(e); }}
                                        { if( e.keyCode !== 13 ){ this.sendTyping() }}
                                        }
                                    }
                                    onChange = {
                                    	({target})=>{
                                    		this.setState({newMessage:target.value})
                                    	}
                                    }
                                    />

                                
                                            {/*onClick = {() => this.toggleMicrophone()} */}
                                        <IconButton style={{ color: "rgba(199, 119, 199, 0.9)"}} >
                                        <MdMic onMouseDown= {() => {this.startRecording()}} onMouseUp= {() => {this.stopRecording()}} />
                                        </IconButton>
                            
                                <button
                                    disabled = { newMessage.length < 1 }
                                    type = "submit"
                                    className = "send"
                                    onClick = { this.handleSubmit }
                                > Send </button>
                            </form>
			                </div>
                            :
                            null
                        }
                    </div>
                   
                    <div className={className("sidebar-right", {'darkTheme': !isDark})}>
                        <div className="title-right">Members</div>
                        <div className="chanels">
                            { members.map((member, index) => {

                                const isOnline = _.get(member, 'online', false);
                                return (
                                    <div key ={ index } className="chanel">

                                        <div className="user-img-channel">
                                            <img src={`http://localhost:8080/${_.get(member, 'avatar')}`} alt="user-img" />
                                            <span className={className('user-status', {'online': isOnline})}></span>
                                        </div>
                                        <div className="chanel-info">
                                            <h4>{ member.name }</h4>
                                            <p><Moment fromNow>2020-10-23T23:28:11.746Z</Moment></p>
                                        </div>
                                        <div onClick = {() => {
                                            store.removeMemberFromChannel(activeChannel, member);
                                        }}
                                         className="icon-DelUser">
                                        <IconButton  style={{ color: "rgb(200, 68, 20)", fontSize: "20"}}>
                                            <MdDeleteForever />
                                        </IconButton>
                                        </div>

                                    </div>
                                )
                            })}
                            
                        </div>
                        
                    </div>
                    

                </div>
                
               <div className={className("chat-footer", {'darkTheme': !isDark})}>
                    <div className="footer-left">
                        <div className="action">
                            {/* <Link to='' onClick={(e) => this._onCreateChannel(e)} className="btn-primary">AddNew</Link> */}
                        </div>
                    </div>
                
                    <div className="footer-mid">
                       <h4>AllRight nDs, 2020</h4>
                    </div>
                    <div className="footer-right">
                    {!me && !isConnected ? <div className="app-warning-state">Reconnecting..</div> : <div className="app-success-state">Connected</div>}
                    </div>
                </div>  
            </div>
        )
    }
}



