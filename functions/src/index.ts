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

exports.createPage = functions
  .runWith({
    timeoutSeconds: 540
  })
  .firestore.document('pages/{pageId}')
  .onCreate(
    async (snap, context): Promise<void> => {
      try {
        // const pageId = context.params.pageId
        const page = snap.data()
        const pageId = snap.id

        if (page) {
          if (page.ownerType === 'user') {
            const user = await db
              .collection('users')
              .doc(page.ownerId)
              .get()
            if (user.exists) {
              // 投稿を自分のタイムラインに追加
              await user.ref
                .collection('timeline')
                .doc(pageId)
                .set(page)

              // 投稿をフォロワーのタイムラインに追加
              const query = await user.ref.collection('followers').get()
              query.forEach(
                async (doc): Promise<void> => {
                  await db
                    .collection('users')
                    .doc(doc.id)
                    .collection('timeline')
                    .doc(pageId)
                    .set(page)
                }
              )
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  )

exports.updatePage = functions
  .runWith({
    timeoutSeconds: 540
  })
  .firestore.document('pages/{pageId}')
  .onUpdate(
    async (change, context): Promise<void> => {
      try {
        // const pageId = context.params.pageId
        const page = change.after.data()
        const pageId = change.after.id

        if (page) {
          if (page.ownerType === 'user') {
            const user = await db
              .collection('users')
              .doc(page.ownerId)
              .get()
            if (user.exists) {
              // 投稿を自分のタイムラインに更新
              await user.ref
                .collection('timeline')
                .doc(pageId)
                .update(page)

              // 投稿をフォロワーのタイムラインに更新
              const query = await user.ref.collection('followers').get()
              query.forEach(
                async (doc): Promise<void> => {
                  await db
                    .collection('users')
                    .doc(doc.id)
                    .collection('timeline')
                    .doc(pageId)
                    .update(page)
                }
              )
            }
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  )
