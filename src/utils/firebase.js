import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "@firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyARi1JTg0dUA39xzOmfTk4HPqhGJoLQjgo",
	authDomain: "projeto-firebase-maria-mussi.firebaseapp.com",
	databaseURL:
		"https://projeto-firebase-maria-mussi-default-rtdb.firebaseio.com",
	projectId: "projeto-firebase-maria-mussi",
	storageBucket: "projeto-firebase-maria-mussi.appspot.com",
	messagingSenderId: "988949529748",
	appId: "1:988949529748:web:dbccb6afc5bf5674ab2081",
	measurementId: "G-FXN289YQG4",
};

export const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
