import { boot } from 'quasar/wrappers';
import { LocalStorage, Dark } from 'quasar';

export default boot(async (/* { app, router, ... } */) => {
  const darkMode = LocalStorage.getItem('darkMode');

  Dark.set(darkMode);
  console.log(darkMode);
});
