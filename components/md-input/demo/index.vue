<template>
  <div class="md-example-child md-example-child-input-item-0">
      <md-input-item
        ref="input0"
        title="普通文本"
        placeholder="普通文本"
        :maxlength="5"
      ></md-input-item>
      <md-input-item
        ref="input12"
        title="只读表单"
        value="只读表单"
        readonly
      ></md-input-item>
      <md-input-item
        placeholder="右侧文本内容"
        addon="万元"
      ></md-input-item>
      <md-input-item
        placeholder="没有底部线条"
        align="center"
		no-line
      ></md-input-item>
     <md-input-item
        align="right"
        label="左边icon右边img"
        placeholder="左边icon右边img"
        :img-src="imgurl"
        icon
        @handleInfo="handle"
        @handleImg="handle"
	/>
	<md-input-item 
			type="phone"
			align="left"
			label="六字以内以上标题"
			placeholder="带有del图标"
			clearable
			icon
	/>
	  <md-input-item 
			type="bankCard"
			placeholder="显示error信息"
			label="户名"
			error="手机号码无效"
			align="right"
			icon
	/>
   <md-input-item type="digit"
        placeholder="只能输入数字"
        label="户名"
        align="left"
	/>
   <md-input-item
        title="金额输入框"
        type="money"
        placeholder="带有brief插槽的金额输入框"
        brief=""
        clearable
        size="large"
        is-rmb
        edit
        @handleAction="handle"
	>
		<div slot="brief">理财提示文案，<span style="color:red" @click="$_onclick">字符</span>超出10个自动变小理财提示文案，超出10个自动变小理财提示文案，</div>
    </md-input-item>
</div>
</template>

<script>import {InputItem} from 'mand-mobile'
export default {
  components: {
    [InputItem.name]: InputItem,
  },
}
</script>