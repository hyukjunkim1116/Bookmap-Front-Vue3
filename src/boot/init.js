import { boot } from 'quasar/wrappers';
import { LocalStorage, Dark } from 'quasar';

export default boot(({ app }) => {
  const darkMode = LocalStorage.getItem('darkMode');
  Dark.set(darkMode);
});
