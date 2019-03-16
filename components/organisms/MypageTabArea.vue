<template>
  <div>
		<div class="tabs">
      <ul>
        <li class="is-active"><a>ページ</a></li>
      </ul>
    </div>
    
		<div class="columns is-multiline">
      <div v-for="page in pages" :key="page.ID" class="column is-three-fifths is-offset-one-fifth">
        <page-box :pageId="page.ID.toString()" />
      </div>
		</div>

		<!--h2 class="is-size-3">コミュニティ一覧</h2>
		<div class="columns is-multiline">
			<div v-for="community in communities" :key="community.id" class="column is-one-third">
				<div class="card">
					<div class="card-image">
						<nuxt-link :to="'/i/community/' + community.ID">
						<figure class="image is-4by3">
							<img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
						</figure>
						</nuxt-link>
					</div>
					<div class="card-content">

						<div class="content">
							<p class="title">
								{{community.Name}}
							</p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit.
							Phasellus nec iaculis mauris.
						</div>
					</div>
				</div>
			</div>
		</div-->
	</div>
</template>
<script>
import PageBox from '~/components/molecules/PageBox'
export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    pages: {
      type: Array,
      required: true
    },
    communities: {
      type: Array,
      required: true
    }
  },
	components: {
    PageBox
	},
  
}
</script>

