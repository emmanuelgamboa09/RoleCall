const Generator = require("license-key-generator");

/**
 * Length of 20 with 36 posssible characters (26 uppercase letters + 10 digits)
 * is equal to 1.777933673E+28 possible permutation of a string. Just to be safe
 * we should still check if the string is already in the database before accepting it.
 */
export const generatorOptions = {
  type: "random",
  length: 20,
  group: 5,
  split: "-",
  splitStatus: true,
};

const KeyGenerator = new Generator(generatorOptions);

export default KeyGenerator;
