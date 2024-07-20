import { onBeforeUnmount, onMounted, ref } from 'vue';
import { defineStore } from 'pinia';

export const useWebsocketStore = defineStore('websocket', () => {
  const socket = ref(new WebSocket("http://0.0.0.0:8080/ws"));

  socket.value.onopen = function() {
    console.log('Соединение установлено.');
  };

  socket.value.onclose = function(event) {
    if (event.wasClean) {
      console.log('Соединение закрыто чисто');
    } else {
      console.log('Обрыв соединения'); // например, "убит" процесс сервера
    }

    console.log('Код: ' + event.code + ' причина: ' + event.reason);
  };

  socket.value.onmessage = function(event) {
    console.log('Получены данные:', event.data);
  };

  socket.value.onerror = function(error) {
    console.error('Ошибка:', (error as ErrorEvent).message);
  };

  onMounted(() => console.log('mounted'));

  onBeforeUnmount(() => {
    socket.value.close(1000, 'Work complete');
  });

  return { socket };
})
