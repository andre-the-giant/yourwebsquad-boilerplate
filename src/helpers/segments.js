import { createSegmentHelpers } from "yourwebsquad-toolkit/helpers/segments";
import { segments } from "../../segments.config.mjs";

const helpers = createSegmentHelpers({ segments });

export const {
  getSegment,
  assertSegmentMatch,
  getSegmentKey,
  mapSegmentToLocale,
  pathFor,
  alternatesFor
} = helpers;

export { segments };
