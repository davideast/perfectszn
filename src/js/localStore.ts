export function localBoolStore(key: string) {
  const isTrue = (value: any) => value == 'true';
  return {
    // If there is no value in local storage then it's either a first time user
    // or someone who cleared everything. Since localStorage only can store strings, 
    // we fake a 'true' value to keep everything as if it comes from localStorage.
    get() {
      const localValue = localStorage.getItem(key);
      const isFirstTimeOrValue = localValue == null ? 'true' : localValue;
      return isTrue(isFirstTimeOrValue);
    },
    set(value: boolean) {
      localStorage.setItem(key, value.toString());
    }
  };
}
