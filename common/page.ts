import firebase from 'firebase'
import { TimeStamp } from 'firebase/firebase-firestore'
const db = firebase.firestore()

export interface Page {
  id: string
  data: PageData
}

export interface PageData {
  name: string
  ownerType: string
  ownerId: string
  content: string
  isDraft: boolean
  image: string
  likedBy: string[]
  createdAt: TimeStamp
}

export const blankPage = {
  id: '',
  data: {
    name: '',
    ownerType: '',
    ownerId: '',
    content: '',
    isDraft: true,
    image: '',
    likedBy: [],
    createdAt: null
  }
}

export async function getPages(
  ownerId: string,
  ownertType: string
): Promise<Page[]> {
  try {
    const query = await db
      .collection('pages')
      .where('isDraft', '==', false)
      .where('ownerType', '==', ownertType)
      .where('ownerId', '==', ownerId)
      .get()
    if (query.size > 0) {
      return query.docs.map(
        (doc): Page => {
          return { id: doc.id, data: doc.data() as PageData }
        }
      )
    }
    return []
  } catch (e) {
    console.log(e)
    return []
  }
}

export async function getPage(id: string): Promise<Page> {
  try {
    const doc = await db
      .collection('pages')
      .doc(id)
      .get()
    if (doc.exists) {
      return { id: doc.id, data: doc.data() as PageData }
    }
    return blankPage
  } catch (e) {
    console.log(e)
    return blankPage
  }
}
