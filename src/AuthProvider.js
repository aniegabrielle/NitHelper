import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from './utils/firebase'
import {
	signInWithEmailAndPassword,
	signOut as logoff,
	createUserWithEmailAndPassword
} from "firebase/auth";
import { child, ref, get } from "firebase/database";

export const AuthContext = createContext()

export function useAuth() {
	return useContext(AuthContext)
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState()
	const [loading, setLoading] = useState(true)

	function login(email, password) {
		return signInWithEmailAndPassword(email, password)
	}

	function signOut() {
		return logoff();
	}

	function signUp(email, password) {
		return createUserWithEmailAndPassword(auth, email, password)
	}

	function getUser() {
		get(child(ref(db), `users/${auth.currentUser.uid}`)).then((snapshot) => {
			if (snapshot.exists()) {
				return snapshot.val();
			} else {
				return auth.currentUser
			}
		}).catch((error) => {
			console.error(error);
		});
	}

	//   function isAdmin() {
	//     return auth.currentUser.getIdTokenResult()
	//     .then((idTokenResult) => {
	//       if (!!idTokenResult.claims.admin) {
	//         return true
	//       } else {
	//         return false
	//       }
	//     })
	//   }

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			setCurrentUser(user)
			setLoading(false)
		})

		return unsubscribe
	}, [])

	const value = {
		currentUser,
		getUser,
		login,
		signOut,
		signUp
	}

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	)

}