import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  // base 부분을 본인의 GitHub 저장소(Repository) 이름으로 적어주세요!
  // 앞뒤에 슬래시(/) 넣는 거 잊지 마시고요!
  base: '/todo-list-basic-2/',
  plugins: [vue()],
})