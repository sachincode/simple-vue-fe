export const isArray = (data) => {
  return data && Array.isArray(data) && data.length > 0;
};

export const getUrl = (item) => {
  return item.uri || item.path;
};
