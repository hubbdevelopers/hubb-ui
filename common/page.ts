import { db } from '~/plugins/firebase'

export interface Page {
  id: string
  data: PageData
  likedBy: string[]
}

export interface PageData {
  name: string
  pageType: string
  userId: string
  content: string
  isDraft: boolean
  image: string
  createdAt: string
  updatedAt: string
}

export const blankPage = {
  id: '',
  data: {
    name: '',
    pageType: '',
    userId: '',
    content: '',
    isDraft: true,
    image: '',
    createdAt: '',
    updatedAt: ''
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
        .collection('liked')
        .doc('DATA')
        .get()

      if (likedByDoc.exists) {
        const data = likedByDoc.data()
        if (data) {
          likedBy = data.likedBy
        }
      }
      const data = doc.data()
      if (data) {
        data.createdAt = data.createdAt.toDate()
        data.updatedAt = data.updatedAt.toDate()
      }

      const temp = Object.assign({}, blankPage.data)
      const ret = {
        likedBy: likedBy,
        id: doc.id,
        data: Object.assign(temp, data)
      }

      return ret
    }
    return blankPage
  } catch (e) {
    console.log(e)
    return blankPage
  }
}

export async function getPages(
  userId: string,
  ownertType: string,
  isOwner: boolean
): Promise<Page[]> {
  try {
    if (isOwner) {
      const query = await db
        .collection('pages')
        .where('pageType', '==', ownertType)
        .where('userId', '==', userId)
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
        .where('pageType', '==', ownertType)
        .where('userId', '==', userId)
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
