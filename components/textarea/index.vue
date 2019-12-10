<template>
  <div class="textarea-wrapper" :class="[align]">
    <label class="md-field-item-label">{{label}}</label>
    <div class="md-input-item-fake">
      <textarea
        class="md-textarea-item"
        ref="textarea"
        v-model="inputValue"
        :readonly="readonly"
        :maxlength="maxlength"
        :rows="rows"
        @input="$_onInput"
        @focus="$_onFocus"
        @blur="$_onBlur"
        @keyup="$_onKeyup"
        @keydown="$_onKeydown"
      ></textarea>
      <span
        class="md-input-item-fake-placeholder "
        v-if="inputValue === '' && placeholder !== ''"
        v-text="placeholder"></span>
    </div>
    <div
      class="md-textarea-item__clear"
      v-if="clearable && !readonly"
      v-show="!isInputEmpty && isInputFocus"
      @click="$_clearInput"
    >
      <md-icon name="clear"></md-icon>
    </div>
  </div>
</template>
<script>
import Icon from '../icon'
export default {
  name: 'textarea',
  components: {
    [Icon.name]: Icon,
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    maxlength: {
      type: [String, Number],
      default: '',
    },
    maxHeight: {
      type: [String, Number],
      default: '66',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    rows: {
      type: [String, Number],
      default: '1',
    },
    autosize: {
      type: Boolean,
      default: true,
    },
    align: {
      // left, center, right
      type: String,
      default: 'right',
    },
  },
  data() {
    return {
      maxHeightInner: this.maxHeight,
      inputValue: this.value,
      isInputFocus: false,
    }
  },
  computed: {
    isInputEmpty() {
      return !this.inputValue.length
    },
  },
  watch: {
    value(val) {
      this.inputValue = val
      this.resizeTextarea()
    },
    inputValue(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
    maxHeight(val) {
      this.maxHeightInner = val
      this.resizeTextarea()
    },
  },
  mounted() {
    this.resizeTextarea()
  },
  methods: {
    $_onInput(event) {
      this.inputValue = event.target.value
      this.$nextTick(() => {
        this.resizeTextarea()
      })
    },
    $_clearInput() {
      this.inputValue = ''
      this.$nextTick(() => {
        this.resizeTextarea()
      })
      this.focus()
    },
    $_onKeyup(event) {
      this.$emit('keyup', event)
    },
    $_onKeydown(event) {
      this.$emit('keydown', event)
    },
    $_onFocus() {
      this.isInputFocus = true;
      this.$emit('focus')
    },
    $_onBlur() {
      setTimeout(() => {
        this.isInputFocus = false
        this.$emit('blur')
      }, 100)
    },
    $_calcTextareaHeight(textarea) {
      // Triggers the textarea to repaint
      textarea.style.height = 'auto'
      let scrollHeight = textarea.scrollHeight
      if (this.maxHeightInner && scrollHeight > this.maxHeightInner) {
        scrollHeight = this.maxHeightInner
      }
      textarea.style.height = scrollHeight + 'px'
    },
    // public
    resizeTextarea() {
      if (this.autosize) {
        this.$_calcTextareaHeight(this.$refs.textarea)
      }
    },
    focus() {
      this.$refs.textarea.focus()
      setTimeout(() => {
        this.isInputFocus = true
      }, 200)
    },
    blur() {
      this.$refs.textarea.blur()
      this.isInputFocus = false
    },
    getValue() {
      return this.inputValue
    },
  },
}
</script>
<style lang="stylus">
.textarea-wrapper
    display flex
    justify-content space-between
    padding 13px 17px
    background #fff
    .md-input-item-fake
      width 100%
      position relative
      display flex
      align-items center
      .md-input-item-fake-placeholder
        display inline-block
        line-height 22px
        padding-top 0
        font-size 16px
        position absolute
        left 0
        top 0
        width 100%
        color #C9C9C9
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
    .md-field-item-label
      min-width 64px
      font-size 16px
      color #333333
      max-width 112px
      margin-right 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
    .md-textarea-item
        font-size 16px
        line-height 22px
        color #3086F5 /* 光标的颜色*/ 
        text-shadow 0px 0px 0px #333 /* 文本颜色 */
        -webkit-text-fill-color transparent 
        box-sizing border-box
        width 100%
        background transparent
        border none
        outline none
        resize none
        appearance none
        -webkit-tap-highlight-color transparent
        position relative
        z-index 99
        &::-webkit-input-placeholder
            color #C9C9C9
            font-size 16px
            text-shadow none
            -webkit-text-fill-color initial
  .md-textarea-item__clear
    display flex
    align-items center
    color #999
    margin-left 5px
  &__clear
    padding 6px 0
    color #999
    .md-icon
      display flex
  .center
     .md-textarea-item,
     .md-input-item-fake-placeholder 
        text-align center
  .left
     .md-textarea-item,
     .md-input-item-fake-placeholder 
        text-align left 
  .right
     .md-textarea-item,
     .md-input-item-fake-placeholder 
        text-align right
</style>