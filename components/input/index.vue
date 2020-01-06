<template>
  <fieldset class="md-field">
    <header v-if="title || $slots.header || $slots.action || info || edit" class="md-field-header">
      <div class="md-field-heading">
        <legend v-if="title" class="md-field-title" v-text="title" />
        <slot name="header" />
      </div>
      <div class="md-field-action" @click="$_handleAction">
        <div v-if="info" class="md-field-action-info">{{info}}<md-icon name="info" /></div>
        <div v-else-if="edit" class="md-field-action-edit">{{postScript}}<md-icon name="edit" color="#c9c9c9" /></div>
        <slot v-else name="action" />
      </div>
    </header>
    <div :class="{'line-bottom': isLine}">
      <div v-if="size==='large'" class="unit">
        <i v-show="unit" class="unit-money"> {{unit}} </i>
      </div>
      <div class="md-input-item md-field-item-content" :class="[size, align]">
        <div v-if="label || $slots.left || icon" class="md-field-item-left">
          <label v-if="label" class="md-field-item-label" :class="{'is-icon':icon}" v-text="label" />
          <md-icon v-if="icon" name="info" size="xs" color="#c9c9c9" @click="handleInfo" />
          <slot name="left" />
        </div>
        <div class="md-field-item-control" :class="[inputEnv,readonly? 'is-readonly': '']">
          <div v-if="isRmb" class="rmb">￥</div>
            <input
              ref="input"
              v-model="inputBindValue"
              class="md-input-item-input"
              :type="inputType"
              :placeholder="placeholder"
              :name="name"
              :disabled="disabled"
              :readonly="readonly"
              :maxlength="isFormative ? '' : maxlength"
              autocomplete="off"
              @focus="$_onFocus"
              @blur="$_onBlur"
              @keyup="$_onKeyup"
              @keydown="$_onKeydown"
              @keypress="$_onKeypress"
              @input="$_onInput"
              @paste="$_onPaste"
              @copy="$_onCopy"
              @cut="$_onCut"
              @contextmenu="$_onContextmenu"
            >
          <div
            v-if="clearable && !disabled"
            v-show="!isInputEmpty"
            class="md-input-item-clear"
            @click="$_clearInput"
          >
            <md-icon name="clear" color="#898989" />
          </div>
        </div>
        <div v-if="imgSrc || addon || arrowRight || $slots.right" class="md-field-item-right" @click="handleRight">
          <slot name="right">{{addon}}</slot>
          <img v-if="imgSrc" class="img_icon" :src="imgSrc">
          <md-icon v-if="arrowRight" name="arrow-right" color="aeaeae" size="xs" />
        </div>
      </div>
      <div v-if="isInputBrief()" class="md-field-item-children">
        <div class="md-input-item-brief">
          <p v-if="brief !== ''" v-text="brief" />
          <slot v-else name="brief" />
        </div>
      </div>
      <div v-if="isInputError()" class="md-input-item-msg">
        <p v-if="error !== ''" class="md-input-item-error" v-text="error" />
        <slot v-else name="error" />
      </div>
    </div>
  </fieldset>
</template>

<script>
import Icon from '../icon';
import {getCursorsPosition, setCursorsPosition} from './cursor';
import {noop, isIOS, isAndroid, randomId} from '../_util';
import {formatValueByGapRule, formatValueByGapStep, trimValue} from '../_util/formate-value';

export default {
  name: 'InputItem',
  components: {
    [Icon.name]: Icon
  },
  inject: {
    rootField: {
      from: 'rootField',
      default: () => ({})
    }
  },
  props: {
    type: {
      // text, bankCard, password, phone, money, digit
      type: String,
      default: 'text'
    },
    isRmb: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: false
    },
    name: {
      type: [String, Number],
      default() {
        return randomId('input-item');
      }
    },
    title: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    brief: {
      type: String,
      default: ''
    },
    info: {
      type: String,
      default: ''
    },
    postScript: {
      type: String,
      default: '添加附言'
    },
    edit: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
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
      default: 'right'
    },
    error: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    imgSrc: {
      type: String,
      default: ''
    },
    addon: {
      type: String,
      default: ''
    },
    noLine: {
      type: Boolean,
      default: false
    },
    arrowRight: {
      type: Boolean,
      default: false
    },
    isFormative: {
      type: Boolean,
      default() {
        const type = this.type;
        return type === 'bankCard' || type === 'phone' || type === 'digit';
      }
    },
    reg: {
      type: RegExp,
      default: noop
    }
  },

  data() {
    return {
      inputValue: '',
      inputBindValue: '',
      isInputFocus: false,
      myReg: ''
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
    inputType() {
      let inputType = this.type || 'text';
      if (inputType === 'bankCard' || inputType === 'phone' || inputType === 'digit') {
        inputType = 'tel';
      }
      else if (inputType === 'money') {
        if (this.inputEnv === 'is-ios') {
          inputType = 'number';
        }
        else {
          inputType = 'tel';
        }
      }
      return inputType;
    },
    inputMaxLength() {
      if (this.type === 'phone') {
        return 11;
      }
      return this.maxlength;
    },
    isInputEmpty() {
      return !this.inputValue.length;
    },
    isLine() {
      return this.size !== 'large' && !this.noLine;
    },
    unit: function () {
      let arr = ['万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿'];
      let num = parseInt(this.inputValue, 0);
      var len = num.toString().length;
      return len < 5 ? '' : arr[Math.min(len, 12) - 5];
    }
  },
  watch: {
    value(val) {
      // Filter out two-way binding
      if (val !== this.$_trimValue(this.inputValue)) {
        this.inputValue = this.$_formateValue(this.$_subValue(val + '')).value;
      }
    },
    inputValue(val) {
      this.inputBindValue = val;
      val = this.isFormative ? this.$_trimValue(val) : val;
      this.$emit('input', val);
      this.$emit('change', val);
    },
    reg(val) {
      this.myReg = val;
    },
    isInputFocus(val) {
      if (val) {
        this.$emit('focus');
      }
      else {
        this.$emit('blur');
      }
    }
  },
  created() {
    this.inputValue = this.$_formateValue(this.$_subValue(this.value + '')).value;
  },
  methods: {
    $_handleAction() {
      this.$emit('handle-action');
    },
    handleInfo() {
      this.$emit('handle-info');
    },
    handleRight() {
      this.$emit('handle-right');
    },
    formation(event) {
      if (this.myReg.test(event.currentTarget.value)) {
        this.inputValue = event.currentTarget.value;
      }
      else {
        if (this.inputValue.toString().length === 1 && event.currentTarget.value === '') {
          event.currentTarget.value = this.inputValue = '';
        }
        else {

          event.currentTarget.value = this.inputValue;
        }
      }
      return event.currentTarget.value;
    },
    $_onClick(e) {
      if (!this.disabled) {
        this.$emit('click', e);
      }
    },
    // MARK: private methods
    $_formateValue(curValue, curPos = 0, event) {
      const type = this.type;
      const oldValue = this.inputValue;
      const isAdd = oldValue.length > curValue.length ? -1 : 1;
      let formateValue = {value: curValue, range: curPos};
      // default format by component
      let gap = ' ';
      switch (type) {
        case 'bankCard':
          curValue = this.$_subValue(trimValue(curValue.replace(/\D/g, '')));
          formateValue = formatValueByGapStep(4, curValue, gap, 'left', curPos, isAdd, oldValue);
          break;
        case 'phone':
          curValue = this.$_subValue(trimValue(curValue.replace(/[^\+,#,\*,\d]/g, '')));
          formateValue = formatValueByGapRule('3|4|4', curValue, gap, curPos, isAdd);
          break;
        case 'money':
          this.myReg = /^([1-9][\d]{0,15}|0)(\.[\d]{0,2})?$/;
          if (event) {
            curValue = this.formation(event);
            formateValue.value = curValue;
          }
          break;
        case 'digit':
          curValue = this.$_subValue(trimValue(curValue.replace(/\D/g, '')));
          formateValue.value = curValue;
          break;
        default:
          if (this.myReg && event) {
            curValue = this.formation(event);
            formateValue.value = curValue;
          }
          break;
      }
      return formateValue;
    },
    isInputError() {
      return this.$slots.error || this.error !== '';
    },
    isInputBrief() {
      return this.$slots.brief || this.brief !== '';
    },
    $_trimValue(val) {
      return trimValue(val, '\\s|,');
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
      this.$emit('clear');
      this.focus();
    },
    // MARK: events handler
    $_onInput(event) {
      this.isInputFocus = true;
      const formateValue = this.$_formateValue(
        event.target.value,
        this.isFormative ? getCursorsPosition(event.target) : 0,
        event
      );
      this.inputValue = formateValue.value;
      this.inputBindValue = formateValue.value;

      if (this.isFormative) {
        this.$nextTick(() => {
          setCursorsPosition(event.target, formateValue.range);
        });
      }
      this.$emit('change', event);
    },
    $_onKeyup(event) {
      this.$emit('keyup', event);
      if (+event.keyCode === 13 || +event.keyCode === 108) {
        this.$emit('confirm', this.inputValue);
      }
    },
    $_onKeydown(event) {
      this.$emit('keydown', event);
    },
    $_onKeypress(event) {
      this.$emit('keypress', event);
    },
    $_onFocus(event) {
      this.$emit('focus', event);
      this.focus();
    },
    $_onBlur(event) {
      this.$emit('blur', event);
      this.blur();
    },
    // MARK: public methods
    focus() {
      this.$refs.input.focus();
      this.isInputFocus = true;
    },
    blur() {
      this.$refs.input.blur();
      this.isInputFocus = false;
    },
    $_onPaste(event) {
      this.$emit('paste', event);
    },
    $_onCopy(event) {
      this.$emit('copy', event);
    },
    $_onContextmenu(event) {
      this.$emit('contextmenu', event);
    },
    $_onCut(event) {
      this.$emit('cut', event);
    },
    getValue() {
      return this.inputValue;
    }
  }
};

</script>

<style lang="stylus">
.md-field
  border none
  background #fff
  .left
    .md-input-item-input
      text-align left

  .center
    .md-input-item-input
      text-align center

  .right
    .md-input-item-input
      text-align right
  .md-input-item-input
    width 100%
    box-sizing border-box
    position relative
    z-index 2
    background-color transparent !important
    height 48px
    line-height 22px
    font-size 16px
    padding 15px 0 !important
    margin-bottom 0
    border-radius 3px
    color #3086F5 !important
    text-shadow 0 0 0 #333
    -webkit-text-fill-color transparent
    border none
    outline none
    appearance none
    &[disabled]
      text-shadow 0 0 0 #898989
    &::-webkit-input-placeholder
      color #C9C9C9
      text-shadow none
      -webkit-text-fill-color initial
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
  .md-field-header
    position relative
    overflow hidden
    padding 0 17px
    padding-top 13px
    display flex
    justify-content space-between
    align-items center
    margin-bottom 8px
    .md-field-title
      color #333
      font-size 16px
      line-height 22px
    .md-field-action
      flex-shrink 0
      color #4A90E2
      font-size 14px
      display flex
      align-items center
      .md-field-action-info
        display flex
        align-items center
        .md-icon.icon-svg
          width 18px
          height 18px
          line-height 18px
          margin-left 6px
      .md-field-action-edit
        display flex
        align-items center
        color #898989
        font-size 14px
        .md-icon.icon-svg
          width 24px
          height 24px
          line-height normal
          margin-left 12px
  .large
    .is-android
      .md-input-item-input
        &::-webkit-input-placeholder
          position relative
          bottom 2px
    .is-ios
      .rmb
        padding-top 1px
      .md-input-item-input
          &::-webkit-input-placeholder
            position relative
            top 13px
    .md-field-item-control
      margin-bottom 15px
      height 34px
      .md-input-item-clear
        .md-icon.icon-svg.md
          width 22px
          height 22px
      .md-input-item-input
        font-size 34px
        padding 0
        &::-webkit-input-placeholder
          font-size 20px
        &::-webkit-outer-spin-button, &::-webkit-inner-spin-button
          appearance none
.unit
  height 24px
  .unit-money
    font-style normal
    font-size 12px
    color #B9B8B8
    margin-left 56px
    border-left 1px solid #B9B8B8
    padding 6px 2px 4px

.line-bottom
  position relative
  &::after
    content ""
    position absolute
    bottom 0
    left 17px
    right 0
    border-bottom 1px solid #eaeaea
    transform scaleY(.5)
    transform-origin 0 0

.md-input-item-clear
  color #999
  text-align center
  margin-left 5px
  display flex
  .md-icon.icon-svg.md
    height 20px
    width 20px

.md-input-item-msg
  background #eaeaea
  padding: 5px 17px 17px 17px
  .md-input-item-error
    color #F43F3F
    font-size 12px
    line-height 18px
.is-readonly
  .md-input-item-input
    text-shadow 0 0 0 #898989

.md-field-item-content
    position relative
    padding 0 17px
    display flex
    align-items center
    justify-content space-between
    box-sizing border-box
    .md-field-item-control
      position relative
      flex 1
      line-height 1.2
      .rmb
        font-size 34px
        font-family PingFangSC-Regular
        width 21px
        height 32px
        margin-right 3px
        display flex
        align-items center
        justify-content center
        color #333
    .md-field-item-left
      min-width 64px
      .md-field-item-label
        font-size 16px
        color #333333
        max-width 112px
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        margin-right 20px
       .is-icon
          margin-right 0
      .md-icon.icon-svg
        width 18px
        height 18px
        margin 0 18px 0 6px
    .md-field-item-right
      position relative
      justify-content center
      margin-left 5px
      .img_icon,.md-icon.icon-svg.xs
        width 22px
        height 22px
.md-field-item-children
    font-size 13px
    color #898989
    padding 8px 17px 16px 0
    line-height 20px
    margin-left 17px
    position relative
    &::before
      content ''
      width 200%
      position absolute
      left 0
      right 0
      top 0
      -webkit-transform scale(0.5)
      transform scale(0.5)
      -webkit-transform-origin 0 0
      transform-origin 0 0
      height 1px
      background-color #E5E5E5
    .md-input-item-brief
      min-height 20px
.md-field-item-control,
.md-field-item-left,
.md-field-item-right
    display flex
    align-items center
</style>
