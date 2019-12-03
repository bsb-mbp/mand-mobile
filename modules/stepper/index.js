import stepper from '../../components/stepper/index';
stepper.install = function (Vue) {
  Vue.component(stepper.name, stepper);
};
export default stepper;
