<template>
<div class="content-wraper" :class="{'line-bottom':size!='large'}" @click="$_onClick">
  <div style="height:20px" v-if="size=='large'">
    <i class="unit-money" v-show="unit">{{unit}}</i>
  </div>
  <md-field-item
    class="md-input-item"
    :class="[
      isInputError() ? 'is-error' : '',
      isInputBrief() && !isInputError() ? 'with-brief' : '',
      isDisabled ? 'is-disabled': '',
      clearable ? 'is-clear' : '',
      isAmount ? 'is-amount': '',
      inputEnv,
      align,
      size,
      type
    ]" 
    :label="label"
    :addon="addon"
    :imgSrc="imgSrc"
  >
    <template slot="left">
      <slot name="left"></slot>
    </template>
    <template>
      <input
        class="md-input-item-input"
        :type="inputType"
        :name="name"
        v-model="inputBindValue"
        :placeholder="placeholder"
        :disabled="isDisabled"
        :readonly="readonly"
        :maxlength="isFormative ? '' : maxlength"
        autocomplete="off"
        @focus="$_onFocus"
        @blur="$_onBlur"
        @keyup="$_onKeyup"
        @keydown="$_onKeydown"
        @input="$_onInput"
      />
      <div
        class="md-input-item-clear"
        v-if="clearable && !isDisabled && !readonly"
        v-show="!isInputEmpty"
        @click="$_clearInput"
      >
        <md-icon name="clear" size="xxs"></md-icon>
      </div>
    </template>

    <template slot="right">
      <slot name="right"></slot>
    </template>

    <template slot="children">
      <div
        v-if="isInputBrief()"
        class="md-input-item-brief"
      >
        <p v-if="brief !== ''" v-html="brief"></p>
        <slot name="brief" v-else></slot>
      </div>
    </template>
  </md-field-item>
  <div
      v-if="isInputError()"
      class="md-input-item-msg"
    >
    <p v-if="error !== ''" v-html="error"></p>
    <slot name="error" v-else></slot>
  </div>
</div>
</template>

<script>
import Icon from '../icon'
import FieldItem from '../field-item'
import {getCursorsPosition, setCursorsPosition} from './cursor'
import {noop, isIOS, isAndroid, randomId} from '../_util'
import {formatValueByGapRule, formatValueByGapStep, trimValue} from '../_util/formate-value'

export default {
  name: 'md-input-item',
  components: {
    [Icon.name]: Icon,
    [FieldItem.name]: FieldItem
  },

  inject: {
    rootField: {
      from: 'rootField',
      default: () => ({}),
    },
  },

  props: {
    type: {
      // text, bankCard, password, phone, money, digit
      type: String,
      default: 'text',
    },
    name: {
      type: [String, Number],
      default() {
        return randomId('input-item')
      },
    },
    label: {
      type: String,
      default: '',
    },
    brief: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    maxlength: {
      type: [String, Number],
      default: '',
    },
    size: {
      // large, normal
      type: String,
      default: 'normal',
    },
    align: {
      // left, center, right
      type: String,
      default: 'left',
    },
    error: {
      type: String,
      default: '',
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    imgSrc: {
      type:  String,
      default: '',
    },
    addon: {
      type: String,
      default: '',
    },
    isFormative: {
      type: Boolean,
      default() {
        const type = this.type
        return type === 'bankCard' || type === 'phone' || type === 'money' || type === 'digit'
      },
    },
    isAmount: {
      type: Boolean,
      default: false,
    },
    reg:{
      type: RegExp,
      default: noop
    }
  },

  data() {
    return {
      inputValue: '',
      inputBindValue: '',
      isInputFocus: false,
    }
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
    inputType() {
      let inputType = this.type || 'text'
      if (inputType === 'bankCard' || inputType === 'phone' || inputType === 'digit') {
        inputType = 'tel'
      } else if (inputType === 'money') {
        inputType = 'text'
      }
      return inputType
    },
    inputMaxLength() {
      if (this.type === 'phone') {
        return 11
      } else if(this.type==="bankCard") {
        return 19
      }else{
           return this.maxlength
      }
    },
    isInputEmpty() {
      return !this.inputValue.length
    },
    isDisabled() {
      return this.rootField.disabled || this.disabled
    },
    unit: function() {
						try {
							var _REG = "千百十亿千百十万千百十元"
							var num = Number(this.inputValue);
              num = parseInt(num);
							var temp = "";
							for(var i = 0; i < num.toString().length; i++) {
								temp += "" + _REG.split("").reverse().join("").charAt(i);
							}
							return temp.split("").reverse().join("").replace(/千百十亿千百十万千百十元$/, '千亿').replace(/百十亿千百十万千百十元$/, '百亿').replace(/十亿千百十万千百十元$/, '十亿').replace(/亿千百十万千百十元$/, '亿').replace(/千百十万千百十元$/, '千万').replace(/百十万千百十元$/, '百万').replace(/十万千百十元$/, '十万').replace(/万千百十元$/, '万').replace(/千百十元|百十元|十元|元$/, '');
						} catch(e) {
							return "";
						}
					}
  },

  watch: {
    value(val) {
      // Filter out two-way binding
      if (val !== this.$_trimValue(this.inputValue)) {
        this.inputValue = this.$_formateValue(this.$_subValue(val + '')).value
      }
    },
    inputValue(val) {
      this.inputBindValue = val
      val = this.isFormative ? this.$_trimValue(val) : val
      this.$emit('input', val)
      this.$emit('change', this.name, val)
    },
    isInputFocus(val) {
      if (val) {
        this.$emit('focus', this.name)
      } else {
        this.$emit('blur', this.name)
      }
    },
  },
  created() {
    this.inputValue = this.$_formateValue(this.$_subValue(this.value + '')).value
  },
  mounted() {
  },

  methods: {
     $_onClick(e) {
      if (!this.disabled) {
        this.$emit('click', e)
      }
    },
    formation(name,curValue,curPos){
      curValue = this.$_subValue(trimValue(curValue));
      if(!this.reg.test(curValue)){
        curValue = this.inputValue
      }
      return {value: curValue, range: curPos};
    },
    // MARK: private methods
    $_formateValue(curValue, curPos = 0) {
      const type = this.type
      const name = this.name
      const oldValue = this.inputValue
      const isAdd = oldValue.length > curValue.length ? -1 : 1
      let formateValue = {value: curValue, range: curPos}
      // no format
      if (!this.isFormative|| curValue === '') {
        return formateValue
      }

      // custom format by user
      if(this.reg){
        const customValue = this.formation(name, curValue, curPos);
        if (customValue) {
          return customValue
        }
      }
      // default format by component
      let gap = ' '
      switch (type) {
        case 'bankCard':
          curValue = this.$_subValue(trimValue(curValue.replace(/\D/g, '')))
          formateValue = formatValueByGapStep(4, curValue, gap, 'left', curPos, isAdd, oldValue)
          break
        case 'phone':
          curValue = this.$_subValue(trimValue(curValue.replace(/^0{0,1}(1[3-9])[0-9]{9}$/, '')))
          formateValue = formatValueByGapRule('3|4|4', curValue, gap, curPos, isAdd)
          break
        case 'money':
          gap = ','
          curValue = this.$_subValue(trimValue(curValue.replace(/[^\d.]/g, '')))
          // curValue = curValue.replace(/\D/g, '')
          const dotPos = curValue.indexOf('.')
          // format if no dot or new add dot or insert befor dot
          const moneyCurValue = curValue.split('.')[0]
          const moneyCurDecimal = ~dotPos ? `.${curValue.split('.')[1]}` : ''

          formateValue = formatValueByGapStep(
            3,
            trimValue(moneyCurValue, gap),
            gap,
            'right',
            curPos,
            isAdd,
            oldValue.split('.')[0],
          )
          formateValue.value += moneyCurDecimal
          break
        case 'digit':
          curValue = this.$_subValue(trimValue(curValue.replace(/\D/g, '')))
          formateValue.value = curValue
          break
        case 'email':
          /* istanbul ignore next */
          curValue = this.$_subValue(trimValue(curValue.replace(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, '')))
          formateValue.value = curValue
        default:
          break
      }

      return formateValue
    },
    isInputError() {
      return this.$slots.error || this.error !== ''
    },
    isInputBrief() {
      return this.$slots.brief || this.brief !== ''
    },
    $_trimValue(val) {
      return trimValue(val, '\\s|,')
    },
    $_subValue(val) {
      const len = this.inputMaxLength
      if (len !== '') {
        return val.substring(0, len)
      } else {
        return val
      }
    },
    $_clearInput() {
      this.inputValue = '';
      this.focus()
    },

    // MARK: events handler
    $_onInput(event) {
      this.isInputFocus = true
      const formateValue = this.$_formateValue(
        event.target.value,
        this.isFormative ? getCursorsPosition(event.target) : 0,
      )
      this.inputValue = formateValue.value
      this.inputBindValue = formateValue.value

      if (this.isFormative) {
        this.$nextTick(() => {
          setCursorsPosition(event.target, formateValue.range)
        })
      }
      this.$emit('change', this.name, event)
    },
    $_onKeyup(event) {
      this.$emit('keyup', this.name, event)
      if (+event.keyCode === 13 || +event.keyCode === 108) {
        this.$emit('confirm', this.name, this.inputValue)
      }
    },
    $_onKeydown(event) {
      this.$emit('keydown', this.name, event)
    },
    $_onFocus() {
      this.$emit('focus', this.name)
    },
    $_onBlur() {
        this.$emit('blur', this.name)
    },
    $_onFakeInputClick(event) {
      if (this.isDisabled || this.readonly) {
        return
      }

      this.$_blurFakeInput()

      if (!this.isInputFocus) {
        this.$_focusFakeInput(event)
      }
    },
    $_onNumberKeyBoardEnter(val) {
      this.inputValue = this.$_formateValue(this.inputValue + val).value
    },
    $_onNumberKeyBoardDelete() {
      const inputValue = this.inputValue
      if (inputValue === '') {
        return
      }
      this.inputValue = this.$_formateValue(inputValue.substring(0, inputValue.length - 1)).value
    },
    $_onNumberKeyBoardConfirm() {
      this.$emit('confirm', this.name, this.inputValue)
    },

    // MARK: public methods
    focus() {
        this.$el.querySelector('.md-input-item-input').focus()
    },
    blur() {
        this.$el.querySelector('.md-input-item-input').blur()
        //this.isInputFocus = false    
    },
    getValue() {
      return this.inputValue
    },
  },
}

</script>

<style lang="stylus">
@require "./../_style/mixin/util.styl"
@require "./../_style/mixin/theme.components.styl"
@require "./../_style/mixin/theme.basic.styl"
@require "./../../theme.custom.styl"
.content-wraper
  background #ffffff
  .unit-money
    font-style normal
    font-size 12px
    color #B9B8B8
    margin-left 56px
    border-left 1px solid #B9B8B8
    padding 5px 5px 3px
.line-bottom
    position relative
    &::after
      content ""
      position absolute
      bottom 0px
      left 17px
      right 0px
      border-bottom 1px solid #eaeaea
      transform scaleY(.5)
      transform-origin 0 0 
.md-input-item
  .md-field-item-title
    width 25%
    height 44px
    line-height 44px
    font-size 16px
    color #333333
  .md-field-item-control
    display flex
    align-items center

.md-input-item-clear
    color #999
    text-align center
    margin-left 5px
  .md-icon.icon-font.md
    font-size 20px
    display flex
    border-radius 50%

.md-input-item-input
  width 100%
  line-height 22px
  color #333333
  font-size 16px
  padding 13px 0
  border-radius 3px
  -webkit-appearance none
  border none
  outline none
  box-sizing border-box
  -webkit-tap-highlight-color transparent
  appearance none

.md-input-item-input
  &:disabled, &[disabled]
    opacity 1
  &::-webkit-input-placeholder
    color #C9C9C9
  &::-webkit-outer-spin-button, &::-webkit-inner-spin-button
    -webkit-appearance none

.md-input-item-msg,
.md-input-item-brief
  word-break()
  &:not(:last-child)
    margin-bottom 10px

.md-input-item-msg
  background #eaeaea
  font-size 12px
  color #F43F3F
  padding: 5px 0 0 17px

.md-input-item
  &.left
    .md-input-item-input,
    .md-input-item-fake
      text-align left

  &.center
    .md-input-item-input,
    .md-input-item-fake
      text-align center

  &.right
    .md-input-item-input,
    .md-input-item-fake
      text-align right


  &.is-disabled
    .md-input-item-input,
      -webkit-text-fill-color #898989
      color #898989


  &.large
    .md-input-item-input
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
        padding-right 10px !important
  &.is-error
    .md-field-item-content
      hairline(bottom, input-item-color-error, 0, 4px)

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
