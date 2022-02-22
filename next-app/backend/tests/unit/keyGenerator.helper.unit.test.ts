import { expect, test } from "@jest/globals";
import KeyGenerator, { generatorOptions } from "../../helpers/keyGenerator";

test("Generate random string with generator options", async () => {
  generatorOptions;
  KeyGenerator.get((error: any, code: any) => {
    expect(error).toBeNull;

    const generatedCodeWithoutSplit = code.replaceAll("-", "");
    expect(generatedCodeWithoutSplit.length).toEqual(generatorOptions.length);

    if (generatorOptions.splitStatus === true) {
      const splitCode = code.split(generatorOptions.split);
      expect(splitCode.length).toEqual(
        Math.ceil(generatorOptions.length / generatorOptions.group)
      );
    }
  });
});
