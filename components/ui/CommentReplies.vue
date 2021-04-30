<template>
  <div>
    <div
      v-for="(comment, i) in comments"
      :key="i"
      style="widht: 100%;"
    >
      <comment-item :ref="'comment-'+comment.id" :comment="comment"></comment-item>
      <comment-replies :comments="comment.replies" class="ml-10 mb-4"></comment-replies>
    </div>
  </div>
</template>

<script>
import CommentItem from '@/components/ui/CommentItem'
import CommentReplies from '@/components/ui/CommentReplies'
export default {
  name: 'comment-replies',
  components: { CommentItem, CommentReplies },
  props: {
    comments: {
      type: [Array, Object],
      required: true,
    }
  },
  data() {
    return {
      formData: {
        article_id: this.com
      }
    }
  }
}
</script>
