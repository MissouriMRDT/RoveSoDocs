<script setup lang="ts">
import { onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
const { Layout } = DefaultTheme

// Module-level flag that persists across component remounts but resets on page reload
let hasReloaded = false

onMounted(() => {
  if (!hasReloaded) {
    hasReloaded = true
    window.location.reload()
  }
})
</script>

<template>
  <Layout>
    <template #not-found>

    </template>
  </Layout>
</template>

<style scoped>
.nf {
  padding: 64px 24px;
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}

.nf__code {
  font-size: 72px;
  line-height: 1;
  margin: 0;
  color: var(--vp-c-text-1);
}

.nf__title {
  font-size: 22px;
  margin: 12px 0 8px;
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.nf__text {
  margin: 0 0 20px;
  color: var(--vp-c-text-2);
}

.nf__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>