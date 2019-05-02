import firebase from 'firebase'
import { TimeStamp } from 'firebase/firebase-firestore'
const db = firebase.firestore()

export interface Comment {
  id: string
  data: CommentData
}

export interface CommentData {
  userId: string
  pageId: string
  text: string
  createdAt: TimeStamp
}

export const blankComment = {
  id: '',
  data: {
    userId: '',
    pageId: '',
    text: '',
    createdAt: null
  }
}

export async function getCommentsByPageId(pageId: string): Promise<Comment[]> {
  try {
    const query = await db
      .collection('pages')
      .doc(pageId)
      .collection('comments')
      .get()

    if (query.size > 0) {
      return query.docs.map(
        (doc): Comment => {
          const data = doc.data()
          data.pageId = pageId
          const temp = Object.assign({}, blankComment.data)
          return {
            id: doc.id,
            data: Object.assign(temp, data)
          }
        }
      )
    }
    return []
  } catch (e) {
    console.log(e)
    return []
  }
}
