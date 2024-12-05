# BookMap

## 프로젝트 소개

BookMap은 책에 관심이 많은 유저들을 대상으로한 커뮤니티 사이트입니다. 게시글 작성,수정,삭제 및 댓글을 통해 다른 유저들과 소통할 수 있으며 책 검색 기능을 탑재하여 원하는 책을 검색해 볼 수 있습니다. 또한 검색한 책이 어떤 서점에 몇권 있는지 확인할 수 있습니다.

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

### [책 검색]

### [매장 찾기]

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
├── App.vue
├── assets
│   └── quasar-logo-vertical.svg
├── boot
│   ├── axios-config.js
│   ├── darkmode.js
│   └── navigation-guard.js
├── components
│   ├── StickySideBar.vue
│   ├── apps
│   │   ├── chat
│   │   │   ├── NotificationList.vue
│   │   │   ├── WebChat.vue
│   │   │   └── WebChatItem.vue
│   │   ├── comment
│   │   │   ├── CommentItem.vue
│   │   │   └── CommentList.vue
│   │   ├── payment
│   │   │   └── PaymentsHistory.vue
│   │   └── post
│   │       ├── PostForm.vue
│   │       ├── PostIcon.vue
│   │       ├── PostItem.vue
│   │       ├── PostList.vue
│   │       └── PostWriteDialog.vue
│   ├── auth
│   │   ├── AuthDialog.vue
│   │   ├── FindPasswordForm.vue
│   │   ├── SignInForm.vue
│   │   ├── SignUpForm.vue
│   │   └── SuccessFindPassword.vue
│   ├── base
│   │   └── BaseCard.vue
│   ├── book
│   │   ├── BookItem.vue
│   │   └── BookList.vue
│   ├── map
│   │   └── KakaoMap.vue
│   ├── report
│   │   └── ReportForm.vue
│   ├── skeletons
│   │   ├── PostItemSkeleton.vue
│   │   └── PostListSkeleton.vue
│   └── tiptap
│       ├── TiptapEditor.vue
│       ├── TiptapEditorMenu.vue
│       └── TiptapViewer.vue
├── composables
│   └── usePostQuery.js
├── css
│   ├── app.scss
│   ├── quasar.variables.scss
│   └── tiptap.scss
├── layouts
│   └── default.vue
├── pages
│   ├── [...path].vue
│   ├── books
│   │   ├── [isbn]
│   │   │   └── index.vue
│   │   └── index.vue
│   ├── components
│   │   ├── PostHeader.vue
│   │   └── PostRightBar.vue
│   ├── index.vue
│   ├── mypage
│   │   ├── bookmark.vue
│   │   ├── password.vue
│   │   ├── payment.vue
│   │   └── profile.vue
│   ├── mypage.vue
│   ├── payments
│   │   ├── certification.vue
│   │   ├── index.vue
│   │   └── result.vue
│   ├── posts
│   │   └── [id]
│   │       ├── components
│   │       │   ├── PostComments.vue
│   │       │   └── PostDetails.vue
│   │       ├── edit.vue
│   │       └── index.vue
│   ├── social
│   │   └── kakao.vue
│   └── verify
│       └── [token]
│           └── index.vue
├── router
│   └── index.js
├── services
│   ├── auth.js
│   ├── book.js
│   ├── chat.js
│   ├── comment.js
│   ├── image.js
│   ├── index.js
│   ├── notification.js
│   ├── payment.js
│   ├── post.js
│   └── report.js
├── stores
│   ├── auth.js
│   ├── index.js
│   └── store-flag.d.ts
└── utils
    ├── payments
    │   ├── constants.js
    │   └── util.js
    ├── relative-time-format.js
    └── validate-rules.js
```

---

## API 명세

### [API 명세](https://denim-knot-470.notion.site/ef06589a8f5e49529645cff63419abc0?v=4a2368990f7043059aa5be52b6abb633&pvs=4)

