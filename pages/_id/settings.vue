<template>
  <section class="section">
    <div class="container">
      <div class="menu">
        <p class="menu-label">設定ページ</p>
        <ul class="menu-list">
          <li>
            <n-link :to="`/${$store.state.user.id}/password`"
              >パスワード変更</n-link
            >
          </li>
          <li>
            <n-link :to="`/${$store.state.user.id}/withdraw`">退会</n-link>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
