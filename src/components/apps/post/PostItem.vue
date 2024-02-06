<template>
  <q-item class="bg-white q-pt-md" clickable :to="`/posts/${item.id}`">
    <q-item-section avatar top>
      <q-avatar>
        <img :src="generateDefaultPhotoURL(item.author.uid)" />
      </q-avatar>
    </q-item-section>
    <q-item-section class="post-content">
      <div class="flex items-center">
        <span>{{ item.author.username }}</span>
        <span class="q-mx-xs">&middot;</span>
        <span>{{ formatRelativeTime(new Date(item?.updated_at)) }}</span>
      </div>
      <div class="text-h6 q-mt-sm">{{ item.title }}</div>
      <div v-if="escapeHTML" class="text-grey-6 q-my-sm ellipsis-2-lines">
        {{ item.title }}
      </div>
      <div
        v-else
        class="text-grey-6 q-my-sm ellipsis-2-lines"
        v-html="item.content"
      ></div>
      <div class="row items-center justify-evenly">
        <div class="col-2">
          <div class="flex flex-center items-center">
            <PostIcon
              name="sym_o_visibility"
              :label="item.read_count"
              tooltip="조회수"
            />
          </div>
        </div>
        <div class="col-2">
          <div class="flex flex-center items-center">
            <PostIcon
              name="sym_o_sms"
              :label="item.comments_count"
              tooltip="댓글수"
            />
          </div>
        </div>
        <div class="col-2">
          <div class="flex flex-center items-center">
            <q-btn
              class="full-width"
              flat
              dense
              @click.prevent="executeHandleLike(handleLike, item.id)"
            >
              <PostIcon
                :name="isLiked ? 'favorite' : 'sym_o_favorite'"
                :label="likeCount"
                tooltip="좋아요"
              />
            </q-btn>
          </div>
        </div>
        <div class="col-2">
          <div class="flex flex-center items-center">
            <q-btn
              class="full-width"
              flat
              dense
              @click.prevent="executeHandleDislike(handleDislike, item.id)"
            >
              <PostIcon
                :name="disLiked ? 'thumb_down' : 'sym_o_thumb_down'"
                :label="item.dislike_count"
                tooltip="싫어요"
              />
            </q-btn>
          </div>
        </div>
        <div class="col-2">
          <div class="flex flex-center items-center">
            <q-btn
              class="full-width"
              flat
              dense
              @click.prevent="executeHandleBookmark(handleBookmark, item.id)"
            >
              <PostIcon
                :name="isBookmarked ? 'bookmark' : 'sym_o_bookmark'"
                tooltip="북마크"
              />
            </q-btn>
          </div>
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { formatRelativeTime } from 'src/utils/relative-time-format';
import {
  generateDefaultPhotoURL,
  handleLike,
  handleDislike,
  handleBookmark,
} from 'src/services';
import { useAsyncState } from '@vueuse/core';
import { useQuasar } from 'quasar';
import { getErrorMessage } from 'src/utils/error-message';
import PostIcon from './PostIcon.vue';
import { ref } from 'vue';
const $q = useQuasar();
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  escapeHTML: {
    type: Boolean,
    default: false,
  },
});
const likeCount = ref(props.item.likes_count);
const isLiked = ref(props.item.is_liked);
const disLiked = ref(props.item.is_disliked);
const isBookmarked = ref(props.item.is_bookmarked);
const { execute: executeHandleLike } = useAsyncState(handleLike, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    console.log(response);
    isLiked.value = response.data.is_liked;
    likeCount.value = response.data.likes_count;
  },
  onError: err => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response?.data),
    });
  },
});
const { execute: executeHandleDislike } = useAsyncState(handleDislike, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    console.log(response);
    disLiked.value = response.data.is_disliked;
  },
  onError: err => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response?.data),
    });
  },
});
const { execute: executeHandleBookmark } = useAsyncState(handleBookmark, [], {
  immediate: false,
  throwError: true,
  onSuccess: response => {
    console.log(response);
    isBookmarked.value = response.data.is_bookmarked;
  },
  onError: err => {
    console.log(err);
    $q.notify({
      type: 'negative',
      message: getErrorMessage(err.response?.data),
    });
  },
});
</script>
