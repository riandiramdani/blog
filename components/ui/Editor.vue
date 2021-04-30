<template>
  <div class="container ma-0 pa-0">
    <client-only>
      <quill-editor
        id="editor"
        v-model="editorContent"
        @change="onEditorChange"
        ref='textEditor'
        :options='editorOption'
       ></quill-editor>
    </client-only>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      editorOption: {
        modules: {
          toolbar: {
            container: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'align': [] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              ['blockquote', 'code-block'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              ['link', 'image', 'video'],
            ],
          },
          // imageDrop: true,
          imageResize: {
            displayStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            },
            modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
          },
          imageUploader: {
            upload: file => {
              return this.$api.imageUploader(file)
                .then(res => {
                  return res.data.data.file
                })
                .catch(() => {})
            }
          }
        }
      },
      editorContent: ''
    }
  },
  watch: {
    content: {
      handler () {
        this.editorContent = this.content
      },
      deep: true,
    },
  },
  mounted() {
    // this.editorContent = this.content
  },
  methods: {
    // onEditorBlur(editor) {
    //   console.log('editor blur!', editor)
    // },
    // onEditorFocus(editor) {
    //   console.log('editor focus!', editor)
    // },
    // onEditorReady(editor) {
    //   console.log('editor ready!', editor)
    // },
    onEditorChange({ editor, html, text }) {
      this.editorContent = html
      // console.log('editor change!', html)
      this.$emit('content-changed', this.editorContent)
    },
  }
}
</script>

<style lang="scss">
  // .quill-editor {
  //   max-height: 400px;
  //   overflow-y: auto;
  // }
  .quill-editor {
    .ql-editor {
      height: 350px !important;
    }
  }
</style>
