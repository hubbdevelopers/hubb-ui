import firebase from 'firebase'
import { TimeStamp } from 'firebase/firebase-firestore'
const db = firebase.firestore()

export interface User {
  id: string
  data: UserData
  followingUsers: FollowUser[]
  followers: FollowUser[]
}

export interface UserData {
  accountId: string
  name: string
  image: string
  likePages: string[]
  createdAt: TimeStamp
}

export interface FollowUser {
  id: string
}

export const blankUser = {
  id: '',
  followingUsers: [],
  followers: [],
  data: {
    accountId: '',
    name: '',
    image: '',
    likePages: [],
    createdAt: null
  }
}

export async function getUser(id: string): Promise<User> {
  try {
    const followingUsersQuery = await db
      .collection('users')
      .doc(id)
      .collection('followingUsers')
      .get()

    const followingUsers: FollowUser[] = followingUsersQuery.docs.map(
      (doc): FollowUser => {
        return doc.data() as FollowUser
      }
    )

    const followersQuery = await db
      .collection('users')
      .doc(id)
      .collection('followers')
      .get()

    const followers: FollowUser[] = followersQuery.docs.map(
      (doc): FollowUser => {
        return doc.data() as FollowUser
      }
    )
    const doc = await db
      .collection('users')
      .doc(id)
      .get()

    if (doc.exists) {
      const user: User = {
        id: id,
        data: doc.data() as UserData,
        followers: followers,
        followingUsers: followingUsers
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
        if (doc.exists) {
          users.push({
            id: doc.id,
            data: doc.data() as UserData,
            followers: [], // TODO
            followingUsers: [] // TODO
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
