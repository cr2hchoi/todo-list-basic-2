<!--
  [App.vue 처리 단계 설명]

  1단계. TodoHeader, TodoList, TodoInput 컴포넌트를 import 한다.
  2단계. 할 일 목록(todo)과 현재 필터 탭(current)을 ref로 반응형 상태로 만든다.
  3단계. 앱이 처음 열릴 때 localStorage에 저장된 todo 데이터를 읽어와 복원한다.
  4단계. computed를 사용해 현재 탭에 맞는 화면 출력용 목록(filteredTodo)을 계산한다.
  5단계. addTodo(), deleteTodo(), toggleTodo(), clearCompleted(), updateTab() 함수를 만든다.
  6단계. watch를 사용해 todo 목록이 바뀔 때마다 localStorage에 자동 저장한다.
  7단계. props와 emit으로 자식 컴포넌트와 연결해 전체 Todo 앱이 동작하도록 구성한다.
-->

<script setup>
// Vue의 반응형 상태(ref), 계산된 상태(computed), 상태 감시(watch), 최초 실행 시점(onMounted)을 가져온다.
import { ref, onMounted, watch, computed } from 'vue';
// 상단 제목/탭 컴포넌트를 가져온다.
import TodoHeader from './components/TodoHeader.vue';
// 목록 출력 컴포넌트를 가져온다.
import TodoList from './components/TodoList.vue';
// 입력창 컴포넌트를 가져온다.
import TodoInput from './components/TodoInput.vue';
// localStorage에 사용할 키 이름을 상수로 정의한다.
const STORAGE_KEY = 'todo-app-composition-api';

// todo는 전체 할 일 목록을 저장하는 반응형 배열이다.
/** @type {import('vue').Ref<{id: string, msg: string, completed: boolean}[]>} */
const todo = ref([
]);

// current는 현재 선택된 탭 상태를 저장한다. (filtering)
// all = 전체 보기, completed = 완료만 보기
const current = ref('all');

// filteredTodo는 current 값에 따라 실제 화면에 보여줄 목록을 계산한다.
//계산된 속성 사용
const filteredTodo = computed(() => {
  if (current.value === 'all') {
    return todo.value;
  }
  return todo.value.filter((item) => item.completed);
  //completed 상태인 item만 뽑아서 필터링 한다.
});
// completedCount는 완료된 할 일 개수를 계산한다.
const completedCount = computed(() => {
    //필터 함수에 대한 조건 오버라이딩
    //필터 함수로 completed 된 항목들의 갯수를 센다.
  return todo.value.filter((item) => item.completed).length;
});
// remainingCount는 아직 완료되지 않은 할 일 개수를 계산한다.
const remainingCount = computed(() => {
  return todo.value.filter((item) => !item.completed).length; //<==d여기에 NOT 만 추가
});

// 전체 할일 갯수 계산
const totalCount = computed(() => todo.value.length);

// addTodo는 입력받은 문자열을 새 할 일 객체로 만들어 목록에 추가한다. (push)
// 입력받을 문자열 저장 변수 = inputMsg
const addTodo = (inputMsg) => {
  //앞뒤 공백을 잘라주는 건 디폴트로 해야할일임!(trim)
  const trimmedMsg = inputMsg.trim();

  // 공백만 입력한 경우에는 추가하지 않고 함수를 종료한다.
  // 방어 코드 : Guard Clause
  if (!trimmedMsg) return;
  // !trimmedMsg = Null(아무것도 값이 없음)

  // 새 할 일 객체를 생성한다.
  const item = {
    id: Date.now().toString() + Math.random(),
    msg: trimmedMsg,
    completed: false,
  };
  //새롭게 입력된 할일을 배열의 맨앞에 추가
  todo.value.unshift(item);
};

// updateTab은 상단 탭에서 전달받은 값을 current에 저장한다.
const updateTab = (tab) => {
  current.value = tab;
};

// deleteTodo는 전달받은 id와 일치하지 않는 항목만 남겨 삭제를 처리한다.
const deleteTodo = (id) => {
  todo.value = todo.value.filter((item)=>item.id !== id);
};

// toggleTodo는 전달받은 id와 일치하는 항목의 completed 값을 true/false로 뒤집는다.
const toggleTodo = (id) => {
  todo.value = todo.value.map(
      //"전체 할 일 목록(todo.value)을 하나씩 훑으면서(map), 내가 클릭한 id랑 똑같은 녀석을 찾으면 걔만 상태를 반대로(!) 뒤집어서 다시 넣어줘!"
      // 현재 순회중인 항목이 클릭한 항목이면, completed 값을 반전시킨 새로운 객체로 반환
      // 순회중인 항목의 id값이 클릭한 항목의 id값과 일치하면 실행
      (item)=>{
        if(item.id === id){
          return{...item,
            completed: !item.completed,}
      }
        // 내가 클릭한 게 아니라면? 원래 모양 그대로 다시 돌려보냄 (변화 없음)
        return item;})
};

// clearCompleted는 완료된 항목을 한 번에 제거한다.
const clearCompleted = () => {
  // 완료되지 않은(!item.completed) 항목들만 필터링해서 다시 저장!
  todo.value = todo.value.filter((item) => !item.completed);
};
// 1. 데이터가 바뀔 때마다 로컬스토리지에 자동으로 저장 (watch)
watch(todo, (newTodo) => {
  // 로컬 스토리지는 문자열만 저장 가능 -> todo 배열을 문자열로 바꿔서 'todo-app-composition-api'라는 이름으로 저장
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodo));
  //STORAGE_KEY: 'todo-app-composition-api'이름으로 저장한 로컬스토리지 명
  //JSON.stringify(newTodo) : 저장할 값. 자바스크립트의 객채 형태를 문자열로 바꿔서 (newTodo)라는 이름으로 저장하겠다.
}, { deep: true }); // 객체 내부의 속성(completed 등)이 바뀌는 것까지 감시!
// watch(
//     todo,            // 1. 감시 대상 (누구를 지켜볼까?)
//     (newTodo) => {   // 2. 콜백 함수 (변하면 무슨 일을 할까?)
//                      // 실행할 코드
//     },
//     { deep: true }   // 3. 옵션 (얼마나 자세히 지켜볼까?)
// );
// 배열 상태: [{ id: 1, msg: '우유' }] (컴퓨터는 알지만, 메모장에는 못 적음)
//
// JSON.stringify 후: '[{"id":1,"msg":"우유"}]' (평범한 글자가 됨!)

// loadTodos는 localStorage에서 저장된 목록을 읽어 todo 상태에 복원한다.
const loadTodos = () => {
  // 1. STORAGE_KEY('todo-app-composition-api') 이름으로 저장된 데이터가 있는지 확인
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    // 2. 저장된 데이터는 '문자열' 상태이므로, 다시 자바스크립트 '배열(객체)'로 변환
    // 3. 변환된 데이터를 반응형 변수인 todo.value에 쏙 집어넣음
    todo.value = JSON.parse(saved);
  }
};
// 컴포넌트가 화면에 마운트되면 저장된 할 일 목록을 먼저 불러온다.
onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  loadTodos();
  if (saved) {
    // 저장된 문자열을 다시 자바스크립트 배열로 바꿔서 todo에 넣어줍니다.
    todo.value = JSON.parse(saved);
  }
});

// todo 값이 바뀔 때마다 localStorage에 최신 상태를 문자열로 저장한다.
</script>

<template>
  <div class="todo-app">
    <!-- 상단 제목과 탭 UI를 출력한다. -->
    <TodoHeader :current="current" @update-tab="updateTab" />

    <!-- 입력창과 등록 버튼 UI를 출력한다. -->
    <TodoInput @add-todo="addTodo"/>

    <!-- 할 일 통계 정보를 간단히 보여준다. -->
    <div class="todo-summary">
      <p>전체 {{totalCount}}개</p>
      <p>완료 {{completedCount }}개</p>
      <p>남은 일 {{ remainingCount }} 개</p>
    </div>

    <!-- 현재 탭에 맞는 목록을 출력한다. -->
    <TodoList
    :items="filteredTodo"
    @toggle-todo="toggleTodo"
    @delete-todo="deleteTodo"
    />

    <!-- 완료된 항목이 1개 이상 있을 때만 일괄 삭제 버튼을 보여준다. -->
    <div v-if="completedCount > 0" class="todo-actions">
      <button class="todo-clear-btn" @click="clearCompleted"> 완료 항목 전체 삭제({{completedCount}})</button>
    </div>
  </div>
</template>
