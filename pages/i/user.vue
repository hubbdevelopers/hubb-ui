<template>
  <section class="section">
    <div class="container">
      <h1 class="title">
        Users
      </h1>
			<div class="columns is-multiline">
				<div v-for="user in users" :key="user.ID" class="column is-one-quarter">
					<user-box :user="user"></user-box>
				</div>
			</div>
    </div>
  </section>
</template>
<script>
import { db } from '~/plugins/firebase'
import UserBox from '~/components/user/UserBox'

export default {
	components: {
		UserBox
	},
	data() {
		return {
			users: []
		}
	},
	async created() {
		this.users = (await this.$axios.$get('users')).data
	},
}
</script>
