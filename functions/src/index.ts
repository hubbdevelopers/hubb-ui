import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

exports.followUser = functions
  .runWith({
    timeoutSeconds: 540
  })
  .firestore.document('users/{userId}/followingUsers/{followingId}')
  .onCreate(
    // フォローユーザーのページ全てをタイムラインに投入する
    async (snap, context): Promise<void> => {
      try {
        const timelineRef = db
          .collection('users')
          .doc(context.params.userId)
          .collection('timeline')

        const query = await db
          .collection('pages')
          .where('ownerId', '==', context.params.followingId)
          .where('ownerType', '==', 'user')
          .get()

        query.docs.forEach(
          (doc): void => {
            timelineRef.doc(doc.id).set(doc.data())
          }
        )
      } catch (e) {
        console.log(e)
      }
    }
  )

exports.unfollowUser = functions
  .runWith({
    timeoutSeconds: 540
  })
  .firestore.document('users/{userId}/followingUsers/{followingId}')
  .onDelete(
    // フォローユーザーのページ全てをタイムラインから削除する
    async (snap, context): Promise<void> => {
      try {
        const timelineQuery = await db
          .collection('users')
          .doc(context.params.userId)
          .collection('timeline')
          .where('ownerId', '==', context.params.followingId)
          .get()

        timelineQuery.forEach(
          (doc): void => {
            doc.ref.delete()
          }
        )
      } catch (e) {
        console.log(e)
      }
    }
  )
