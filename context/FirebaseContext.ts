import firebase from "firebase/app"
import { createContext } from "react"

export const FirebaseContext = createContext<{
  firestore: firebase.firestore.Firestore
  auth: firebase.auth.Auth
}>({
  firestore: {} as any,
  auth: {} as any,
})
