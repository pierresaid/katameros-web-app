export function useSetting(settingName, defaultValue, parser = null) {
  const settingLocalStorage = localStorage.getItem(settingName);
  if (settingLocalStorage === null) {
    return defaultValue;
  } else {
    if (parser !== null) {
      return parser(settingLocalStorage);
    } else {
      return settingLocalStorage;
    }
  }
}
