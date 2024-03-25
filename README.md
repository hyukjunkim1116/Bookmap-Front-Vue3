# BookMap

- [백엔드 바로가기(허진)](https://github.com/Kimheojin/backspring)
- [백엔드 바로가기(김혁준)](https://github.com/hyukjunkim1116/Bookmap-Back-Spring)

## 배포 주소

## 팀 소개

- 프론트엔드(김혁준)

## 프로젝트 소개

## 시작 가이드

### Requirements

- [Node.js 20.10.0](https://nodejs.org/en/download)
- [Npm 10.2.3](https://www.npmjs.com/package/npm/v/10.2.3)

### Installation

```bash
$ git clone https://github.com/hyukjunkim1116/foodmap-Vue3
$ cd foodmap-Vue3
$ npm i
$ npm run dev
```

---

## Stacks 🐈

#### Vue3, Quasar

- Vue3
  - 낮은 러닝커브를 가지고 있고 와 SPA, 반응형 렌더링을 사용하기 위해 도입했습니다.
- quasar
  - Quasar에서 제공하는 css 기능을 사용하여 디자인 시간을 절약하기 위해 도입했습니다.
  - 그 외 파일 업로드 폼, boot 기능을 사용하여 프로젝트 전역을 관리하기 위해 도입했습니다.

#### Pinia

- 최상위 컴포넌트를 만들어 props로 유저 정보를 내려주는 방식의 경우 불필요한 props 전달이 발생합니다. 따라서, 필요한 컴포넌트 내부에서만 상태 값을 가져다 사용하기 위해 상태 관리 라이브러리를 사용하기로 했습니다.

#### unplugin-vue-router

- 직관적이고 가독성있는 디렉토리 구조를 만들기 위해 파일의 위치에 따라 라우팅 경로가 설정되는 방식을 도입하였습니다.

### Environment

![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)

### Config

![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)

### Development

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white)
![Vue3](https://img.shields.io/badge/vue3-444444?style=for-the-badge&logo=vue.js)
![Quasar](https://img.shields.io/badge/quasar-444444?style=for-the-badge&logo=quasar)

### Communication

<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white">

---

## 화면 구성 📺

### [초기화면]

### [회원가입]

### [프로필]

### [게시글]

### [채팅]

### [결제]

### [댓글]

---

## 주요 기능 📦

### 회원가입,로그인

### 게시글 작성, 댓글 작성

### 좋아요,싫어요,구독,검색

### 결제

### 채팅,알림

### 신고

---

## 아키텍쳐

### 디렉토리 구조

```
foodmap-Vue3
├─ README.md
├─ index.html
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ postcss.config.cjs
├─ public
├─ quasar.config.js
└─ src
   ├─ App.vue
   ├─ assets
   ├─ boot
   ├─ components
   │  ├─ StickySideBar.vue
   │  ├─ apps
   │  │  ├─ chat
   │  │  ├─ comment
   │  │  ├─ payment
   │  │  └─ post
   │  ├─ auth
   │  ├─ base
   │  ├─ report
   │  ├─ skeletons
   │  └─ tiptap
   ├─ composables
   ├─ css
   ├─ layouts
   ├─ pages
   │  ├─ [...path].vue
   │  ├─ index.vue
   │  ├─ mypage.vue
   │  ├─ components
   │  ├─ mypage
   │  ├─ payments
   │  ├─ posts
   │  │  └─ [id]
   │  ├─ social
   │  └─ verify
   │     └─ [token]
   ├─ router
   ├─ services
   ├─ stores
   └─ utils
```

---

## API 명세

### [API 명세](https://denim-knot-470.notion.site/055b7ca4a10142f8a5a049d941b84455?v=dd168a4580ad4328afa9d36a5da7c49c&pvs=4)
