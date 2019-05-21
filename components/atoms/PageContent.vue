<template>
  <div
    v-html="
      $sanitize(content, {
        allowedTags: [
          'img',
          'iframe',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'blockquote',
          'p',
          'a',
          'ul',
          'ol',
          'nl',
          'li',
          'b',
          'i',
          'strong',
          'em',
          'strike',
          'code',
          'hr',
          'br',
          'div',
          'table',
          'thead',
          'caption',
          'tbody',
          'tr',
          'th',
          'td',
          'pre'
        ],
        allowedAttributes: {
          a: ['href'],
          img: ['src'],
          iframe: ['src']
        },
        allowedIframeHostnames: ['www.youtube.com']
      })
    "
    class="content"
  />
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="scss" scoped>
.content {
  word-wrap: break-word;
  line-height: 2;
}
</style>
