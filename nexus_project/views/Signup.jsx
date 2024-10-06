import { useState } from 'react';
import { db, auth, GoogleProvider } from '../config/firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, setDoc, doc } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import '../styles/signup.css';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

function Signup() {
  // Using AuthContext to maintain user authentication state across multiple components
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const usersCollectionRef = collection(db, "users");

  const signUp = async () => {
    try {
      if(password === repeatPassword) {
        await createUserWithEmailAndPassword(auth, email, password).then(cred => {
          return setDoc(doc(usersCollectionRef, cred.user.uid), {
            email: email,
            registrationDate: new Date()
          });
        });
        window.location.href = '/';
      } else {
        alert(`Passwords don't match`)
      }
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        alert('Invalid email.');
      } else if (err.code === 'auth/missing-password') {
        alert('Missing password.');
      } else if (err.code === 'auth/weak-password') {
        alert('Weak password, should be at least 6 characters.');
      } else if (err.code === 'auth/email-already-in-use') {
        alert('Email already in use.');
      } else {
        console.log(err.code)
        console.log('Error signing in:', err.message);
      }
    };
  };

  const signUpWithGoogle = async () => {
    try {
      await signInWithPopup(auth, GoogleProvider).then(cred => {
        const userDocRef = doc(usersCollectionRef, cred.user.uid);
        return setDoc(userDocRef, {
          email: cred.user.email,
          registrationDate: new Date()
        }).then(() => {
          console.log("Document successfully written:", userDocRef.id);
        });
      });
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className='signup-container'>
        <br />
        {!user ? (
          <>
              <h2>Login back to our fabulous website!</h2>
              <br />
              <p>You can use your e-mail or your Google account</p>
              <br />
              <div>
                <p>E-mail</p>
                <input
                  type="text"
                  id="email"
                  placeholder="E-mail..." 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br />
              <div>
                <p>Password</p>
                <input
                  type="password"
                  id="password"
                  placeholder="Password..." 
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <br />
              <div>
                <p>Repeat Password</p>
                <input
                  type="password"
                  id="repeatPassword"
                  placeholder="Repeat password..." 
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              <br />
              <button onClick={signUp}>Signup</button>
              <br /><br />
              <button onClick={signUpWithGoogle}>Login with Google</button>
              <br /><br />
              <button onClick={() => window.location.href = '/login'}>Already have an account? Login!</button>
          </>
        ) : <p>User already logged in</p>}
        <br /><br /><br />
      </div>
      <Footer />
    </>
  );
}

export default Signup;
