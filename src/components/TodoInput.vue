<!--
  [TodoInput.vue 처리 단계 설명]

  1단계. 입력창 데이터 inputMsg를 ref로 만든다.
  2단계. input 태그와 v-model로 양방향 바인딩한다.
  3단계. Enter 키 또는 등록 버튼 클릭 시 addTodo()를 실행한다.
  4단계. addTodo()는 현재 입력값을 부모(App.vue)로 emit 한다.
  5단계. 전송이 끝나면 입력창을 빈 문자열로 초기화한다.
-->

<script setup>
// Vue의 ref를 가져온다.
import { ref } from 'vue';

// 부모로 보낼 이벤트를 선언한다.
//보낼 emit 리스트
const emit = defineEmits(['add-todo']);

// inputMsg는 사용자가 입력하는 텍스트를 저장하는 반응형 변수이다.
const inputMsg = ref('');
// addTodo는 현재 입력값을 부모에게 전달하고 입력창을 초기화한다.
const addTodo = () => {
  const trimmedMsg = inputMsg.value.trim();
  if(!trimmedMsg) return;

  //입력 완료시 입력값 초기화
  inputMsg.value = '';
}
</script>

<template>
  <div class="todo-input-wrap">
    <input type="text" class="todo-input" placeholder="할 일을 입력하세요."
          v-model = 'inputMsg'
          @keydown.enter="addTodo"/>
<!--    v-model : 입력받을 반응형 데이터 -->
<!--    @keydown 이벤트 : 엔터키 누르면 addTodo 이벤트 실행(위에서 정의한) -->

    <button class="todo-add-btn"
      @click="addTodo"
      >등록</button>
  </div>
</template>
