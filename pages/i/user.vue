<template>
  <section class="section">
    <div class="container">
      <h1 class="title">ユーザー一覧</h1>
      <div class="columns is-multiline is-centered">
        <div v-for="user in users" :key="user.ID" class="column is-half">
          <list-user-box :user="user" />
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { getUsers } from '~/common/user'
import ListUserBox from '~/components/molecules/ListUserBox'

export default {
  components: {
    ListUserBox
  },
  data() {
    return {
      users: []
    }
  },
  async created() {
    this.users = await getUsers()
  }
}
</script>
