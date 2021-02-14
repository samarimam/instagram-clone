import React from 'react';
import './App.css';
import Post from './Post';
import {useState, useEffect} from 'react';
import {db,auth, storage} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import firebase from "firebase";
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPosts]= useState([]);
  const [open, setOpen] = useState(false);
  const [username, setusername]= useState('');
  const [openSignIn, setOpenSignIn]=useState(false);
  const [password, setpassword]= useState('');
  const [email, setemail]= useState('');
  const [user, setUser]= useState(null);

  useEffect(() => {
    const unsubscribe= auth.onAuthStateChanged((authuser)=>{
      if(authuser) {
        // hdhede
        console.log(authuser);
        setUser(authuser);
       
      } else {
        setUser(null);
        // wojid
      }
    })
    return () =>{
      unsubscribe();
        }
  },[user, username]);


  useEffect(()=> {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp= (event) =>{
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authuser) =>{
      authuser.user.updateProfile({
        displayName: username
      })
    }
    )
    .catch((error) => alert(error.message));
  }

  const signIn=(event)=> {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))
    
    setOpenSignIn(false);

  }

return (
  <div className="app">
    
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
                  <center> 
                    <img 
                      className="app__headerImage"
                      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                      alt="instagram"
                    />
                  </center>
                  <input 
                      type="text"
                      placeholder="username" 
                      value={username}
                      onChange={(e) =>setusername(e.target.value)}
                  />
                  <input 
                      type="email"
                      placeholder="email" 
                      value={email}
                      onChange={(e) =>setemail(e.target.value)}
                  />
                  <input 
                      type="password"
                      placeholder="password" 
                      value={password}
                      onChange={(e) =>setpassword(e.target.value)}
                  />
                    <Button onClick={signUp}>Sign up</Button>
          </form> 
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
                  <center> 
                    <img 
                      className="app__headerImage"
                      src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                      alt="instagram"
                    />
                  </center>
                  
                  <input 
                      type="email"
                      placeholder="email" 
                      value={email}
                      onChange={(e) =>setemail(e.target.value)}
                  />
                  <input 
                      type="password"
                      placeholder="password" 
                      value={password}
                      onChange={(e) =>setpassword(e.target.value)}
                  />
                    <Button onClick={signIn}>Sign In</Button>
          </form> 
        </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt="instagram"
        />
      
        {user ? (
          <Button onClick={()=> auth.signOut()}>Logout</Button>
        ):(
          <div className="app__loginContainer">
            <Button type="submit" onClick={()=> setOpenSignIn(true)}>Sign In</Button>
            <Button type="submit" onClick={()=> setOpen(true)}>SignUp</Button>
          </ div>
        )}
      </div>
     
     
    <div className="app__posts">
      <div className="app__postsLeft">
      {
        posts.map(({id, post})=>(
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
      </div>
      <div className="app__postsRight">
       <InstagramEmbed
        url='https://www.instagram.com/p/CCSt6i1MtvA/?utm_source=ig_embed'
        // url='https://www.instagram.com/p/CF7NijdFbRO/?utm_source=ig_embed'
        maxWidth={320}
        hideCaption={false}
        containerTagName='div'
        protocol=''
        injectScript
        onLoading={() => {}}
        onSuccess={() => {}}
        onAfterRender={() => {}}
        onFailure={() => {}}
       />
       {user?.displayName ? (
      <ImageUpload username={user.displayName} />
    ): (
      <h3>sorry you need to login to upload</h3>
    )}
      </div>

    </div>


   
     
 
 
    

    </div>
  );
}

export default App;
