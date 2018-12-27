import { db } from '~/plugins/firebase'
const usersRef = db.collection("/users")

export const state = () => ({
    users: []
})

export const actions = {

  fetchUser({state, commit}, userId) {
    return new Promise(async (resolve, reject) => {
      const userfilter = state.users.filter((user) => {
        if (user.id == userId) return true;
      })

      if(userfilter.length > 0) {
        console.log('user from cache')
        resolve(userfilter[0])
        return
      }

      try{
        const user = await usersRef.doc(userId).get()
        if(user.exists) {
          const param = {id: user.id, data: user.data()}
          commit('pushUser', param)
          resolve(param)
        } else {
          throw new Error("user does not exist");
        }

      } catch(e) {
        console.log('cannot fetch user')
        reject(e)
      }

    })
  }
} 

export const mutations = {

    pushUser(state, param) {
      state.users.push(param)
    }

}


