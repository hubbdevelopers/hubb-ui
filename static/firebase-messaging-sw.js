importScripts('https://www.gstatic.com/firebasejs/5.5.3/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/5.5.3/firebase-messaging.js')

const config = {
    messagingSenderId: '139618120538'
}

if (!firebase.apps.length) {
    const firebaseApp = firebase.initializeApp(config)
}

const messaging = firebase.messaging()
