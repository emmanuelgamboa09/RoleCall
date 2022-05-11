/**
 * @jest-environment jsdom
 */

import React from "react";
import TestRenderer from "react-test-renderer";
import GroupOfferingBoxes from "../../../../components/landing_page/group_offerings/groupofferingboxes";
import { Offering } from "../../../../components/landing_page/group_offerings/groupofferings.types";

test("Make sure text is loaded properly on GroupOfferingBoxes", () => {
  const offering: Offering = {
    title: "Testing Title",
    message: "Testing Message",
    imageUrl: "/random/test/image/url",
  };

  const render = TestRenderer.create(
    <GroupOfferingBoxes offering={offering} />,
  );

  const testInstance = render.root;
  const cardHeader = testInstance.findByProps({
    id: "offeringCardHeader",
  }).props;
  expect([cardHeader.title, cardHeader.subheader]).toEqual([
    offering.title,
    offering.message,
  ]);

  expect(
    testInstance.findByProps({ id: "offeringCardMedia" }).props.image,
  ).toEqual(offering.imageUrl);
});
