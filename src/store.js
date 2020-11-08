import { OrderedMap } from 'immutable';
import _ from 'lodash';
import Service from './service';
import Realtime from './realtime';
import moment from "moment";
import {ObjectID} from './helpers/objectid';


export default class Store {
    constructor(appComponent){
        this.app = appComponent;
        this.service = new Service();
        this.messages = new OrderedMap();
        this.channels = new OrderedMap();
        this.activeChannelId = null;

        this.user = this.getUserFromLocalStorage();
        this.token = this.getTokenFromLocalStorage();
        this.users = new OrderedMap();

        this.realtime = new Realtime(this);
        this.fetchUserChannels();
        this.search = {
            users: new OrderedMap(),
        }

    }

    upLoadfile(formData){
        const userToken = this.getUserTokenId();

        if(userToken){

            this.service.post('api/messages/uploadfiles', formData).then((res) => {

                console.log(res.data.success);
                if(!res.data.success){
                    console.log(res.data.error)
                }
                if (res.data.success) {
                    const messageId = new ObjectID().toString();
                    const channel = this.getActiveChannel();
                    const channelId = _.get(channel , '_id', null);
                    const currentUser = this.getCurrentUser();
                    const message = {
                        _id: messageId,
                        channelId: channelId,
                        body : res.data.url,
                        userId: _.get(currentUser, '_id'),
                        type:"VideoOrImage",
                        me: true,
                };
                this.addMessage(messageId, message);

            }
            }).catch((err) => {
                console.log("Send files Error: ", err);
            });
        }
    
       
    }
    fetchUserChannels(){
        const userToken =this.getUserTokenId();
        if(userToken){
            const options = {
                headers: {
                    authorization: userToken,
                }
            }
            this.service.get(`api/me/channels`, options).then((res) => {
                const channels = res.data;
                _.each(channels, (c) => {
                    this.realtime.onAddChannel(c);
                });

                const firstChannelId = _.get(channels, '[0]._id', null);
                this.fetchChannelMessages(firstChannelId);
            }).catch((err) => {

                console.log("An error fetch user channlels", err);
            })
        }
    }
    addUserToCache(user){
        user.avatar = this.loadUserAvatar(user);
        const id = _.toString(user._id);
        this.users = this.users.set(id, user);
        return user;
    }

    getUserTokenId(){
        return _.get(this.token, '_id', null);
    }
    loadUserAvatar(user){

            return `https://api.adorable.io/avatars/100/${user._id}.png`
       
    }
    startSearchUsers(q = ""){
        this.search.users = this.search.users.clear();
        //query to backend server and get list of users
        const data = {search : q};
        
        this.service.post('api/users/search', data).then((res) => {
            //list off users match
            const users = _.get(res, 'data', []);
            // console.log("Get from server: ", users);
            _.each(users, (user) => {
               //cache to this.users
               //add user to this.search.users
               user.avatar = this.loadUserAvatar(user);
               const userId = `${user._id}`;
               this.users = this.users.set(userId, user);
               this.search.users = this.search.users.set(userId, user);

           });
           this.update();

        }).catch((err) => {
            console.log(" searching error", err);
        }); 
    }


    setUserToken(accessToken){
        if(!accessToken){
            this.localStorage.removeItem('token');
            this.token = null;
            return;
        }
        this.token = accessToken;
        localStorage.setItem('token', JSON.stringify(accessToken));
    }
    clearCacheData(){
        this.channels = this.channels.clear();
        this.users = this.users.clear();
        this.messages = this.messages.clear();
    }
    signOut(){

        const userId = _.toString(_.get(this.user, '_id', null));
        //request server and logout this user
        const tokenId = _.get(this.token, '_id', null);

        const options = {
            headers : {
                authorization: tokenId
            }
        }
        this.service.get('api/user/logout', options);
        this.isConnected();
        this.user = null;
        localStorage.removeItem('me');
        localStorage.removeItem('token');
        if(userId){
            this.users = this.users.remove(userId);
        }
        this.clearCacheData();
        this.update();
    }

    getTokenFromLocalStorage(){

        if(this.token){
            return this.token;
        }

        let token = null;
        const data = localStorage.getItem('token');
        if(data){
            try{
                token = JSON.parse(data);
            }
            catch (err){
                console.log(err);
            }
            
        }
        return token;
    }

    getUserFromLocalStorage(){

        let user = null;
        const data = localStorage.getItem('me');
         try {
                user = JSON.parse(data);
         }
         catch(err) {
             console.log(err);
         }
         if(user){
            //connect to backend server verify this user
            const token = this.getTokenFromLocalStorage();
            const tokenId = _.get(token, '_id');
            const options = {
                headers: {
                    authorization: tokenId,
                }
            }
            
            this.service.get('api/users/me', options).then((res) => {
                //user login with token id
                const accessToken = res.data;
                const user = _.get(accessToken, 'user');

                this.setCurrentUser(user);
                this.setUserToken(accessToken);

            }).catch(err => {
                this.signOut();
            });
        }

         return user;
    }    
        
    
    setCurrentUser(user){
        user.avatar = this.loadUserAvatar(user);
        this.user = user;
        if(user){
            
            localStorage.setItem('me', JSON.stringify(user));
            //save to local store
            const userId =`${user._id}`;
            this.users = this.users.set(userId, user);

        }
        this.update();
    }

    register(user){
        return new Promise((resolve, reject) => {
            this.service.post('api/users', user).then((user) =>{
                console.log("Account Created ", user);
                return resolve(user);
            }).catch((err) => {

                return reject("An Error create your account!");
            })
        })

    }

    login(email = null, password = null){

        const userEmail = _.toLower(email);
        const user = {
            email: userEmail,
            password: password,
        }
        console.log("Logining with: ", user);

        return new Promise((resolve, reject) => {

            this.service.post('api/users/login', user).then((res) => {
                //that mean successful login
                const accessToken = _.get(res, 'data'); 
                const user = _.get(accessToken, 'user');

                this.setCurrentUser(user);
                this.setUserToken(accessToken);
                this.realtime.connect();

                // begin fetch user's channel
                this.fetchUserChannels();
                //Call to realtime and connect again to socket server with this user
                




            }).catch((err) => {
                
                const message = _.get(err, 'res.data.err.message', 'Login Error');
                return reject(message);
            })
        });
        // const _this = this;
        // return new Promise((resolve, reject) => {
        //     const user = users.find((user) => user.email === userEmail);
        //     if( user ) {
        //         _this.setCurrentUser(user);
        //     }
        //     return user ? resolve(user) : reject("User not found!")
        // });
    }

    addUserToChannel(channelId, userId) {
        const channel = this.channels.get(channelId);
        if(channel) {
            channel.members = channel.members.set(userId, true);
            this.channels = this.channels.set(channelId, channel);
            this.update();
        }
      
    }
    getSearchUsers(){
        // const keyword = _.toLower(search);

        // let searchItems = new OrderedMap();
        // const currentUser =this.getCurrentUser();
        // const currentUserId = _.get(currentUser, '_id');
       
        // if(_.trim(search).length){
        //    searchItems = users.filter((user) =>_.get(user, '_id') !== currentUserId && _.includes(_.toLower(_.get(user, 'name')), keyword));
        // }

        return this.search.users.valueSeq();
    }

    onCreateNewChannel(channel = {}){
        const channelId = _.get(channel, "_id");
        this.addChannel(channelId, channel );
        this.setActiveChannelId(channelId);
    
    }

    getCurrentUser(){
        return this.user;
    }

    fetchChannelMessages(channelId){

        let channel = this.channels.get(channelId);
            if( channel && !_.get(channel, 'isFetchMessages')){

                const token = _.get(this.token, '_id');
                const options = {
                    headers: {
                        authorization: token,
                    }
                }

                this.service.get(`api/channels/${channelId}/messages`, options).then((res) => {
                    channel.isFetchMessages = true;

                    const messages = res.data;
                
                    _.each(messages, (message) => {
                        this.realtime.onAddMessage(message);
                    });
                    this.channels = this.channels.set(channelId, channel);

                }).catch((err) => {
                    console.log("An error fetching channel 's messages", err);

                }
            )}
        }   
    

    isConnected(){
        return this.realtime.isConnected;
    }

    setActiveChannelId(id) {
        this.activeChannelId = id;
        this.fetchChannelMessages(id);
        this.update();
    }
    getActiveChannel(){
        const channel = this.activeChannelId ? this.channels.get(this.activeChannelId) : this.channels.first();
        return channel;
    }

    setMessage(message, notify = false){
        const id = _.toString(_.get(message, '_id'));
        this.messages = this.messages.set(id, message);
        const channelId = _.toString(message.channelId);
        const channel = this.channels.get(channelId);

        if (channel) {
            channel.messages = channel.messages.set(id, true);
            channel.lastMessage = _.get(message, 'body', '');
            channel.notify = notify;

            this.channels = this.channels.set(channelId, channel);
        } else {

            // fetch to the server with channel info
            this.service.get(`api/channels/${channelId}`).then((response) => {


                const channel = _.get(response, 'data');

                /*const users = _.get(channel, 'users');
                _.each(users, (user) => {

                    this.addUserToCache(user);
                });*/

                this.realtime.onAddChannel(channel);


            })
        }
        this.update();
    }

    addTyping(channel, typing = false){
        
        if(channel){
            const userId = `${_.get(this.user, '_id', null)}`;
            const channelId = _.get(channel, '_id');
            const obj = {
                channelId: channelId,
                payload: typing,
                typier: userId,
            }
            console.log("channel typing: ", channelId);
            this.realtime.send(
                {
                    action: 'typing_status',
                    payload: {obj},
                }
            );
        }
        this.update();
    }

    addMessage(id, message = {}){

        const user = this.getCurrentUser();
        message.user = user;
        this.messages = this.messages.set(id, message);
        //add new message to 
        const channelId = _.get(message, 'channelId');
        if(channelId){

            
            let channel = this.channels.get(channelId);

            channel.lastMessage = _.get(message, 'body', '');
            //now i send this channel to the server
            
           this.realtime.send(
               {
                    action: 'create_channel',
                    payload: channel,
                }
            );
            // send to the via websocket to create new message and notify other
            this.realtime.send(
                {
                    action: 'create_message',
                    payload: message,
                }
            );

            channel.messages = channel.messages.set(id, true);


            channel.isNew = false;
            this.channels = this.channels.set(channelId, channel);
        }
        this.update();
    }

    removeMemberFromChannel( channel = null, user = null){
        if(!channel || !user ){
            return;
        }
        const channelId = _.get(channel, '_id')
        const userId = _.get(user, '_id');
        channel.members = channel.members.remove(userId);
        this.channels = this.channels.set(channelId, channel);
        this.update();
    }

    getMessages(){
        return this.messages.valueSeq();
    }
    getMessagesFromChannel(channel){
        let messages = new OrderedMap();

        if(channel){
            channel.messages.forEach((value, key) => {

                const message = this.messages.get(key);
                messages = messages.set( key, message);
    
            });
        }
        return messages.valueSeq();
        
    }

    getMembersFromChannel(channel){
        let members = new OrderedMap();
        if(channel){
            channel.members.forEach((value, key) => {

                const userId = `${key}`
                const user = this.users.get(userId);
                // console.log("User from Channel: ", user);
                const loggedUser = this.getCurrentUser();
                if( _.get(loggedUser, '_id') !== _.get(user, '_id')){
                    members = members.set(key, user);
                   
                }
            });
               
        }
        return members.valueSeq();
    }


    addChannel(index, channel = {}){
        this.channels = this.channels.set(`${index}`, channel);
        // console.log(channel);
        // console.log("Mess get from server to client: ", channel);
        this.update();
    }

    getChannels(){
        this.channels = this.channels.sort((a, b) => a.updated - b.updated);
        return this.channels.valueSeq();
    }
    update(){
        this.app.forceUpdate();
    }
}

