import firebase from 'firebase'
const db = firebase.firestore()

export interface User {
  id: string
  data: UserData
}

export interface UserData {
  accountId: string
  name: string
  image: string
  followingUsers: string[]
  followers: string[]
  likes: string[]
  createdAt: string
  updatedAt: string
}

export const blankUser = {
  id: '',
  data: {
    accountId: '',
    name: '',
    image: '',
    followingUsers: [],
    followers: [],
    likes: [],
    createdAt: '',
    updatedAt: ''
  }
}

export function getBlankUser(): User {
  return blankUser
}

export async function getUser(id: string): Promise<User> {
  try {
    const doc = await db
      .collection('users')
      .doc(id)
      .get()

    if (doc.exists) {
      const data = doc.data()
      if (data) {
        // data.createdAt = data.createdAt.toDate()
        data.updatedAt = data.updatedAt.toDate()
      }
      const temp = Object.assign({}, blankUser.data)
      const user: User = {
        id: id,
        data: Object.assign(temp, data)
      }
      return user
    }
    return blankUser
  } catch (e) {
    console.log(e)
    return blankUser
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const collection = await db.collection('users').get()

    const users: User[] = []

    collection.forEach(
      (doc): void => {
        const temp = Object.assign({}, blankUser.data)
        if (doc.exists) {
          users.push({
            id: doc.id,
            data: Object.assign(temp, doc.data())
          })
        }
      }
    )
    return users
  } catch (e) {
    console.log(e)
    return []
  }
}
