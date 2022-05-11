export default (val: any) => {
  return val instanceof Date && !isNaN(val.getTime());
};
