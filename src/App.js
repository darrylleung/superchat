import React, { useState, useRef, useEffect } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBt0U-i28ICK19JlT91_630DgDoaM_1eRw",
    authDomain: "darryl-firechat-desktop.firebaseapp.com",
    projectId: "darryl-firechat-desktop",
    storageBucket: "darryl-firechat-desktop.appspot.com",
    messagingSenderId: "535799585334",
    appId: "1:535799585334:web:3de620e7d85fd274479697",
    measurementId: "G-HH8BGQJ9PW",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
    const [user] = useAuthState(auth);

    return (
        <div className="App">
            <header>
                <h1>Firebase Chat 🔥</h1>
                <SignOut />
            </header>
            <section>{user ? <ChatRoom /> : <SignIn />}</section>
        </div>
    );
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    };

    return (
        <button class="sign-in" onClick={signInWithGoogle}>
            <span>Sign in with </span>
            <span className="google-g">G</span>
            <span className="google-o">o</span>
            <span className="google-o2">o</span>
            <span className="google-g">g</span>
            <span className="google-l">l</span>
            <span className="google-e">e</span>
        </button>
    );
}

function SignOut() {
    return (
        auth.currentUser && (
            <button onClick={() => auth.signOut()}>Sign Out</button>
        )
    );
}

function ChatRoom() {
    const dummy = useRef();
    const messagesRef = firestore.collection("messages");
    const query = messagesRef.orderBy("createdAt").limitToLast(25);

    const [messages] = useCollectionData(query, { idField: "id" });

    const [formValue, setFormValue] = useState("");

    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL,
        });

        setFormValue("");
    };

    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <main>
                {messages &&
                    messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}

                <span ref={dummy}></span>
            </main>

            <form onSubmit={sendMessage}>
                <input
                    value={formValue}
                    placeholder="Send a message..."
                    onChange={(e) => setFormValue(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={
                        !formValue ||
                        formValue.replace(/^\s+/, "").replace(/\s+$/, "") === ""
                    }
                >
                    Send
                </button>
            </form>
        </>
    );
}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;

    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

    return (
        <div className={`message ${messageClass}`}>
            <img src={photoURL} alt="" />
            <p>{text}</p>
        </div>
    );
}

export default App;
