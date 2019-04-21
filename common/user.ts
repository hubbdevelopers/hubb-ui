import firebase from 'firebase'
import { User, UserData } from '~/types/user'
const db = firebase.firestore()

export async function getUser(uid: string): Promise<User | undefined> {
  try {
    const doc = await db
      .collection('users')
      .doc(uid)
      .get()

    if (doc.exists) {
      const user: User = { uid: uid, data: doc.data() as UserData }
      return user
    }
  } catch (e) {
    console.log(e)
  }
}
