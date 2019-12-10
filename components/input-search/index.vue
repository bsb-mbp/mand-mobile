<template>
<div class="search-wrapper" :class="align">
  <md-field-item
    class="md-input-item"
    :class="[
      isInputActive ? 'is-active' : '',
      isInputFocus ? 'is-focus' : '',
      isDisabled ? 'is-disabled': '',
      inputEnv
    ]"
  >
    <md-icon name="search" id="search-icon" size="xs" style="position:absolute;left:5px"/>
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
        class="search-center"
      >
        <md-icon name="search" size="xs" style="padding-right:3px"/><span class="shake">{{placeholder}}</span>
      </span>
      <div
        v-show="!isInputEmpty && isInputFocus"
        class="md-input-item-clear"
        @click="$_clearInput"
      >
        <md-icon name="clear" size="xs"/>
      </div>
    </template>

    <template slot="right">
      <span v-show="cancelText" class="cancelSearch" @click="$_cancel" v-text="cancelText" />
      <slot name="right" />
    </template>
  </md-field-item>
</div>
</template>

<script>
import Icon from '../icon';
import Field from '../field';
import {noop, isIOS, isAndroid, randomId} from '../_util'
import FieldItem from '../field-item';

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
    }
  },

  data() {
    return {
      inputValue: '',
      isInputFocus: false,
    };
  },

  computed: {
    inputEnv() {
      /* istanbul ignore next */
      if (isIOS) {
        return 'is-ios'
      } else if (isAndroid) {
        return 'is-android'
      } else {
        return 'is-browser'
      }
    },
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
    document.querySelector("#search-icon").style.display = "none";
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
      if(this.align == 'center'){
        this.$el.querySelector(".search-center").style.display="none";
        this.$el.querySelector("#search-icon").style.display="block";
      }
      
      this.$emit('focus', this.name);
    },
    $_onBlur() {
      if(this.align == 'center'&& this.isInputEmpty){
        this.$el.querySelector(".search-center").style.display="flex";
        this.$el.querySelector("#search-icon").style.display="none";
      }
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
    .is-ios
      .md-input-item-input::-webkit-input-placeholder
        position relative
        overflow visible
        bottom 1px
    .is-android
      .shake
        padding-top 2px
      .md-input-item-input::-webkit-input-placeholder
        position relative
        overflow visible
        top 1px
    .md-field-item-control
      background #eaeaea
      border-radius 6px
      overflow hidden
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
      height 34px
      z-index 2
      font-size 16px
      padding 0 0
      background-color transparent
      width 100%
      outline 0
      border 0
      appearance none
      padding-left 30px   
      color #3086F5 !important
      text-shadow 0px 0px 0px #333
      -webkit-text-fill-color transparent
    .md-input-item-clear
      margin-right 10px
.cancelSearch
    color #007AFF
    font-size 17px
    padding-left 30px
input[type=search]::-webkit-search-cancel-button
  appearance none
.md-input-item
  .md-field-item-control
    display flex
    align-items center

.md-input-item-input
  &::-webkit-input-placeholder
    text-shadow 0px 0px 0px #c9c9c9
    -webkit-text-fill-color transparent
  &::-webkit-outer-spin-button, &::-webkit-inner-spin-button
    appearance none

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
 .left
   .md-icon.icon-svg.xs
     width 16px
     height 16px
     line-height 16px
   .md-input-item-input
     font-size 14px
     height 30px
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
