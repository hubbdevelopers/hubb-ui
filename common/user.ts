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
  followingCount: number
  followerCount: number
  likeCount: number
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
    followingCount: 0,
    followerCount: 0,
    likeCount: 0,
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
      const temp = Object.assign({}, blankUser.data)
      const user: User = {
        id: id,
        data: Object.assign(temp, doc.data()),
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
        const temp = Object.assign({}, blankUser.data)
        if (doc.exists) {
          users.push({
            id: doc.id,
            data: Object.assign(temp, doc.data()),
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
