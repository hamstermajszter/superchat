import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCytXzG-R1TvG9Q1fKvACk7dJZ0keCoacg",
    authDomain: "superchat-cdc12.firebaseapp.com",
    databaseURL: "https://superchat-cdc12.firebaseio.com",
    projectId: "superchat-cdc12",
    storageBucket: "superchat-cdc12.appspot.com",
    messagingSenderId: "364248332122",
    appId: "1:364248332122:web:55adbe3c683b99be6fa563"

  });
}

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header>
        <SignOut/>
      </header>
      <section>
        <UserSearch />
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function UserSearch() {
  const usersRef = firestore.collection('users');
  const query = usersRef.orderBy('email');
  const [searchValue, setSearchValue] = useState('');
  const [privateChats, setPrivateChats] = useState([]);
  const [users, loading, error] = useCollectionData(query, {idField: 'id'});

  const openPrivateChat = (id) => {
    const chats = privateChats.slice();
    chats.push(id);
    setPrivateChats(chats)
  }

  const closePrivateChat = (id) => {
    setPrivateChats(privateChats.filter(chatPartner => id !== chatPartner));
  }
  
  return (
    <>
      <input value={searchValue} onChange={e => setSearchValue(e.target.value)}></input>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      {users && searchValue !== '' && users.filter(user => user.email.includes(searchValue)).map(user => <User key={user.id} user={user} onClick={() => openPrivateChat(user.id)}/>)}
      <div className="private-chats">{privateChats.length !== '0' && privateChats.map(chat => <PrivateChat key={chat} chatPartner={chat} close={() => closePrivateChat(chat)}/>)}</div>
    </>
  )
}

function PrivateChat(props) {
  const messagesRef = firestore.collection('privateMessages')
    .where('participants', 'in', [[props.chatPartner, auth.currentUser.uid]]);
    debugger
  messagesRef.get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      debugger
    })
  });
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages, loading, error] = useCollectionData(query, {idField: 'id'});

  return (
    <>
      <div className="private-chat">
        <div className="chat-header">
          <div className="partner-name">{props.chatPartner}</div>
          <div className="close" onClick={props.close}></div>
        </div>
        <div className="chat-content">
          {error && <strong>Error: {JSON.stringify(error)}</strong>}
          {loading && <span>Collection: Loading...</span>}
          {messages && messages.map(message => <Message key={message.id} message={message}/>)}
        </div>
      </div>

    </>
  )
}

function User(props) {
  const {email} = props.user
  return <p onClick={()=>props.onClick()}>{email}</p>;
}

function ChatRoom() {
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages, loading, error] = useCollectionData(query, {idField: 'id'})
  const [formValue, setFormValue] = useState('');

  const handleChange = async (e) => {
    e.preventDefault();
    const {uid} = auth.currentUser;

    await messagesRef.add({
      message: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid
    });

    setFormValue('');
  }

  return (
    <>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}
      {messages && messages.map(message => <Message key={message.id} message={message}/>)}
      <form onSubmit={handleChange}>
        <input value={formValue} onChange={e => setFormValue(e.target.value)}></input>
        <button type="submit">Send</button>
      </form>
    </>
  )
}

function Message(props) {
  const {message, uid} = props.message; 

  const className = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  return <p className={className}>{message} - from {uid}</p>
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut().then(() => {
      console.log('Signed out');
    }).catch(() => {
      console.log('Cannot be signed out');
    })}>Sign Out</button>
  )
}

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      console.log('Signed in with: ', user);
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  }
  
  return (
    <form onSubmit={login}>
      <input value={email} onChange={(event) => setEmail(event.target.value)}/>
      <input value={password} onChange={(event) => setPassword(event.target.value)}/>
      <input type="submit" value="Login" />
    </form>
  )
}

export default App;
