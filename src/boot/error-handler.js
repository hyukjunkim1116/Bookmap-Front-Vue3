import { boot } from 'quasar/wrappers';
import { Notify } from 'quasar';

export default boot(async ({ app }) => {
  app.config.errorHandler = (err, instance, info) => {
    console.log('### app.config.errorHandler ###');
    console.log('err: ', err);
    console.log('instance: ', instance);
    console.log('info: ', info);
    // Notify.create(err.code);
  };
});
