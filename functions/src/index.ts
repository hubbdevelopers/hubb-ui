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
  .firestore.document('users/{userId}/follows/{id}')
  .onCreate(
    async (snap, context): Promise<void> => {
      try {
        console.log('followUser', snap, context.params.id)
        const data = snap.data()

        if (data) {
          // フォローユーザーのページ全てをタイムラインに投入する
          const timelineRef = db
            .collection('users')
            .doc(data.from)
            .collection('timeline')

          const query = await db
            .collection('pages')
            .where('ownerId', '==', data.to)
            .where('ownerType', '==', 'user')
            .get()

          query.docs.forEach(
            async (doc): Promise<void> => {
              const data = doc.data()
              if (!data.isDraft) {
                await timelineRef.doc(doc.id).set(data)
              }
            }
          )

          // Userドキュメントにフォロー情報を追加
          await db
            .collection('users')
            .doc(data.from)
            .update({
              followings: admin.firestore.FieldValue.arrayUnion(data.to)
            })

          // フォローした相手のフォロワー数をインクリメントする
          await db
            .collection('users')
            .doc(data.to)
            .update({
              followerCount: admin.firestore.FieldValue.increment(1)
            })
        }
      } catch (e) {
        console.log(e)
      }
    }
  )

exports.unfollowUser = functions
  .runWith({
    timeoutSeconds: 540
  })
  .firestore.document('users/{userId}/follows/{id}')
  .onDelete(
    // フォローユーザーのページ全てをタイムラインから削除する
    async (snap, context): Promise<void> => {
      try {
        console.log('unfollowUser', snap, context.params.id)

        const data = snap.data()

        if (data) {
          const timelineQuery = await db
            .collection('users')
            .doc(data.from)
            .collection('timeline')
            .where('ownerId', '==', data.to)
            .get()

          timelineQuery.forEach(
            async (doc): Promise<void> => {
              await doc.ref.delete()
            }
          )

          // Userドキュメントのフォロー情報を削除
          await db
            .collection('users')
            .doc(data.from)
            .update({
              followings: admin.firestore.FieldValue.arrayRemove(data.to)
            })

          // フォロー解除した相手のフォロワー数をデクリメントする
          await db
            .collection('users')
            .doc(data.to)
            .update({
              followerCount: admin.firestore.FieldValue.increment(-1)
            })
        }
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
        console.log('create page', pageId, page)

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
              const query = await db
                .collectionGroup('follows')
                .where('to', '==', user.id)
                .get()
              //const query = await user.ref.collection('followers').get()
              query.forEach(
                async (doc): Promise<void> => {
                  if (doc.exists) {
                    const data = doc.data()
                    await db
                      .collection('users')
                      .doc(data.from)
                      .collection('timeline')
                      .doc(pageId)
                      .set(page)
                  }
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

        console.log('update page', pageId, page)
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
              const query = await db
                .collectionGroup('follows')
                .where('to', '==', user.id)
                .get()
              query.forEach(
                async (doc): Promise<void> => {
                  if (doc.exists) {
                    const data = doc.data()
                    await db
                      .collection('users')
                      .doc(data.from)
                      .collection('timeline')
                      .doc(pageId)
                      .set(page)
                  }
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

        console.log('delete page', pageId, page)
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
              // 投稿を自分のタイムラインから削除
              await user.ref
                .collection('timeline')
                .doc(pageId)
                .delete()

              // 投稿をフォロワーのタイムラインを削除
              const query = await db
                .collectionGroup('follows')
                .where('to', '==', user.id)
                .get()
              query.forEach(
                async (doc): Promise<void> => {
                  if (doc.exists) {
                    const data = doc.data()
                    await db
                      .collection('users')
                      .doc(data.from)
                      .collection('timeline')
                      .doc(pageId)
                      .delete()
                  }
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

exports.likePage = functions
  .runWith({
    timeoutSeconds: 540
  })
  .firestore.document('users/{userId}/likes/{id}')
  .onCreate(
    // ページにいいねしたユーザーを追加する
    async (snap, context): Promise<void> => {
      try {
        console.log('likePage', snap, context.params.id)
        const data = snap.data()
        if (data) {
          const pageRef = db
            .collection('pages')
            .doc(data.pageId)
            .collection('likes')
            .doc('DATA')
          pageRef.set({
            likedBy: admin.firestore.FieldValue.arrayUnion(data.from)
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  )

exports.unlikePage = functions
  .runWith({
    timeoutSeconds: 540
  })
  .firestore.document('users/{userId}/likes/{id}')
  .onDelete(
    // ページからいいねしたユーザーを削除する
    async (snap, context): Promise<void> => {
      try {
        console.log('unlikePage', snap, context.params.id)
        const data = snap.data()
        if (data) {
          const pageRef = db
            .collection('pages')
            .doc(data.pageId)
            .collection('likes')
            .doc('DATA')
          pageRef.set({
            likedBy: admin.firestore.FieldValue.arrayRemove(data.from)
          })
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
