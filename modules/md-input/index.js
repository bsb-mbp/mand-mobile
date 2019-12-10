import mdInput from '../../components/md-input/index';
mdInput.install = function (Vue) {
  Vue.component(Input.name, mdInput);
};
export default mdInput;
