import { describe, it, expect } from "vitest";
import {
  addSeconds,
  buildTimePeriod,
  buildTimestamp,
  buildTimestampMs,
  buildDateFromTimestamp,
  timestampMsToTimestamp,
  now,
  buildTimestampFromDate,
  buildDuration,
  isOverlappingTimestamp,
  subtractSeconds,
  formatTimestamp,
  FormatTimestampOptions,
  formatTimestampAsDistance,
  formatTimestampAsDistanceToNow,
  scaleDuration,
  SECONDS_PER_DAY,
  DAYS_PER_YEAR,
  isOverlappingTimePeriod,
  absoluteTimestampDistance,
  buildDurationFromTimePeriod,
  buildIndefiniteTimePeriod,
  IndefiniteTimePeriodType,
  isTimestampOverlappingIndefiniteTimePeriod,
  isTimePeriodOverlappingIndefiniteTimePeriod,
  isOverlappingIndefiniteTimePeriod,
} from "./time";

describe("timestampMsToTimestamp() function", () => {
  it("Correctly returns 0s for less than 1000ms params", () => {
    const tests = [0n, 1n, 999n];

    tests.forEach((testMs) => {
      const timestamp = buildTimestampMs(testMs);
      expect(timestampMsToTimestamp(timestamp).time).toBe(0n);
    });
  });

  it("Correctly returns 1s for params between 1000ms and 1999ms", () => {
    const tests = [1000n, 1001n, 1100n, 1900n, 1999n];

    tests.forEach((testMs) => {
      const timestamp = buildTimestampMs(testMs);
      expect(timestampMsToTimestamp(timestamp).time).toBe(1n);
    });
  });
});

describe("buildDateFromTimestamp() function", () => {
  it("produces expected output", () => {
    const tests = [{ seconds: 0n, expectedDate: new Date(0) }];

    tests.forEach(({ seconds, expectedDate }) => {
      const timestamp = buildTimestamp(seconds);
      expect(buildDateFromTimestamp(timestamp)).toEqual(expectedDate);
    });
  });
});

describe("buildDuration() function", () => {
  it("zero second duration", () => {
    const seconds = 0n;
    const duration = buildDuration(seconds);

    expect(duration.seconds).toStrictEqual(seconds);
  });

  it("one second duration", () => {
    const seconds = 1n;
    const duration = buildDuration(seconds);

    expect(duration.seconds).toStrictEqual(seconds);
  });

  it("negative one second duration", () => {
    const seconds = -1n;

    expect(() => {
      buildDuration(seconds);
    }).toThrow();
  });
});

describe("scaleDuration() function", () => {
  it("throws when scaled by a negative number", () => {
    const seconds = 1000n;
    const duration = buildDuration(seconds);
    const scalar = -1;

    expect(() => {
      scaleDuration(duration, scalar);
    }).toThrow();
  });

  it("throws when scaled by an invalid number", () => {
    const seconds = 1000n;
    const duration = buildDuration(seconds);
    const scalar = Infinity;

    expect(() => {
      scaleDuration(duration, scalar);
    }).toThrow();
  });

  it("scale by 0n", () => {
    const seconds = 1000n;
    const duration = buildDuration(seconds);
    const scalar = 0n;
    const result = scaleDuration(duration, scalar);

    expect(result.seconds).toStrictEqual(0n);
  });

  it("scale by 0", () => {
    const seconds = 1000n;
    const duration = buildDuration(seconds);
    const scalar = 0;
    const result = scaleDuration(duration, scalar);

    expect(result.seconds).toStrictEqual(0n);
  });

  it("scale by 1000n", () => {
    const seconds = 1000n;
    const duration = buildDuration(seconds);
    const scalar = 1000n;
    const result = scaleDuration(duration, scalar);

    expect(result.seconds).toStrictEqual(1000000n);
  });

  it("scale by 1000", () => {
    const seconds = 1000n;
    const duration = buildDuration(seconds);
    const scalar = 1000;
    const result = scaleDuration(duration, scalar);

    expect(result.seconds).toStrictEqual(1000000n);
  });

  it("scale by fractional scalar", () => {
    const duration = SECONDS_PER_DAY;
    const scalar = DAYS_PER_YEAR;
    const result = scaleDuration(duration, scalar);

    expect(result.seconds).toStrictEqual(31556952n);
  });
});

describe("addSeconds() function", () => {
  it("add zero duration", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const duration = buildDuration(0n);
    const result = addSeconds(timestamp, duration);

    const resultDate = buildDateFromTimestamp(result);
    const expectedDate = date;

    expect(resultDate).toStrictEqual(expectedDate);
  });

  it("add non-zero duration", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const duration = buildDuration(5n);
    const result = addSeconds(timestamp, duration);

    const resultDate = buildDateFromTimestamp(result);
    const expectedDate = new Date("2024-01-02T03:04:10Z");

    expect(resultDate).toStrictEqual(expectedDate);
  });
});

describe("subtractSeconds() function", () => {
  it("subtract zero duration", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const duration = buildDuration(0n);
    const result = subtractSeconds(timestamp, duration);

    const resultDate = buildDateFromTimestamp(result);
    const expectedDate = date;

    expect(resultDate).toStrictEqual(expectedDate);
  });

  it("subtract non-zero duration", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const duration = buildDuration(5n);
    const result = subtractSeconds(timestamp, duration);

    const resultDate = buildDateFromTimestamp(result);
    const expectedDate = new Date("2024-01-02T03:04:00Z");

    expect(resultDate).toStrictEqual(expectedDate);
  });
});

describe("absoluteTimestampDistance() function", () => {
  it("same Timestamp", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);

    const date2 = new Date("2024-01-01T00:00:00Z");
    const timestamp2 = buildTimestampFromDate(date2);

    const result = absoluteTimestampDistance(timestamp1, timestamp1).seconds;
    const expectedResult = 0n;

    expect(result).toStrictEqual(expectedResult);
  });

  it("1 second before", () => {
    const date1 = new Date("2024-01-01T00:00:01Z");
    const timestamp1 = buildTimestampFromDate(date1);

    const date2 = new Date("2024-01-01T00:00:00Z");
    const timestamp2 = buildTimestampFromDate(date2);

    const result = absoluteTimestampDistance(timestamp1, timestamp2).seconds;
    const expectedResult = 1n;

    expect(result).toStrictEqual(expectedResult);
  });

  it("1 second after", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);

    const date2 = new Date("2024-01-01T00:00:01Z");
    const timestamp2 = buildTimestampFromDate(date2);

    const result = absoluteTimestampDistance(timestamp1, timestamp2).seconds;
    const expectedResult = 1n;

    expect(result).toStrictEqual(expectedResult);
  });
});

describe("formatTimestamp() function", () => {
  it("showDateOnly - UTC - 1 digit day", () => {
    const date = new Date("2024-01-02T23:59:59Z");
    const timestamp = buildTimestampFromDate(date);
    const options: FormatTimestampOptions = {
      timeZone: "UTC",
      showDateOnly: true,
    };

    const result = formatTimestamp(timestamp, options);

    expect(result).toStrictEqual("Jan 2, 2024");
  });

  it("showDateOnly - UTC - 2 digit day", () => {
    const date = new Date("2024-01-31T23:59:59Z");
    const timestamp = buildTimestampFromDate(date);
    const options: FormatTimestampOptions = {
      timeZone: "UTC",
      showDateOnly: true,
    };

    const result = formatTimestamp(timestamp, options);

    expect(result).toStrictEqual("Jan 31, 2024");
  });

  it("UTC - 2 digit hour and minute PM", () => {
    const date = new Date("2024-01-31T23:59:59Z");
    const timestamp = buildTimestampFromDate(date);
    const options: FormatTimestampOptions = {
      timeZone: "UTC",
    };

    const result = formatTimestamp(timestamp, options);

    expect(result).toStrictEqual("Jan 31, 2024, 11:59 PM");
  });

  it("UTC - 1 digit hour and minute AM", () => {
    const date = new Date("2024-01-31T01:01:01Z");
    const timestamp = buildTimestampFromDate(date);
    const options: FormatTimestampOptions = {
      timeZone: "UTC",
    };

    const result = formatTimestamp(timestamp, options);

    expect(result).toStrictEqual("Jan 31, 2024, 1:01 AM");
  });

  it("UTC - midnight", () => {
    const date = new Date("2024-01-31T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const options: FormatTimestampOptions = {
      timeZone: "UTC",
    };

    const result = formatTimestamp(timestamp, options);

    expect(result).toStrictEqual("Jan 31, 2024, 12:00 AM");
  });

  it("UTC - noon", () => {
    const date = new Date("2024-01-31T12:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const options: FormatTimestampOptions = {
      timeZone: "UTC",
    };

    const result = formatTimestamp(timestamp, options);

    expect(result).toStrictEqual("Jan 31, 2024, 12:00 PM");
  });

  it("showDateOnly - custom time zone", () => {
    const date = new Date("2024-01-31T23:59:59Z");
    const timestamp = buildTimestampFromDate(date);
    const options: FormatTimestampOptions = {
      showDateOnly: true,
      timeZone: "Asia/Dubai",
    };

    const result = formatTimestamp(timestamp, options);

    expect(result).toStrictEqual("Feb 1, 2024");
  });

  // // TODO: build a more generic version of this unit test that works in any system default time zone
  // // NOTE: commenting this out as it is currently system dependent. Verified it works in my current time zone.
  // it("showDateOnly - system default time zone", () => {
  //   const date = new Date("2024-01-31T23:59:59Z");
  //   const timestamp = buildTimestampFromDate(date);
  //   const options : FormatTimestampOptions = {
  //     showDateOnly: true,
  //   }

  //   const result = formatTimestamp(timestamp, options);

  //   expect(result).toStrictEqual("Feb 1, 2024");
  // });

  // // TODO: build a more generic version of this unit test that works in any system default time zone.
  // // NOTE: commenting this out as it is currently system dependent. Verified it works in my current time zone.
  // it("no options", () => {
  //   const date = new Date("2024-01-31T23:59:59Z");
  //   const timestamp = buildTimestampFromDate(date);

  //   const result = formatTimestamp(timestamp);

  //   expect(result).toStrictEqual("Feb 1, 2024, 3:59 AM");
  // });

  // // TODO: build a more generic version of this unit test that works in any system default time zone.
  // // NOTE: commenting this out as it is currently system dependent. Verified it works in my current time zone.
  // it("empty options", () => {
  //   const date = new Date("2024-01-31T23:59:59Z");
  //   const timestamp = buildTimestampFromDate(date);
  //   const options : FormatTimestampOptions = {};

  //   const result = formatTimestamp(timestamp, options);

  //   expect(result).toStrictEqual("Feb 1, 2024, 3:59 AM");
  // });

  it("invalid timezone", () => {
    const date = new Date("2024-01-31T12:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const options: FormatTimestampOptions = {
      timeZone: "invalid",
    };

    expect(() => {
      formatTimestamp(timestamp, options);
    }).toThrow();
  });

  it("syntactically invalid locale", () => {
    const date = new Date("2024-01-31T12:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const options: FormatTimestampOptions = {
      locale: "x",
    };

    expect(() => {
      formatTimestamp(timestamp, options);
    }).toThrow();
  });

  it("japanese locale", () => {
    const date = new Date("2024-01-01T01:01:01Z");
    const timestamp = buildTimestampFromDate(date);

    const result = formatTimestamp(timestamp, {
      timeZone: "UTC",
      locale: "ja-JP",
    });

    expect(result).toStrictEqual("2024年1月1日 1:01");
  });
});

describe("formatTimestampAsDistance() function", () => {
  it("plural years in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("3025-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("1001 years ago");
  });

  it("singular year in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2025-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("1 year ago");
  });

  it("12 months in past approximate", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-12-26T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("1 year ago");
  });

  it("11 months in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-12-25T23:59:59Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("11 months ago");
  });

  it("30 days in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-31T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("1 month ago");
  });

  it("29 days in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-30T23:59:59Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("29 days ago");
  });

  it("singular day in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-02T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("1 day ago");
  });

  it("plural hours in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T23:59:59Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("23 hours ago");
  });

  it("singular hour in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T01:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("1 hour ago");
  });

  it("plural minutes in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:59:59Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("59 minutes ago");
  });

  it("singular minute in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:01:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("1 minute ago");
  });

  it("plural seconds in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:59Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("59 seconds ago");
  });

  it("singular second in past", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:01Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("1 second ago");
  });

  it("zero distance", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("now");
  });

  it("singular second in future", () => {
    const date = new Date("2024-01-01T00:00:01Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 1 second");
  });

  it("plural seconds in future", () => {
    const date = new Date("2024-01-01T00:00:59Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 59 seconds");
  });

  it("singular minute in future", () => {
    const date = new Date("2024-01-01T00:01:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 1 minute");
  });

  it("plural minutes in future", () => {
    const date = new Date("2024-01-01T00:59:59Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 59 minutes");
  });

  it("singular hour in future", () => {
    const date = new Date("2024-01-01T01:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 1 hour");
  });

  it("plural hours in future", () => {
    const date = new Date("2024-01-01T23:59:59Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 23 hours");
  });

  it("singular day in future", () => {
    const date = new Date("2024-01-02T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 1 day");
  });

  it("29 days in future", () => {
    const date = new Date("2024-01-30T23:59:59Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 29 days");
  });

  it("30 days in future", () => {
    const date = new Date("2024-01-31T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 1 month");
  });

  it("11 months in future", () => {
    const date = new Date("2024-12-25T23:59:59Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 11 months");
  });

  it("12 months in future approximate", () => {
    const date = new Date("2024-12-26T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 1 year");
  });

  it("singular year in future", () => {
    const date = new Date("2025-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 1 year");
  });

  it("plural years in future", () => {
    const date = new Date("3025-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);
    const baseDate = new Date("2024-01-01T00:00:00Z");
    const baseTimestamp = buildTimestampFromDate(baseDate);

    const result = formatTimestampAsDistance(timestamp, baseTimestamp);

    expect(result).toStrictEqual("in 1001 years");
  });
});

describe("formatTimestampAsDistanceToNow() function", () => {
  it("now", () => {
    const result = formatTimestampAsDistanceToNow(now());

    expect(["now", "1 second ago"]).toContain(result);
  });
});

describe("buildTimePeriod() function", () => {
  it("begin equals end", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const begin = timestamp;
    const end = timestamp;

    const period = buildTimePeriod(begin, end);

    expect(period.begin).toStrictEqual(begin);
    expect(period.end).toStrictEqual(end);
  });

  it("end after beginning", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const begin = timestamp;
    const end = addSeconds(timestamp, buildDuration(1n));

    const period = buildTimePeriod(begin, end);

    expect(period.begin).toStrictEqual(begin);
    expect(period.end).toStrictEqual(end);
  });

  it("beginning after end", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const begin = addSeconds(timestamp, buildDuration(1n));
    const end = timestamp;

    expect(() => {
      buildTimePeriod(begin, end);
    }).toThrow();
  });
});

describe("isOverlappingTimestamp() function", () => {
  it("overlapping zero duration TimePeriod", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const periodBegin = timestamp;
    const periodEnd = timestamp;

    const period = buildTimePeriod(periodBegin, periodEnd);
    const result = isOverlappingTimestamp(period, timestamp);
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("1 second before TimePeriod", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const periodBegin = addSeconds(timestamp, buildDuration(1n));
    const periodEnd = addSeconds(timestamp, buildDuration(2n));

    const period = buildTimePeriod(periodBegin, periodEnd);
    const result = isOverlappingTimestamp(period, timestamp);
    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
  });

  it("exactly at TimePeriod begin", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const periodBegin = timestamp;
    const periodEnd = addSeconds(timestamp, buildDuration(1n));

    const period = buildTimePeriod(periodBegin, periodEnd);
    const result = isOverlappingTimestamp(period, timestamp);
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("during TimePeriod", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const periodBegin = subtractSeconds(timestamp, buildDuration(1n));
    const periodEnd = addSeconds(timestamp, buildDuration(1n));

    const period = buildTimePeriod(periodBegin, periodEnd);
    const result = isOverlappingTimestamp(period, timestamp);
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("exactly at TimePeriod end", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const periodBegin = subtractSeconds(timestamp, buildDuration(1n));
    const periodEnd = timestamp;

    const period = buildTimePeriod(periodBegin, periodEnd);
    const result = isOverlappingTimestamp(period, timestamp);
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("1 second after TimePeriod", () => {
    const date = new Date("2024-01-02T03:04:05Z");
    const timestamp = buildTimestampFromDate(date);

    const periodBegin = subtractSeconds(timestamp, buildDuration(2n));
    const periodEnd = subtractSeconds(timestamp, buildDuration(1n));

    const period = buildTimePeriod(periodBegin, periodEnd);
    const result = isOverlappingTimestamp(period, timestamp);
    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
  });
});

describe("isOverlappingTimePeriod() function", () => {
  it("overlapping zero duration TimePeriods", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const period1Begin = timestamp;
    const period1End = timestamp;
    const period1 = buildTimePeriod(period1Begin, period1End);

    const period2Begin = timestamp;
    const period2End = timestamp;
    const period2 = buildTimePeriod(period2Begin, period2End);

    const result = isOverlappingTimePeriod(period1, period2);
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("1 second before TimePeriod", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const period1Begin = timestamp;
    const period1End = timestamp;
    const period1 = buildTimePeriod(period1Begin, period1End);

    const period2Begin = addSeconds(timestamp, buildDuration(1n));
    const period2End = addSeconds(timestamp, buildDuration(2n));
    const period2 = buildTimePeriod(period2Begin, period2End);

    const result = isOverlappingTimePeriod(period1, period2);
    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
  });

  it("exactly at TimePeriod begin", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const period1Begin = timestamp;
    const period1End = timestamp;
    const period1 = buildTimePeriod(period1Begin, period1End);

    const period2Begin = timestamp;
    const period2End = addSeconds(timestamp, buildDuration(1n));
    const period2 = buildTimePeriod(period2Begin, period2End);

    const result = isOverlappingTimePeriod(period1, period2);
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("during TimePeriod", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const period1Begin = timestamp;
    const period1End = addSeconds(timestamp, buildDuration(3n));
    const period1 = buildTimePeriod(period1Begin, period1End);

    const period2Begin = addSeconds(timestamp, buildDuration(1n));
    const period2End = addSeconds(timestamp, buildDuration(2n));
    const period2 = buildTimePeriod(period2Begin, period2End);

    const result = isOverlappingTimePeriod(period1, period2);
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("exactly at TimePeriod end", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const period1Begin = timestamp;
    const period1End = addSeconds(timestamp, buildDuration(3n));
    const period1 = buildTimePeriod(period1Begin, period1End);

    const period2Begin = addSeconds(timestamp, buildDuration(3n));
    const period2End = addSeconds(timestamp, buildDuration(4n));
    const period2 = buildTimePeriod(period2Begin, period2End);

    const result = isOverlappingTimePeriod(period1, period2);
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("1 second after TimePeriod", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const period1Begin = timestamp;
    const period1End = addSeconds(timestamp, buildDuration(3n));
    const period1 = buildTimePeriod(period1Begin, period1End);

    const period2Begin = addSeconds(timestamp, buildDuration(4n));
    const period2End = addSeconds(timestamp, buildDuration(5n));
    const period2 = buildTimePeriod(period2Begin, period2End);

    const result = isOverlappingTimePeriod(period1, period2);
    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
  });
});

describe("buildDurationFromTimePeriod() function", () => {
  it("zero duration", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);

    const date2 = new Date("2024-01-01T00:00:00Z");
    const timestamp2 = buildTimestampFromDate(date2);

    const period = buildTimePeriod(timestamp1, timestamp2);

    const result = buildDurationFromTimePeriod(period).seconds;
    const expectedResult = 0n;

    expect(result).toStrictEqual(expectedResult);
  });

  it("positive duration", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);

    const date2 = new Date("2024-01-01T00:00:05Z");
    const timestamp2 = buildTimestampFromDate(date2);

    const period = buildTimePeriod(timestamp1, timestamp2);

    const result = buildDurationFromTimePeriod(period).seconds;
    const expectedResult = 5n;

    expect(result).toStrictEqual(expectedResult);
  });
});

describe("isTimestampOverlappingIndefiniteTimePeriod() function", () => {
  it("IndefinitePast 1 second before", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const boundary = addSeconds(timestamp, buildDuration(1n));

    const period = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isTimestampOverlappingIndefiniteTimePeriod(
      period,
      timestamp,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefinitePast at boundary", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const boundary = timestamp;

    const period = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isTimestampOverlappingIndefiniteTimePeriod(
      period,
      timestamp,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefinitePast 1 second after", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const boundary = subtractSeconds(timestamp, buildDuration(1n));

    const period = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isTimestampOverlappingIndefiniteTimePeriod(
      period,
      timestamp,
    );
    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture 1 second before", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const boundary = addSeconds(timestamp, buildDuration(1n));

    const period = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isTimestampOverlappingIndefiniteTimePeriod(
      period,
      timestamp,
    );
    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture at boundary", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const boundary = timestamp;

    const period = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isTimestampOverlappingIndefiniteTimePeriod(
      period,
      timestamp,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture 1 second after", () => {
    const date = new Date("2024-01-01T00:00:00Z");
    const timestamp = buildTimestampFromDate(date);

    const boundary = subtractSeconds(timestamp, buildDuration(1n));

    const period = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isTimestampOverlappingIndefiniteTimePeriod(
      period,
      timestamp,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });
});

describe("isTimePeriodOverlappingIndefiniteTimePeriod() function", () => {
  it("IndefinitePast - boundary fully before definite time period", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const date2 = new Date("2024-01-01T00:00:03Z");
    const timestamp2 = buildTimestampFromDate(date2);
    const definitePeriod = buildTimePeriod(timestamp1, timestamp2);

    const boundary = subtractSeconds(timestamp1, buildDuration(1n));
    const indefinitePeriod = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isTimePeriodOverlappingIndefiniteTimePeriod(
      indefinitePeriod,
      definitePeriod,
    );
    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefinitePast - boundary at definite time period begins", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const date2 = new Date("2024-01-01T00:00:03Z");
    const timestamp2 = buildTimestampFromDate(date2);
    const definitePeriod = buildTimePeriod(timestamp1, timestamp2);

    const boundary = timestamp1;
    const indefinitePeriod = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isTimePeriodOverlappingIndefiniteTimePeriod(
      indefinitePeriod,
      definitePeriod,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefinitePast - boundary during definite time period", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const date2 = new Date("2024-01-01T00:00:03Z");
    const timestamp2 = buildTimestampFromDate(date2);
    const definitePeriod = buildTimePeriod(timestamp1, timestamp2);

    const boundary = subtractSeconds(timestamp2, buildDuration(1n));
    const indefinitePeriod = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isTimePeriodOverlappingIndefiniteTimePeriod(
      indefinitePeriod,
      definitePeriod,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefinitePast - boundary at definite time period ends", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const date2 = new Date("2024-01-01T00:00:03Z");
    const timestamp2 = buildTimestampFromDate(date2);
    const definitePeriod = buildTimePeriod(timestamp1, timestamp2);

    const boundary = timestamp2;
    const indefinitePeriod = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isTimePeriodOverlappingIndefiniteTimePeriod(
      indefinitePeriod,
      definitePeriod,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefinitePast - boundary fully after definite time period", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const date2 = new Date("2024-01-01T00:00:03Z");
    const timestamp2 = buildTimestampFromDate(date2);
    const definitePeriod = buildTimePeriod(timestamp1, timestamp2);

    const boundary = addSeconds(timestamp2, buildDuration(1n));
    const indefinitePeriod = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isTimePeriodOverlappingIndefiniteTimePeriod(
      indefinitePeriod,
      definitePeriod,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture - boundary fully before definite time period", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const date2 = new Date("2024-01-01T00:00:03Z");
    const timestamp2 = buildTimestampFromDate(date2);
    const definitePeriod = buildTimePeriod(timestamp1, timestamp2);

    const boundary = subtractSeconds(timestamp1, buildDuration(1n));
    const indefinitePeriod = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isTimePeriodOverlappingIndefiniteTimePeriod(
      indefinitePeriod,
      definitePeriod,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture - boundary at definite time period begins", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const date2 = new Date("2024-01-01T00:00:03Z");
    const timestamp2 = buildTimestampFromDate(date2);
    const definitePeriod = buildTimePeriod(timestamp1, timestamp2);

    const boundary = timestamp1;
    const indefinitePeriod = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isTimePeriodOverlappingIndefiniteTimePeriod(
      indefinitePeriod,
      definitePeriod,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture - boundary during definite time period", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const date2 = new Date("2024-01-01T00:00:03Z");
    const timestamp2 = buildTimestampFromDate(date2);
    const definitePeriod = buildTimePeriod(timestamp1, timestamp2);

    const boundary = subtractSeconds(timestamp2, buildDuration(1n));
    const indefinitePeriod = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isTimePeriodOverlappingIndefiniteTimePeriod(
      indefinitePeriod,
      definitePeriod,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture - boundary at definite time period ends", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const date2 = new Date("2024-01-01T00:00:03Z");
    const timestamp2 = buildTimestampFromDate(date2);
    const definitePeriod = buildTimePeriod(timestamp1, timestamp2);

    const boundary = timestamp2;
    const indefinitePeriod = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isTimePeriodOverlappingIndefiniteTimePeriod(
      indefinitePeriod,
      definitePeriod,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture - boundary fully after definite time period", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const date2 = new Date("2024-01-01T00:00:03Z");
    const timestamp2 = buildTimestampFromDate(date2);
    const definitePeriod = buildTimePeriod(timestamp1, timestamp2);

    const boundary = addSeconds(timestamp2, buildDuration(1n));
    const indefinitePeriod = buildIndefiniteTimePeriod(
      boundary,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isTimePeriodOverlappingIndefiniteTimePeriod(
      indefinitePeriod,
      definitePeriod,
    );
    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
  });
});

describe("isOverlappingIndefiniteTimePeriod() function", () => {
  it("IndefinitePast < IndefinitePast", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = addSeconds(timestamp1, buildDuration(1n));

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefinitePast,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefinitePast === IndefinitePast", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = timestamp1;

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefinitePast,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefinitePast > IndefinitePast", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = subtractSeconds(timestamp1, buildDuration(1n));

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefinitePast,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefinitePast < IndefiniteFuture", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = addSeconds(timestamp1, buildDuration(1n));

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefinitePast,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefinitePast === IndefiniteFuture", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = timestamp1;

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefinitePast,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefinitePast > IndefiniteFuture", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = subtractSeconds(timestamp1, buildDuration(1n));

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefinitePast,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture < IndefinitePast", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = addSeconds(timestamp1, buildDuration(1n));

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture === IndefinitePast", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = timestamp1;

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture > IndefinitePast", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = subtractSeconds(timestamp1, buildDuration(1n));

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefinitePast,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = false;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture < IndefiniteFuture", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = addSeconds(timestamp1, buildDuration(1n));

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture === IndefiniteFuture", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = timestamp1;

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });

  it("IndefiniteFuture > IndefiniteFuture", () => {
    const date1 = new Date("2024-01-01T00:00:00Z");
    const timestamp1 = buildTimestampFromDate(date1);
    const boundary1 = timestamp1;

    const boundary2 = subtractSeconds(timestamp1, buildDuration(1n));

    const indefinitePeriod1 = buildIndefiniteTimePeriod(
      boundary1,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );
    const indefinitePeriod2 = buildIndefiniteTimePeriod(
      boundary2,
      IndefiniteTimePeriodType.IndefiniteFuture,
    );

    const result = isOverlappingIndefiniteTimePeriod(
      indefinitePeriod1,
      indefinitePeriod2,
    );
    const expectedResult = true;

    expect(result).toStrictEqual(expectedResult);
  });
});
