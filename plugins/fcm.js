import firebase from 'firebase'

export default ({ app }) => {
  const messaging = firebase.messaging()

  messaging
    .requestPermission()
    .then(() => {
      console.log('Notification permission granted.')
      return messaging.getToken()
    })
    .then(token => {
      console.log(token)

      if (token) {
        let argObj = {
          to: token,
          notification: {
            body: 'メッセージ内容',
            title: 'タイトル',
            click_action: 'https://google.com',
            icon: 'アイコン'
          }
        }
        let optionObj = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'key=hogehoge'
          }
        }
        // app.$axios.$post('https://fcm.googleapis.com/fcm/send', argObj,optionObj).then(res => {
        //   console.log(res)
        // })
      }
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err)
    })

  messaging.onMessage(function(payload) {
    console.log('Message received. ', payload)
  })
}
