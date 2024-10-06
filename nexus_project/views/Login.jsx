import { useState } from 'react';
import { db, auth, GoogleProvider } from '../config/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { collection, setDoc, getDoc, doc } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import '../styles/signup.css';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

function Login() {
  // Using AuthContext to maintain user authentication state across multiple components
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const usersCollectionRef = collection(db, "users");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/';
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        alert('User not found.');
      } else if (err.code === 'auth/wrong-password') {
        alert('Invalid password.');
      } else if (err.code === 'auth/invalid-email') {
        alert('Invalid email.');
      } else if (err.code === 'auth/invalid-login-credentials') {
        alert('Invalid email or password.');
      } else if (err.code === 'auth/missing-password') {
        alert('Missing password.');
      } else {
        console.log(err.code)
        console.log('Error signing in:', err.message);
      }
    }
  };

  const loginWithGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, GoogleProvider);
      // Check if the user already exists in the database
      const userDoc = doc(usersCollectionRef, cred.user.uid);
      const docSnap = await getDoc(userDoc);
      if (!docSnap.exists()) {
        // If not, add the user to the database
        await setDoc(userDoc, {
          email: cred.user.email,
          registrationDate: new Date()
        });
      }
      window.location.href='/';
    } catch (err) {
      console.log(err);
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
            <p>You can use your email or your Google account</p>
            <br />
            <div>
              <p>Email</p>
              <input
                type="text"
                id="email"
                placeholder="Email..." 
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
            <button onClick={login}>Login</button>
            <br /><br />
            <button onClick={loginWithGoogle}>Login with Google</button>
            <br /><br />
            <button onClick={() => window.location.href = '/signup'}>Don't have an account? Sign up!</button>
          </>
        ) : <p>User already logged in</p>}
          <br /><br /><br />
        </div>
      <Footer />
    </>
  );  
}

export default Login;
