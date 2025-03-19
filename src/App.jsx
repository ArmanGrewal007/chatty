import { useState, useEffect, useRef } from "react";
import { auth, firestore, analytics } from "./firebase";
import { GoogleAuthProvider, signOut, signInWithPopup } from "firebase/auth";
import { collection, query, orderBy, limit, addDoc, serverTimestamp } from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./App.css";

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}

function SignOut() {
  return auth.currentUser && <button onClick={() => signOut(auth)}>Sign Out</button>;
}

function ChatMessage({ message }) {
  const { text, uid, photoURL } = message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt="profile" />
      <p>{text}</p>
    </div>
  );
}

function ChatRoom() {
  const messageRef = collection(firestore, "messages");
  const q = query(messageRef, orderBy("createdAt"), limit(25));
  const [messages] = useCollectionData(q, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const dummy = useRef();

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await addDoc(messageRef, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <div>
        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy}/>
      </div>
      <form onSubmit={sendMessage}>
        <input type="text" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </>
  )
}

function App() {
  const [user] = useAuthState(auth); // if signed in user is returned else null

  return (
    <>
      <h1 className="text-2xl sm:text-4xl font-bold my-5 text-center">
        Chatty -- <SignOut />
      </h1>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </>
  );
}

export default App;
