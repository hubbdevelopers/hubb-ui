import firebase, { database } from 'firebase'
import { TimeStamp } from 'firebase/firebase-firestore'
const db = firebase.firestore()

export interface Page {
  id: string
  data: PageData
  likedBy: string[]
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
  },
  likedBy: []
}

export async function getPages(
  ownerId: string,
  ownertType: string,
  isOwner: boolean
): Promise<Page[]> {
  try {
    if (isOwner) {
      const query = await db
        .collection('pages')
        .where('ownerType', '==', ownertType)
        .where('ownerId', '==', ownerId)
        .get()

      return query.docs.map(
        (doc): Page => {
          const temp = Object.assign({}, blankPage.data)
          return {
            id: doc.id,
            likedBy: [],
            data: Object.assign(temp, doc.data())
          }
        }
      )
    } else {
      const query = await db
        .collection('pages')
        .where('isDraft', '==', false)
        .where('ownerType', '==', ownertType)
        .where('ownerId', '==', ownerId)
        .get()

      if (query.size > 0) {
        return query.docs.map(
          (doc): Page => {
            const temp = Object.assign({}, blankPage.data)
            return {
              id: doc.id,
              data: Object.assign(temp, doc.data()),
              likedBy: []
            }
          }
        )
      }
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
      let likedBy: string[] = []
      const likedByDoc = await doc.ref
        .collection('likes')
        .doc('DATA')
        .get()

      if (likedByDoc.exists) {
        const data = likedByDoc.data()
        if (data) {
          likedBy = data.likedBy
        }
      }
      const temp = Object.assign({}, blankPage.data)
      return {
        likedBy: likedBy,
        id: doc.id,
        data: Object.assign(temp, doc.data())
      }
    }
    return blankPage
  } catch (e) {
    console.log(e)
    return blankPage
  }
}
