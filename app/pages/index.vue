<template>
  <div class="container">
    <header>
      <h1>Force DNS Record /w Proxy</h1>
      <p>
        Masukkan IP A record dan nama domain yang ingin kamu preview.
        Tampilan website akan muncul pada iframe dibawah tanpa mengubah DNS Domain atau IP A record asli kamu.
      </p>
    </header>

    <div class="controls">
      <input type="text" v-model="targetIp" placeholder="Masukkan target IP (e.g., 93.184.216.34)" />
      <input type="text" v-model="targetHost" placeholder="Masukkan nama domain (e.g., example.com)" />
      <button @click="loadPreview">Lihat Preview</button>
    </div>

    <div class="preview-area">
      <div v-if="!previewUrl" class="placeholder">
        <p>Preview website akan tampil disini.</p>
      </div>
      <iframe v-if="previewUrl" :src="previewUrl" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const targetIp = ref('')
const targetHost = ref('')
const previewUrl = ref<string | null>(null)

const loadPreview = () => {
  if (targetIp.value && targetHost.value) {
    // Construct the URL that our server middleware will intercept
    previewUrl.value = `/?target_ip=${targetIp.value}&target_host=${targetHost.value}`
  } else {
    alert('Mohon masukan IP A record dan nama domain.')
  }
}
</script>

<style>
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: #f0f2f5;
  color: #333;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.container {
  width: 90%;
  max-width: 1200px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  box-sizing: border-box;
}

header {
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

h1 {
  color: #1a73e8;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

input[type="text"] {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: #1a73e8;
  color: white;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #1558b3;
}

.preview-area {
  width: 100%;
  height: 60vh;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  font-size: 1.2rem;
}

iframe {
  width: 100%;
  height: 100%;
}
</style>