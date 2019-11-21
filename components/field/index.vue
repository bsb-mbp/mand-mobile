<template>
  <fieldset class="md-field" :class="{'is-plain': plain, 'is-disabled': disabled }">
    <header class="md-field-header" v-if="title || brief || $slots.header || $slots.action">
      <div class="md-field-heading">
        <legend v-if="title" class="md-field-title" v-text="title"></legend>
        <p v-if="brief" class="md-field-brief" v-text="brief"></p>
        <slot name="header"></slot>
      </div>
      <div class="md-field-action">
        <slot name="action"></slot>
      </div>
    </header>
    <div class="md-field-content">
      <slot></slot>
    </div>
    <footer class="md-field-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </footer>
  </fieldset>
</template>

<script>
export default {
  name: 'md-field',

  props: {
    title: {
      type: String,
      default: '',
    },
    brief: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plain: {
      type: Boolean,
      default: false,
    },
  },

  provide() {
    return {
      rootField: this,
    }
  },
}

</script>

<style lang="stylus">
.md-field
  border none
  background-color #ffffff
  &.is-plain
    padding  0 
    background-color transparent
  &.is-title
    padding 16px 0px 11px 17px
.md-field-header
  position relative
  overflow hidden
  height 24px
  line-height 24px
  color #292929
  font-size 16px
  display flex
  justify-content space-between


.md-field-action
  flex-shrink 0
  color #898989
  font-size 14px
  padding-right 10px

.md-field-title
  color #292929
  font-size 16px

.md-field-footer
  margin-top field-footer-gap

.md-field
  &:disabled,
  &.is-disabled
    .md-field-title,
    .md-field-brief,
    .md-field-action,
    .md-field-content,
    .md-field-footer
      color color-text-disabled
</style>
