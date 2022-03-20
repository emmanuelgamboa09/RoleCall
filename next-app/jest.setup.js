// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

import Enzyme from "enzyme";
const EnzymeAdapter = require("enzyme-adapter-react-16");

// Setup enzyme's react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });
