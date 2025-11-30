export function createFormData(data) {
  const fd = new FormData();

  Object.keys(data).forEach(key => {
    const value = data[key];

    // If FileList → append first file
    if (value instanceof FileList) {
      fd.append(key, value[0]);
    } else {
      fd.append(key, value);
    }
  });

  return fd;
}
