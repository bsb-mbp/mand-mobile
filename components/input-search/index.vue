<template>
<div :class="[align,align =='center'? 'search-wrapper' : '']">
  <div
    class="md-field-item"
    :class="[
      inputEnv
    ]"
  >
    <md-icon v-show="isShow" name="search" size="xs" style="position:absolute;left:5px" />
    <div class="md-field-item-content">
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
        v-if="align==='center'"
        class="search-center"
        :class="{'d-none':isShow}"
      >
        <md-icon name="search" size="xs" /><span class="shake">{{placeholder}}</span>
      </span>
      <div
        class="md-input-item-clear"
        :class="{vs:!isInputEmpty && isInputFocus}"
        @click="$_clearInput"
      >
        <md-icon name="clear" size="xs" />
      </div>
    </div>

    <div>
      <span v-if="cancelText" class="cancelSearch" @click="$_cancel" v-text="cancelText" />
      <slot name="right" />
    </div>
  </div>
</div>
</template>

<script>
import Icon from '../icon';
import Field from '../field';
import {isIOS, isAndroid} from '../_util';
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
    value: {
      type: String,
      default: ''
    },
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
      isShow: true,
      inputValue: '',
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
    value(val) {
      this.inputValue = val;
    },
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
  mounted() {
    if (this.align === 'center') {
      this.isShow = false;
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
      this.$emit('change', event);
    },
    $_onKeyup(event) {
      this.$emit('keyup', this.name, event);
      if (+event.keyCode === 13 || +event.keyCode === 108) {
        this.$emit('confirm', this.inputValue);
      }
    },
    $_onKeydown(event) {
      this.$emit('keydown', event);
    },
    $_onFocus() {
      this.isInputFocus = true;
      if (this.align === 'center') {
        this.isShow = true;
      }

      this.$emit('focus', this.name);
    },
    $_onBlur() {
      if (this.align === 'center' && this.isInputEmpty) {
        this.isShow = false;
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

<style lang="stylus" scoped>
.search-wrapper
    background #C7C6CB
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
.md-field-item
  position relative
  display flex
  align-items center
  justify-content space-between
  .md-field-item-content
    padding 0
    position relative
    flex 1
    display flex
    align-items center
    justify-content space-between
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
    .md-icon.icon-svg.xs
      padding-right 3px
  .md-input-item-input
    height 34px
    z-index 2
    font-size 16px
    padding 0 0
    background-color transparent
    width 100%
    outline 0
    border 0 !important
    appearance none !important
    padding-left 30px !important
    color #3086F5 !important
    text-shadow 0px 0px 0px #333
    -webkit-text-fill-color transparent
  .md-input-item-clear
    margin-right 10px
    visibility hidden
  .vs
    visibility visible
  .cancelSearch
    color #007AFF
    font-size 17px
    padding-left 30px
input[type=search]::-webkit-search-cancel-button
  appearance none
.md-input-item-input
  &::-webkit-input-placeholder
    text-shadow 0px 0px 0px #c9c9c9
    -webkit-text-fill-color transparent
  &::-webkit-outer-spin-button, &::-webkit-inner-spin-button
    appearance none

.left
  .md-input-item-input
    text-align left
    font-size 14px
    height 30px
  .md-icon.icon-svg.xs
    width 16px
    height 16px
    line-height 16px
  .md-field-item-content
    border-radius 6px
    background rgba(0, 0, 0, .1)
.center
  padding 12px 17px
  .md-field-item
    background #fff
    border-radius 5px
    position relative
  #search-icon
    display none

.right
  .md-input-item-input
    text-align right
.d-none
  display none !important
</style>
