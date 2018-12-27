<template>
	<div class="modal" :class="{'is-active': showModal}">
		<div class="modal-background" @click="$emit('closeModal')"></div>
		<div class="modal-card">
			<header class="modal-card-head">
				<p class="modal-card-title">ページ追加</p>
				<button class="delete" aria-label="close" @click="$emit('closeModal')"></button>
			</header>
			<section class="modal-card-body">
				<div class="field">
					<label class="label">ページ名</label>
					<div class="control">
						<input class="input" type="text" placeholder="Text input" v-model="newPageName">
					</div>
				</div>
			</section>
			<footer class="modal-card-foot">
				<button class="button is-primary" @click="createPage" v-bind:disabled="$v.newPageName.$invalid || isCreating">ページ追加</button>
				<button class="button" @click="$emit('closeModal')">Cancel</button>
			</footer>
		</div>
	</div>
</template>
<script>
import { required, maxLength } from 'vuelidate/lib/validators'

export default {
	props: {
		showModal: {
			type: Boolean,
			default: false
		},
		communityId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			newPageName: '',
			isCreating: false
		}
	},
	methods: {
		createPage() {
			this.isCreating = true

			const param = {
				pageName: this.newPageName,
				communityId: this.communityId
			}
			this.$store.dispatch('user/createCommunityPage', param).then(res =>{
				console.log(res)
				this.$router.push({ path: res.ID.toString(), append: true })
			}).finally(() => {
				this.isCreating = false
			})
		}
	},
	validations: {
		newPageName: {
			required,
			maxLength: maxLength(20)
		},
	}
}
</script>