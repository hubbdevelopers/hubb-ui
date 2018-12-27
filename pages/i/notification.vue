<template>
<section class="section">
<div class="container">
	<div>
    {{notifications}}
  </div>
</div>
</section>
</template>
<script>

export default {
  computed: {
    notifications: function() {
      return this.$store.getters['user/getNotifications']
    }
  }
}
</script>