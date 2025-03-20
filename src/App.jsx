import { useState, useEffect, useRef } from "react";
import { auth, firestore, analytics } from "./firebase";
import { GoogleAuthProvider, signOut, signInWithPopup } from "firebase/auth";
import { collection, query, orderBy, addDoc, serverTimestamp, limitToLast } from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };
  return <button
    onClick={signInWithGoogle}
    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded m-4"
  >Sign in with Google</button>;
}

function SignOut() {
  return auth.currentUser && (
    <button
      onClick={() => signOut(auth)}
      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded ml-2 text-base"
    >
      Sign Out
    </button>);
}

function ChatMessage({ message }) {
  const { text, uid, photoURL } = message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`flex items-center p-2 bg-gray-100 rounded-sm ${messageClass === "sent" ? "justify-end" : "justify-start"}`}>
      {messageClass === "received" && (
        <img src={photoURL} alt="profile" className="w-10 h-10 rounded-full mx-2" />
      )}
      <p className="bg-white px-4 py-2 rounded-full shadow">{text}</p>
      {messageClass === "sent" && (
        <img src={photoURL} alt="profile" className="w-10 h-10 rounded-full mx-2" />
      )}
    </div>
  );
}

function ChatRoom() {
  const messageRef = collection(firestore, "messages");
  const q = query(messageRef, orderBy("createdAt"), limitToLast(50));
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
      <div className="flex-1 overflow-y-auto p-4">
        {messages && messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
        <div ref={dummy} />
      </div>
      <form
        onSubmit={sendMessage}
        className="flex p-4 border-t bg-gray-50"
      >
        <input
          className="flex-1 p-2 border bg-slate-700 rounded mr-2 text-white"
          type="text"
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded">
          Send
        </button>
      </form>
    </>
  )
}

function App() {
  const [user] = useAuthState(auth); // if signed in user is returned else null

  return (
    <>
      <h1 className="flex items-center justify-center text-2xl sm:text-4xl font-bold my-5">
        Chatty <SignOut />
      </h1>
      <section className="flex flex-col h-[80vh] max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </>
  );
}

export default App;
