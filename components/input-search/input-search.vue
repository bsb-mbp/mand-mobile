<template>
<div class="search-wrapper" :class="align">
  <md-field-item
    class="md-input-item"
    :class="[
      isInputActive ? 'is-active' : '',
      isInputFocus ? 'is-focus' : '',
      isDisabled ? 'is-disabled': '',
      isAmount ? 'is-amount': '',
      size
    ]"
  >
    <!-- ------------ -->
    <!--    INPUT     -->
    <!-- ------------ -->
    <!-- Native Input -->
    <md-icon v-show="align!=='center'||align==='center'&&isInputFocus" name="search" />
    <template>
      <input
        v-model="inputValue"
        class="md-input-item-input"
        type="search"
        :placeholder="inputPlaceholder"
        :disabled="isDisabled"
        :readonly="readonly"
        :maxlength="maxlength"
        autocomplete="off"
        @focus="$_onFocus"
        @blur="$_onBlur"
        @keyup="$_onKeyup"
        @keydown="$_onKeydown"
        @input="$_onInput"
      >
      <span
        v-if="align=='center'"
        v-show="!isInputFocus"
        class="search-center"
      >
        <md-icon name="search" />{{placeholder}}
      </span>
      <div
        v-show="!isInputEmpty && isInputFocus"
        class="md-input-item-clear"
        @click="$_clearInput"
      >
        <md-icon name="clear" />
      </div>
    </template>

    <template slot="right">
      <!-- ------------ -->
      <!--  CLEART BTN  -->
      <!-- ------------ -->
      <span v-show="cancelText" class="cancelSearch" @click="$_cancel" v-text="cancelText" />
      <!-- ------------ -->
      <!--  RIGHT SLOT  -->
      <!-- ------------ -->
      <slot name="right" />
    </template>
  </md-field-item>
</div>
</template>

<script>
import Icon from '../mand-mobile/components/icon';
import Field from '../mand-mobile/components/field';
import FieldItem from '../mand-mobile/components/field-item';

export default {
  name: 'InputSearch',
  components: {
    [Icon.name]: Icon,
    [FieldItem.name]: FieldItem,
    [Field.name]: Field
  },

  inject: {
    rootField: {
      from: 'rootField',
      default: () => ({})
    }
  },

  props: {
    cancelText: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    maxlength: {
      type: [String, Number],
      default: ''
    },
    size: {
      // large, normal
      type: String,
      default: 'normal'
    },
    align: {
      // left, center, right
      type: String,
      default: 'left'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    isAmount: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      inputValue: '',
      inputNumberKeyboard: '',
      isInputFocus: false
    };
  },

  computed: {
    inputMaxLength() {
      if (this.type === 'phone') {
        return 11;
      }
      return this.maxlength;

    },
    inputPlaceholder() {
      return this.align === 'center' ? '' : this.placeholder;
    },
    isInputActive() {
      return !this.isInputEmpty || this.isInputFocus;
    },
    isInputEmpty() {
      return !this.inputValue.length;
    },
    isDisabled() {
      return this.rootField.disabled || this.disabled;
    }
  },

  watch: {
    inputValue(val) {
      this.$emit('input', val);
    },
    isInputFocus(val) {
      if (val) {
        this.$emit('focus', this.name);
      }
      else {
        this.$emit('blur', this.name);
      }
    }
  },
  created() {
  },
  mounted() {
    if (this.align === 'center') {
      document.querySelector('.md-field-item-control').style.background = '#fff';
    }
  },

  methods: {
    $_cancel() {
      this.$emit('cancel');
    },
    $_subValue(val) {
      const len = this.inputMaxLength;
      if (len !== '') {
        return val.substring(0, len);
      }
      return val;

    },
    $_clearInput() {
      this.inputValue = '';
      this.focus();
    },

    // MARK: events handler
    $_onInput(event) {
      this.$emit('change', this.name, event);
    },
    $_onKeyup(event) {
      this.$emit('keyup', this.name, event);
      if (+event.keyCode === 13 || +event.keyCode === 108) {
        this.$emit('confirm', this.name, this.inputValue);
      }
    },
    $_onKeydown(event) {
      this.$emit('keydown', this.name, event);
    },
    $_onFocus() {
      this.isInputFocus = true;
      this.$emit('focus', this.name);
    },
    $_onBlur() {
      setTimeout(() => {
        this.isInputFocus = false;
        this.$emit('blur', this.name);
      }, 100);
    },

    // MARK: public methods
    focus() {
      this.$el.querySelector('.md-input-item-input').focus();
      setTimeout(() => {
        this.isInputFocus = true;
      }, 200);
    },
    blur() {
      this.$el.querySelector('.md-input-item-input').blur();
      this.isInputFocus = false;
    },
    getValue() {
      return this.inputValue;
    }
  }
};

</script>

<style lang="stylus">
.search-wrapper
    .md-field-item-control
        background #eaeaea
        height 30px
        border-radius 6px
    .search-center
      position absolute
      display flex
      justify-content center
      align-items center
      font-size 16px
      color #c9c9c9
      left 0
      right 0
      top 0
      bottom 0
    .md-field-item-right
        right 0
    .md-input-item-input
      z-index 2
      padding 0
      font-size 14px
      background-color transparent
      width 100%
      appearance none
      border 0
      outline 0
    .md-icon.icon-font.md
        color #898989
        font-size 14px
        padding 0 10px
.cancelSearch
    color #007AFF
    font-size 17px
    padding-left 30px
input[type=search]::-webkit-search-cancel-button
  -webkit-appearance none
.md-input-item
  .md-field-item-control
    display flex
    align-items center

.md-input-item-clear
    color #999
    text-align center
  .md-icon.icon-font.md
    font-size 20px
    display flex
    border-radius 50%
.md-input-item-input
  &:disabled, &[disabled]
    opacity 1
  &::-webkit-input-placeholder
    color #C9C9C9
  &::-webkit-outer-spin-button, &::-webkit-inner-spin-button
    -webkit-appearance none

.md-input-item-fake-placeholder
  position absolute
  left 0
  width 100%
  color #898989

.md-input-item
  &.left
    .md-input-item-input
      text-align left

  &.center
    .md-input-item-input
      text-align center

  &.right
    .md-input-item-input
      text-align right

  &.is-disabled
    .md-input-item-input
      -webkit-text-fill-color #898989
      color #898989


  &.large
    .md-input-item-input,
    .md-input-item-fake
      font-size 32px
      line-height 32px
      height 42px
    .md-input-item-input::-webkit-input-placeholder
        font-size 16px
    .md-field-item-left
        position relative
        font-size 30px

    .md-field-item-content
        height 48px
        left -7px

  &.is-ios
    .md-input-item-input::-webkit-input-placeholder
      position relative
      overflow visible
    .md-input-item-fake::after
      border-right solid 6px #2C6CF5
      border-radius 2px
  &.is-android
    .md-input-item-fake::after
      border-right solid 4px color-text-base

@-webkit-keyframes keyboard-cursor
  0%
    opacity 1
  50%
    opacity 0
  to
    opacity 1
@keyframes keyboard-cursor
  0%
    opacity 1
  50%
    opacity 0
  to
    opacity 1
</style>
