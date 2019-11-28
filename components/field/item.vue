<template>
  <div
    class="md-field-item"
    :class="{
      'is-disabled': currentDisabled,
      'is-align-right': alignRight
    }"
    @click="$_onClick"
  >
      
    <div class="md-field-item-content">
      <label class="md-field-item-label" v-if="label" v-text="label" :style="{'margin-right': ($slots.left ? '5px': '10px')}"></label>
      <span class="md-field-item-left" v-if="$slots.left" :class="{'left-content':label}">
        <slot name="left"></slot>
      </span>
      <div class="md-field-item-control">
        <slot>
          <template v-if="content">{{ content }}</template>
          <div class="md-field-item-placeholder" v-else-if="placeholder" v-text="placeholder"></div>
        </slot>
      </div>
      <div class="md-field-item-right" v-if="imgSrc || addon || $slots.right">
        <slot name="right">{{ addon }}</slot>
        <img v-show="imgSrc" class="ren_icon" :src="imgSrc"/>
      </div>
    </div>
    <div class="md-field-item-children" v-if="$slots.children">
        <slot name="children"></slot>
    </div>
  </div>
</template>

<script>
import Icon from '../icon'

export default {
  name: 'md-field-item',

  components: {
    [Icon.name]: Icon,
  },

  inject: {
    rootField: {
      from: 'rootField',
      default() {
        /* istanbul ignore next */
        return {}
      },
    },
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
    content: {
      type: String,
      default: '',
    },
    imgSrc: {
      type: String,
      default: '',
    },
    addon: {
      type:  String,
      default: '',
    },
    alignRight: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    currentDisabled() {
      return this.rootField.disabled || this.disabled
    },
  },

  methods: {
    $_onClick(e) {
      if (!this.currentDisabled) {
        this.$emit('click', e)
      }
    },
  },
}

</script>

<style lang="stylus">
@require "./../_style/mixin/util.styl"
@require "./../_style/mixin/theme.components.styl"
@require "./../_style/mixin/theme.basic.styl"
@require "./../../theme.custom.styl"
.md-field-item
  position relative
.md-field-item-content
  position relative
  padding 0 17px
  display flex
  align-items center
  justify-content space-between
  min-height field-item-min-height
  box-sizing border-box
.left-content
  margin-right 12px
.md-field-item-label
  min-width 64px
  font-size 16px
  color #333333
  line-height 22px
  max-width: 112px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
.md-field-item-control
  position relative 
  flex 1
  line-height 1.2

.md-field-item-right
  position relative
  display flex
  align-items center
  justify-content center
  margin-left 5px
  .ren_icon
    width 22px
    height 22px

.md-field-item-children
  font-size 13px
  color #898989
  padding 12px 17px 6px 0px
  line-height 16px
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
    background-color #EAEAEA

.md-field-item
  &.is-disabled
    .md-field-item-control,
    .md-field-item-left,
    .md-field-item-right
      color #898989
  &.is-align-right
    .md-field-item-control
      text-align right
</style>
