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
              :label="item.comment_count"
              tooltip="댓글수"
            />
          </div>
        </div>
        <div class="col-2">
          <div class="flex flex-center items-center">
            <q-btn class="full-width" flat dense @click.prevent="toggleLike">
              <PostIcon
                :name="isLike ? 'favorite' : 'sym_o_favorite'"
                :label="item.like_count"
                tooltip="좋아요"
              />
            </q-btn>
          </div>
        </div>
        <div class="col-2">
          <div class="flex flex-center items-center">
            <q-btn class="full-width" flat dense @click.prevent="toggleDislike">
              <PostIcon
                :name="isLike ? 'mood_bad' : 'sym_o_mood_bad'"
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
              @click.prevent="toggleBookmark"
            >
              <PostIcon
                :name="isBookmark ? 'bookmark' : 'sym_o_bookmark'"
                :label="bookmarkCount"
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
import { generateDefaultPhotoURL } from 'src/services';
import PostIcon from './PostIcon.vue';
import { useLike } from 'src/composables/useLike';
import { useBookmark } from 'src/composables/useBookmark';
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
</script>
