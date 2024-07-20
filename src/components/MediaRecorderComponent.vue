<template>
  <div class="flex column gap_8 items-center">
    <div class="flex gap_8 items-center">
      <div
        class="record-button"
        :class="{ recording: isRecording }"
        @click="toggleRecord"
      >
        <div class="record-button-indicator" />
      </div>

      <div
        class="upload-button"
        :class="{ disabled: !recording }"
        @click="recording ? sendFile() : undefined"
      />
    </div>

    <audio
      ref="audio"
      controls
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import AudioRecorder from 'audio-recorder-polyfill';

import { useWebsocketStore } from '@/stores/websocket';

window.MediaRecorder = AudioRecorder;

const emits = defineEmits<{
  (e: 'recorded', value: string): void
}>();

const mediaRecorder = ref<MediaRecorder>();
const isRecording = ref(false);
const audio = ref();
const recording = ref();

// const mimeType = 'audio/mp4';

const websocketStore = useWebsocketStore();
const { socket } = storeToRefs(websocketStore);

function sendFile() {
  if (!recording.value) {
    console.error('There is no data to send');
    return;
  }

  const reader = new FileReader();

  reader.readAsDataURL(recording.value);
  reader.onloadend = function() {
    socket.value.send(reader.result!);
  }
}

async function toggleRecord() {
  if (!isRecording.value) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder.value = new window.MediaRecorder(stream);

      mediaRecorder.value.addEventListener('dataavailable', e => {
        console.log('type:', e.data.type, e.data);
        const blob = window.URL.createObjectURL(e.data);

        audio.value.src = blob;
        recording.value = e.data;

        emits('recorded', blob);
      });
    } catch (e) {
      console.error('Error capturing media');
    }

    mediaRecorder.value?.start();
  } else {
    mediaRecorder.value?.stop();
    mediaRecorder.value?.stream.getTracks().forEach(i => i.stop());
  }

  isRecording.value = !isRecording.value;
}
</script>

<style lang="scss" scoped>
$button-radius: 50px;

.record-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: $button-radius;
  height: $button-radius;
  border-radius: 50%;
  border: 1px solid lightblue;
  cursor: pointer;

  .record-button-indicator {
    width: 10px;
    height: 10px;
    background: green;
  }

  &.recording .record-button-indicator {
      border-radius: 50%;
      background: red;
  }
}

.upload-button {
  width: 32px;
  height: 32px;
  background: url("@/assets/upload-32.png");

  &.disabled {
    opacity: 0.5;
  }

  &:not(.disabled) {
    cursor: pointer;
  }
}
</style>
