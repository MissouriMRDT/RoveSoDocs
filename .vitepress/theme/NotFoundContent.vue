<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const { site } = useData()

const REFRESH_PREFIXES = [
  '/autonomy/',
  '/RoveSoSimulator/_d/',
  '/RoveSoSimulator/_j/',
  '/embedded/',
  '/rovecomm/_cpp/',
]

const REFRESH_FLAG = '__vp_r'

const base = computed(() => {
  let b = site.value.base || '/'
  if (!b.startsWith('/')) b = '/' + b
  if (!b.endsWith('/')) b = b + '/'
  return b
})

const matchPrefix = ref<string | null>(null)
const alreadyTried = ref(false)

const currentPath = ref<string>('')

function logicalPathname(pathname: string) {
  const b = base.value
  if (b !== '/' && pathname.startsWith(b)) {
    const rest = pathname.slice(b.length)
    return '/' + rest
  }
  return pathname.startsWith('/') ? pathname : '/' + pathname
}

function findPrefixMatch(p: string) {
  return REFRESH_PREFIXES.find(prefix => p === prefix || p.startsWith(prefix)) || null
}

const sectionHref = computed(() => {
  if (!matchPrefix.value) return base.value
  const b = base.value === '/' ? '' : base.value.replace(/\/$/, '')
  return b + matchPrefix.value
})

const quickLinks = computed(() => {
  const b = base.value === '/' ? '' : base.value.replace(/\/$/, '')
  return [
    { label: 'Autonomy Docs', href: b + '/autonomy/' },
    { label: 'RoveSoSimulator (Doxygen)', href: b + '/RoveSoSimulator/_d/' },
    { label: 'RoveSoSimulator (Jekyll)', href: b + '/RoveSoSimulator/_j/' },
    { label: 'Embedded', href: b + '/embedded/' },
    { label: 'RoveComm C++', href: b + '/rovecomm/_cpp/' },
  ]
})

onMounted(() => {
  const p = logicalPathname(window.location.pathname)
  currentPath.value = p
  matchPrefix.value = findPrefixMatch(p)
  if (!matchPrefix.value) return

  const url = new URL(window.location.href)
  const hasFlag = url.searchParams.get(REFRESH_FLAG) === '1'

  if (!hasFlag) {
    url.searchParams.set(REFRESH_FLAG, '1')
    window.location.replace(url.toString())
    return
  }

  alreadyTried.value = true

  // Clean URL so a later visit can try again (no storage required)
  url.searchParams.delete(REFRESH_FLAG)
  window.history.replaceState({}, '', url.toString())
})
</script>

<template>
  <div class="nf">
    <div class="nf__bg" aria-hidden="true"></div>

    <div class="nf__wrap">
      <div class="nf__card">
        <div class="nf__badge" v-if="matchPrefix">
          <span class="nf__spinner" aria-hidden="true"></span>
          <span>Attempting hard load</span>
        </div>
        <div class="nf__badge" v-else>
          <span class="nf__dot" aria-hidden="true"></span>
          <span>Not found</span>
        </div>

        <h1 class="nf__title">
          <template v-if="matchPrefix">Loading section…</template>
          <template v-else>404</template>
        </h1>

        <p class="nf__subtitle" v-if="matchPrefix">
          This route belongs to a separate sub-site:
          <code class="nf__code">{{ matchPrefix }}</code>
        </p>

        <p class="nf__subtitle" v-else>
          That page doesn’t exist (or it moved). Try the homepage, search, or jump to a section.
        </p>

        <div class="nf__meta">
          <span class="nf__metaLabel">Path</span>
          <code class="nf__path">{{ currentPath || '—' }}</code>
        </div>

        <p class="nf__warn" v-if="matchPrefix && alreadyTried">
          I already tried the one-time hard load and still ended up here. Use one of the links below.
        </p>

        <div class="nf__divider" aria-hidden="true"></div>

        <div class="nf__grid">
          <a v-for="l in quickLinks" :key="l.href" class="nf__link" :href="l.href">
            <span class="nf__linkTitle">{{ l.label }}</span>
            <span class="nf__linkHref">{{ l.href }}</span>
          </a>
        </div>

        <div class="nf__footer">
          <a class="nf__home" :href="base">Back to home</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nf {
  position: relative;
  min-height: calc(100vh - var(--vp-nav-height, 0px));
  padding: 48px 16px;
}

.nf__bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(800px 400px at 15% 15%, var(--vp-c-bg-soft) 0%, transparent 60%),
    radial-gradient(700px 350px at 85% 25%, var(--vp-c-bg-soft) 0%, transparent 60%),
    radial-gradient(900px 450px at 50% 95%, var(--vp-c-bg-soft) 0%, transparent 65%);
  opacity: 0.9;
  pointer-events: none;
}

.nf__wrap {
  position: relative;
  max-width: 920px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.nf__card {
  width: 100%;
  max-width: 860px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  border-radius: 18px;
  box-shadow: var(--vp-shadow-2);
  padding: 28px;
}

.nf__badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  padding: 6px 10px;
}

.nf__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--vp-c-danger-1);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--vp-c-danger-1) 25%, transparent);
}

.nf__spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  animation: nfspin 0.9s linear infinite;
}

@keyframes nfspin {
  to { transform: rotate(360deg); }
}

.nf__title {
  margin: 14px 0 6px;
  font-size: 44px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.nf__subtitle {
  margin: 0 0 16px;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.6;
}

.nf__code {
  padding: 2px 6px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
}

.nf__meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0 14px;
  padding: 10px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.nf__metaLabel {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.nf__path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--vp-c-text-1);
}

.nf__warn {
  margin: 0 0 14px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--vp-c-warning-1) 35%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-warning-soft) 65%, transparent);
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.5;
}

.nf__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.nf__divider {
  height: 1px;
  background: var(--vp-c-divider);
  margin: 18px 0;
}

.nf__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

@media (max-width: 720px) {
  .nf__grid {
    grid-template-columns: 1fr;
  }
  .nf__title {
    font-size: 38px;
  }
}

.nf__link {
  display: block;
  text-decoration: none;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 14px;
  padding: 12px 12px;
  transition: transform 120ms ease, border-color 120ms ease, background-color 120ms ease;
}

.nf__link:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--vp-c-brand-1) 45%, var(--vp-c-divider));
  background: color-mix(in srgb, var(--vp-c-brand-soft) 55%, var(--vp-c-bg-soft));
}

.nf__linkTitle {
  display: block;
  font-weight: 650;
  color: var(--vp-c-text-1);
  margin-bottom: 3px;
}

.nf__linkHref {
  display: block;
  font-size: 12px;
  color: var(--vp-c-text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nf__footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.nf__home {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
}

.nf__home:hover {
  text-decoration: underline;
}
</style>
