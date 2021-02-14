import { Button } from '@material-ui/core';
import React from 'react';
import {useState, useEffect} from 'react';
import {storage, db} from "./firebase";
import firebase from "firebase";
import './ImageUpload.css';


function ImageUpload({username}) {
    const [image, setImage]= useState('null');
    const [progress, setprogress]= useState('0');
    const [caption,setCaption]= useState('');

    const handleChange=(e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
           
            console.log(username);
        }
    };
    // console.log(image.name);

    const handleUpload = () =>{
        const uploadTask = storage.ref('images/'+image.name).put(image);
        console.log("uploading");
        uploadTask.on(
            "state_changed",
            (snapshot)=> {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setprogress(progress);
            },
              (error)=> {
                console.log(error);
                alert(error.message);
            },
            () => {
                storage
                  .ref("images")
                  .child(image.name)
                  .getDownloadURL()
                  .then(url => {
                      db.collection("posts").add({
                          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                          caption: caption,
                          imageUrl: url,
                          username: username
                      });
                      console.log(username)
                      console.log("uploaded");
                      setprogress(0);
                      setCaption("");
                      setImage(null);
                      
                  });
            }
        );

    };

    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100" />
            <input type="text" placeholder="Enter the caption...." onChange={event => setCaption(event.target.value)} value={caption}/>

            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload} >
              Upload
            </Button>
            
        </div>
    )
}

export default ImageUpload
