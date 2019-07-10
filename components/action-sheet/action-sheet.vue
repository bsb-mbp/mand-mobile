<template>
  <div class="md-action-sheet">
    <md-popup
      v-model="isActionSheetShow"
      lighter-mask
      position="bottom"
      prevent-scroll
      @show="$_onShow"
      @hide="$_onHide"
    >
      <div class="md-action-sheet-content">
        <header v-if="title" class="md-action-sheet-header">{{title}}</header>
        <ul class="md-action-sheet-list">
          <template v-for="(item, index) in options">
            <li
              :key="index"
              :class="{
                'active': index === clickIndex,
                'disabled': index=== invalidIndex,
                'md-action-sheet-item': true,
                'warning':item.type==='warning'
              }"
              @click="$_onSelect(item, index)"
            >
              <div class="md-action-sheet-item-wrapper">
                <div class="md-action-sheet-item-section" v-html="item.text || item.label"></div>
              </div>
            </li>
          </template>
          <li
            :class="['md-action-sheet-cancel',{'global-is-iphone-x': isIphoneX}]"
            @click="$_onCancel"
          >取&#12288;消</li>
        </ul>
      </div>
    </md-popup>
  </div>
</template>

<script>
import Popup from '../popup';
import {inArray} from '../_util';

export default {
  name: 'md-action-sheet',
  components: {
    [Popup.name]: Popup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultIndex: {
      type: Number,
      default: -1
    },
    invalidIndex: {
      type: Number,
      default: -1
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    isIphoneX: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'normal'
    }
  },
  data() {
    return {
      isActionSheetShow: this.value,
      clickIndex: -1,
      scroller: ''
    };
  },
  watch: {
    value(newVal) {
      this.isActionSheetShow = newVal;
    }
  },
  created() {
    // this.clickIndex = this.defaultIndex;
  },
  methods: {
    // MARK: events handler, 如 $_onButtonClick
    $_onShow() {
      this.$emit('show');
    },
    $_onHide() {
      this.$emit('hide');
      this.$_hideSheet();
    },
    $_onSelect(item, index) {
      if (index === this.invalidIndex || inArray(this.invalidIndex, index)) {
        return;
      }
      this.clickIndex = index;
      this.$emit('selected', item);
      this.$_hideSheet();
    },
    $_onCancel() {
      this.$emit('cancel');
      this.$_hideSheet();
    },
    $_hideSheet() {
      this.isActionSheetShow = false;
      this.clickIndex = -1;
      this.$emit('input', false);
    }
  }
};
</script>

<style lang="stylus" scoped>
.global-is-iphone-x
  margin-bottom 24px
.warning
  color #F12701
.md-action-sheet
  /* color action-sheet-color */
  -webkit-font-smoothing antialiased
.md-popup
  z-index action-sheet-zindex
  .md-popup-box
    background-color color-bg-base
.md-action-sheet-content
  position relative
  width 100%
  font-size 18px
  text-align center
  overflow auto
  background #ffffff
.md-action-sheet-header
  position relative
  vertical-height(action-sheet-height)
  hairline(bottom, color-border-base)
  word-ellipsis()
  overflow visible
  height 50px
  display -webkit-box
  display -webkit-flex
  display flex
  -webkit-box-align center
  -webkit-align-items center
  align-items center
  -webkit-box-pack center
  -webkit-justify-content center
  justify-content center
  font-size 13px
  color #898989
  letter-spacing -0.27px
  padding 0 32px
  border-bottom 1px solid #F4F4F4
.md-action-sheet-item
  position relative
  vertical-height(action-sheet-height)
  box-sizing border-box
  font-size action-sheet-font-size
  transition background-color 0.3s
  -webkit-user-select none
  height 50px
  line-height 50px
  &.active
    background-color #F4F4F4
  &.disabled .md-action-sheet-item-section
    opacity action-sheet-disabled-opacity
  &:active
    background-color #F4F4F4
    &.disabled
      background-color transparent
.md-action-sheet-cancel
  height 56px
  line-height 50px
  &::before
    display block
    content ''
    height 6px
    background #f9fafb
</style>
