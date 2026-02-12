<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import NotFoundContent from './NotFoundContent.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #not-found>
      <NotFoundContent />
    </template>
  </Layout>
</template>
