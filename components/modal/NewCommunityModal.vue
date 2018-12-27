<template>
	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="$emit('closeModal')"></div>
		<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title">コミュニティ作成</p>
				<button class="delete" aria-label="close" @click="$emit('closeModal')"></button>
			</header>
			<section class="modal-card-body">
				<div class="field">
					<label class="label">コミュニティ名</label>
					<div class="control">
						<input class="input" type="text" placeholder="Text input" v-model="newCommunityName">
					</div>
					<p class="help is-danger" v-if="err_msg">{{err_msg}}</p>
				</div>
			</section>
			<footer class="modal-card-foot">
				<button class="button is-primary" @click="createCommunity" v-bind:disabled="$v.newCommunityName.$invalid || isCreating">作成</button>
				<button class="button" @click="$emit('closeModal')">Cancel</button>
			</footer>
		</div>
	</div>
</template>
<script>
import { db } from '~/plugins/firebase'
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
	props: {
		showModal: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			newCommunityName: '',
			isCreating: false,
			err_msg: ''
		}
	},
	methods: {
		createCommunity() {

			this.isCreating = true
			this.err_msg = ''

			this.checkCommunity().then(() => {
				this.$store.dispatch('user/createCommunity', this.newCommunityName).then(res =>{
					console.log(res)
					this.$router.push({ path: '/i/community/' + res.ID.toString() })
				}).finally(() => {
					this.isCreating = false
				})
			}).catch(err => {
				this.isCreating = false
				this.err_msg = err
			})
		},
		// TODO
		checkCommunity() {
      return new Promise(async (resolve, reject) => {
				try{
					const communities = await this.$axios.$get(`communities?name=${this.newCommunityName}`)
					if(communities.data.length == 0) {
						resolve()
					} else {
						reject("すでにコミュニティ名が使用されています")
					}
				}catch (e) {
					console.log(e)
					reject(e.message)
				}
			})
    }
	},
	validations: {
		newCommunityName: {
			required,
			maxLength: maxLength(20)
		},
	}
}
</script>