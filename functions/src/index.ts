import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tools = require('firebase-tools')
admin.initializeApp(functions.config().firebase)
const storage = admin.storage()
const bucket = storage.bucket()

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
        const page = snap.data()
        const pageId = snap.id

        if (page && !page.isDraft) {
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
        const page = change.after.data()
        const pageId = change.after.id

        if (page && !page.isDraft) {
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
                .set(page)

              // 投稿をフォロワーのタイムラインに更新
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
        } else if (page && page.isDraft) {
          // 下書きの場合はタイムラインから削除
          if (page.ownerType === 'user') {
            const user = await db
              .collection('users')
              .doc(page.ownerId)
              .get()
            if (user.exists) {
              // 投稿を自分のタイムラインから削除
              await user.ref
                .collection('timeline')
                .doc(pageId)
                .delete()

              // 投稿をフォロワーのタイムラインから削除
              const query = await user.ref.collection('followers').get()
              query.forEach(
                async (doc): Promise<void> => {
                  await db
                    .collection('users')
                    .doc(doc.id)
                    .collection('timeline')
                    .doc(pageId)
                    .delete()
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

exports.deletePage = functions
  .runWith({
    timeoutSeconds: 540
  })
  .firestore.document('pages/{pageId}')
  .onDelete(
    async (snap, context): Promise<void> => {
      try {
        const page = snap.data()
        const pageId = snap.id

        if (page) {
          await tools.firestore.delete(`pages/${pageId}`, {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            yes: true,
            token: functions.config().api.token
          })

          if (page.ownerType === 'user') {
            const user = await db
              .collection('users')
              .doc(page.ownerId)
              .get()
            if (user.exists) {
              // 投稿を自分のタイムラインを削除
              await user.ref
                .collection('timeline')
                .doc(pageId)
                .delete()

              // 投稿をフォロワーのタイムラインを削除
              const query = await user.ref.collection('followers').get()
              query.forEach(
                async (doc): Promise<void> => {
                  await db
                    .collection('users')
                    .doc(doc.id)
                    .collection('timeline')
                    .doc(pageId)
                    .delete()
                }
              )
            }
            //ファイル削除
            await bucket.deleteFiles({
              prefix: `images/page/${pageId}`
            })
          }
        }
      } catch (e) {
        console.log(e)
      }
    }
  )

exports.withdrawUser = functions.auth.user().onDelete(
  async (user): Promise<void> => {
    try {
      await db
        .collection('users')
        .doc(user.uid)
        .delete()
    } catch (e) {
      console.log(e)
    }
  }
)

exports.deleteUser = functions
  .runWith({
    timeoutSeconds: 540
  })
  .firestore.document('users/{userId}')
  .onDelete(
    async (snap, context): Promise<void> => {
      try {
        const user = snap.data()
        const userId = snap.id

        if (user) {
          // 自分のページを全削除
          const pageQuery = await db
            .collection('pages')
            .where('ownerType', '==', 'user')
            .where('ownerId', '==', userId)
            .get()

          pageQuery.forEach(
            async (page): Promise<void> => {
              await tools.firestore.delete(`pages/${page.id}`, {
                project: process.env.GCLOUD_PROJECT,
                recursive: true,
                yes: true,
                token: functions.config().api.token
              })
            }
          )

          // フォロワーから自分を削除
          const followerQuery = await snap.ref
            .collection('followingUsers')
            .get()
          followerQuery.forEach(
            async (follower): Promise<void> => {
              await db
                .collection('users')
                .doc(follower.id)
                .collection('followers')
                .doc(userId)
                .delete()
            }
          )

          // 自分のサブコレクションを全削除
          await tools.firestore.delete(`users/${userId}`, {
            project: process.env.GCLOUD_PROJECT,
            recursive: true,
            yes: true,
            token: functions.config().api.token
          })

          //ファイル削除
          await bucket.deleteFiles({
            prefix: `images/user/${userId}`
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  )

exports.followUser = functions
  .runWith({
    timeoutSeconds: 540
  })
  .firestore.document('users/{userId}/followingUsers/{followingId}')
  .onCreate(
    async (snap, context): Promise<void> => {
      try {
        // フォローした相手のフォロワーに追加する
        await db
          .collection('users')
          .doc(context.params.followingId)
          .collection('followers')
          .doc(context.params.userId)
          .set({ id: context.params.userId })
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
    async (snap, context): Promise<void> => {
      try {
        // フォロー解除した相手のフォロワーから削除する
        await db
          .collection('users')
          .doc(context.params.followingId)
          .collection('followers')
          .doc(context.params.userId)
          .delete()
      } catch (e) {
        console.log(e)
      }
    }
  )
