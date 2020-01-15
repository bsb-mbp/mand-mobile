<template>
  <div class="textarea-wrapper" :class="[align, inputEnv]">
    <label class="md-field-item-label">{{label}}</label>
      <textarea
        ref="textarea"
        v-model="inputValue"
        :placeholder="placeholder"
        class="md-textarea-item"
        :readonly="readonly"
        :maxlength="maxlength"
        :rows="rows"
        @input="$_onInput"
        @focus="$_onFocus"
        @blur="$_onBlur"
        @keyup="$_onKeyup"
        @keydown="$_onKeydown"
      />
    <div
      v-if="clearable && !readonly"
      v-show="!isInputEmpty && isInputFocus"
      class="md-textarea-item__clear"
      @click="$_clearInput"
    >
      <md-icon name="clear" />
    </div>
  </div>
</template>
<script>
import Icon from '../icon';
import {isIOS, isAndroid} from '../_util';
export default {
  name: 'mdTextarea',
  components: {
    [Icon.name]: Icon
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    maxlength: {
      type: [String, Number],
      default: ''
    },
    maxHeight: {
      type: [String, Number],
      default: '66'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    rows: {
      type: [String, Number],
      default: '1'
    },
    autosize: {
      type: Boolean,
      default: true
    },
    align: {
      // left, center, right
      type: String,
      default: 'right'
    }
  },
  data() {
    return {
      maxHeightInner: this.maxHeight,
      inputValue: this.value,
      isInputFocus: false
    };
  },
  computed: {
    inputEnv() {
      /* istanbul ignore next */
      if (isIOS) {
        return 'is-ios';
      }
      else if (isAndroid) {
        return 'is-android';
      }
      return 'is-browser';
    },
    isInputEmpty() {
      return !this.inputValue.length;
    }
  },
  watch: {
    value(val) {
      this.inputValue = val;
      this.resizeTextarea();
    },
    inputValue(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    },
    maxHeight(val) {
      this.maxHeightInner = val;
      this.resizeTextarea();
    }
  },
  mounted() {
    this.resizeTextarea();
  },
  methods: {
    $_onInput(event) {
      this.inputValue = event.target.value;
      this.$nextTick(() => {
        this.resizeTextarea();
      });
    },
    $_clearInput() {
      this.inputValue = '';
      this.$nextTick(() => {
        this.resizeTextarea();
      });
      this.$emit('clear', event);
      this.focus();
    },
    $_onKeyup(event) {
      this.$emit('keyup', event);
    },
    $_onKeydown(event) {
      this.$emit('keydown', event);
    },
    $_onFocus() {
      this.isInputFocus = true;
      this.$emit('focus');
    },
    $_onBlur() {
      setTimeout(() => {
        this.isInputFocus = false;
        this.$emit('blur');
      }, 100);
    },
    $_calcTextareaHeight(textarea) {
      // Triggers the textarea to repaint
      textarea.style.height = 'auto';
      let scrollHeight = textarea.scrollHeight;
      if (this.maxHeightInner && scrollHeight > this.maxHeightInner) {
        scrollHeight = this.maxHeightInner;
      }
      textarea.style.height = scrollHeight + 'px';
    },
    // public
    resizeTextarea() {
      if (this.autosize) {
        this.$_calcTextareaHeight(this.$refs.textarea);
      }
    },
    focus() {
      this.$refs.textarea.focus();
      setTimeout(() => {
        this.isInputFocus = true;
      }, 200);
    },
    blur() {
      this.$refs.textarea.blur();
      this.isInputFocus = false;
    },
    getValue() {
      return this.inputValue;
    }
  }
};
</script>
<style lang="stylus">
.textarea-wrapper
    display flex
    justify-content space-between
    padding 13px 17px
    background #fff
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
  .is-ios
    .md-textarea-item
          &::-webkit-input-placeholder
            position relative
            right 3px
</style>
