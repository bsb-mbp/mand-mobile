<template>
<div class="amount amount-wrapper">
    <label class="md-field-item-label">{{label}}</label>
  <div
    class="md-stepper"
    :class="{'disabled': disabled}"
  >
    <button
      class="md-stepper-button md-stepper-button-reduce"
      :class="{'disabled': isMin}"
      @click="$_reduce"
      :disabled = isMin
      @touchstart=""
    >
      <div class="outline"></div>
    </button>
    <div class="md-stepper-number">
      <input type="tel"
        :maxlength ="contentLength"
        :value="currentNum"
        :readOnly="readOnly"
        @input="$_onInput"
        @blur="$_onChange">
    </div>
    <button
      class="md-stepper-button md-stepper-button-add"
      :disabled = isMax
      :class="{'disabled': isMax}"
      @click="$_add"
      @touchstart=""
    >
      <div class="outline"></div>
    </button>
  </div>
</div>
</template>

<script>
import {warn} from '../_util'
function getDecimalNum(num) {
  try {
    return num.toString().split('.')[1].length
  } catch (e) {
    return 0
  }
}

function accAdd(num1, num2) {
  let r1 = getDecimalNum(num1)
  let r2 = getDecimalNum(num2)
  let m = Math.pow(10, Math.max(r1, r2))
  return +((num1 * m + num2 * m) / m)
}

function subtr(num1, num2) {
  let r1 = getDecimalNum(num1)
  let r2 = getDecimalNum(num2)
  let m = Math.pow(10, Math.max(r1, r2))
  let n = r1 >= r2 ? r1 : r2
  return +((num1 * m - num2 * m) / m).toFixed(n)
}

export default {
  name: 'md-stepper',

  components: {},

  props: {
    label: {
      type: String,
      default: ""
    },
    defaultValue: {
      type: [Number, String],
      default: 0,
    },
    value: {
      type: [Number, String],
      default: 0,
    },
    step: {
      type: [Number, String],
      default: 1,
    },
    min: {
      type: [Number, String],
      default: -Number.MAX_VALUE,
    },
    max: {
      type: [Number, String],
      default: Number.MAX_VALUE,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    isInteger: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isMin: false,
      isMax: false,
      currentNum: 0
    }
  },

  computed: {
    contentLength() {
      if (!this.value) {
        return 12
      }
      const length = this.value.toString().length
      return length > 12 ? length : 12
    },
  },

  watch: {
    defaultValue(val) {
      this.currentNum = this.$_getCurrentNum(val)
    },
    value(val) {
      this.currentNum = this.$_getCurrentNum(val)
    },
    min(val) {
      if (this.currentNum < val) {
        this.currentNum = val
      }
      this.$_checkStatus()
    },
    max(val) {
      if (this.currentNum > val) {
        this.currentNum = val
      }
      this.$_checkStatus()
    },
    currentNum(val, oldVal) {
      this.$_checkStatus()

      this.$emit('input', val)
      this.$emit('change', val)

      const diff = val - oldVal

      // judge the event of operation
      if (diff > 0) {
        this.$emit('increase', diff)
      } else if (diff < 0) {
        this.$emit('decrease', Math.abs(diff))
      }
    },
  },

  mounted() {
    // verify that the minimum value is less than the maximum value
    this.$_checkMinMax()
    this.currentNum = this.$_getCurrentNum(this.value || this.defaultValue)
    this.$_checkStatus()
  },

  methods: {
    // MARK: 私有方法
    $_reduce() {
      if (this.disabled || this.isMin) {
        return
      }
      this.currentNum = subtr(this.currentNum, this.step)
      this.$_onChange()
    },
    $_add() {
      if (this.disabled || this.isMax) {
        return
      }
      this.currentNum = accAdd(this.currentNum, this.step)
      this.$_onChange()
    },
    $_formatNum(value) {
      // @elist
      value = String(value).replace(/[^0-9.-]/g, '')
      return value === '' ? 0 : this.isInteger ? Math.floor(value) : +value
    },
    $_getCurrentNum(value) {
      return Math.max(Math.min(this.max, this.$_formatNum(value)), this.min)
    },
    $_checkStatus() {
      this.isMin = subtr(this.currentNum, this.step) < this.min
      this.isMax = accAdd(this.currentNum, this.step) > this.max
    },
    $_checkMinMax() {
      if (this.min > this.max) {
        warn('[md-vue-stepper] minNum is larger than maxNum')
      }
      return this.max > this.min
    },

    // MARK: 监听事件方法, 如 $_onButtonClick
    $_onInput(event) {
      const {value} = event.target
      const formatted = this.$_formatNum(value)
      if (+value !== formatted) {
        event.target.value = formatted
      }
      this.currentNum = formatted
    },
    $_onChange() {
      this.currentNum = this.$_getCurrentNum(this.currentNum) 
    },
  },
}

</script>

<style lang="stylus">
.amount.amount-wrapper
    background-color #ffffff
    padding 0 17px
    display flex
    align-items center
    justify-content space-between
  .md-stepper
    font-size 16px
    display flex
    align-items center
    justify-content flex-end
    &.disabled
      .md-stepper-button
        &:before,
        &:after
          background-color #c9c9c9
      input
        opacity .3
.amount.amount-wrapper > .md-field-item-label
    margin-right 10px
.md-stepper-button
  position relative
  width 50px
  height 30px
  border-radius 15px
  background #ffffff
  border none 
  outline none
  &:active
    background #595959
    &:after,
    &:before
      background #ffffff !important 
  &:after
    content ""
    position absolute
    width 12px
    height 2px
    background #595959
    top 50%
    left 50%
    transform translate(-50%, -50%)
  &.md-stepper-button-add
    &:before
      content ""
      position absolute
      width 2px
      height 12px
      top 50%
      left 50%
      background #595959
      transform translate(-50%, -50%)
&.disabled
  .outline
    border-color #c9c9c9
  &:before,
  &:after
    background #c9c9c9
.outline
  position absolute
  top 0
  left 0
  right 0
  bottom 0
  width 200%
  height 200%
  border 1px solid #595959
  border-radius 30px
  transform scale(0.5) translate(-50%, -50%)
  pointer-events none
  box-sizing border-box
  transform-origin 50% 50%
.md-stepper-number
  text-align center
  input
    width 130px
    border none
    outline none
    font-size 16px
    padding 15px 0
    background-color transparent
    box-sizing border-box
    text-align center
    color #3086F5 /* 光标的颜色*/ 
    text-shadow 0px 0px 0px #333 /* 文本颜色 */ 
    -webkit-text-fill-color transparent
</style>
