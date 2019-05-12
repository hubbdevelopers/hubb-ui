import firebase from 'firebase'
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
  createdAt: TimeStamp
  updatedAt: TimeStamp
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
    createdAt: null,
    updatedAt: null
  },
  likedBy: []
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
        .orderBy('createdAt', 'desc')
        .get()

      const pageIds: string[] = query.docs.map(
        (doc): string => {
          return doc.id
        }
      )

      const pages: Page[] = []
      pageIds.forEach(
        async (id): Promise<void> => {
          pages.push(await getPage(id))
        }
      )

      return pages
    } else {
      const query = await db
        .collection('pages')
        .where('isDraft', '==', false)
        .where('ownerType', '==', ownertType)
        .where('ownerId', '==', ownerId)
        .orderBy('createdAt', 'desc')
        .get()

      const pageIds: string[] = query.docs.map(
        (doc): string => {
          return doc.id
        }
      )

      const pages: Page[] = []
      pageIds.forEach(
        async (id): Promise<void> => {
          pages.push(await getPage(id))
        }
      )

      return pages
    }
  } catch (e) {
    console.log(e)
    return []
  }
}

export async function getNotLoginTimeline(): Promise<Page[]> {
  try {
    const query = await db
      .collection('pages')
      .where('isDraft', '==', false)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get()

    const pageIds: string[] = query.docs.map(
      (doc): string => {
        return doc.id
      }
    )

    const pages: Page[] = []
    pageIds.forEach(
      async (id): Promise<void> => {
        pages.push(await getPage(id))
      }
    )

    return pages
  } catch (e) {
    console.log(e)
    return []
  }
}
