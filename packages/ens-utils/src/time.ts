import { formatDistanceStrict } from "date-fns";
import { enUS } from "date-fns/locale";

/**
 * A `Duration` represents a non-negative length of time in seconds.
 */
export interface Duration {
  /**
   * The number of seconds in the `Duration`.
   * Must be non-negative.
   */
  seconds: bigint;
}

/**
 * Builds a `Duration`.
 *
 * @param seconds The non-negative number of seconds in the `Duration`.
 * @returns The resulting `Duration`.
 * @throws `Error` if `seconds` is negative.
 */
export const buildDuration = (seconds: bigint): Duration => {
  if (seconds < 0n)
    throw new Error(
      `Error in buildDuration. seconds ${seconds}} is less than 0.`,
    );

  return {
    seconds,
  };
};

// TODO: write unit tests
/**
 * Builds a `Duration` from a `TimePeriod`.
 *
 * @param timePeriod The `TimePeriod` to convert into a `Duration`.
 * @returns A `Duration` representing the distance in time between the end and
 *          beginning of the provided `TimePeriod`.
 */
export const buildDurationFromTimePeriod = (
  timePeriod: TimePeriod,
): Duration => {
  return buildDuration(timePeriod.end.time - timePeriod.begin.time);
};

/**
 * Scales a `Duration` by the given `scalar`.
 *
 * @param duration The `Duration` to scale.
 * @param scalar The scalar to scale the `Duration` by.
 * @returns The scaled `Duration`.
 * @throws `Error` if `scalar` is negative.
 * @throws `Error` if `scalar` is of type `number` and cannot be converted to `bigint`.
 */
export const scaleDuration = (
  duration: Duration,
  scalar: bigint | number,
): Duration => {
  let newSeconds: bigint;

  if (typeof scalar === "number") {
    try {
      newSeconds = BigInt(Number(duration.seconds) * scalar);
    } catch (error) {
      throw new Error(
        `Error in scaleDuration. scalar ${scalar}} is not a valid number.`,
      );
    }
  } else {
    newSeconds = duration.seconds * scalar;
  }

  if (newSeconds < 0n) {
    throw new Error(
      `Error in scaleDuration. scalar ${scalar}} must be a non-negative number.`,
    );
  }

  return buildDuration(newSeconds);
};

export const MILLISECONDS_PER_SECOND = 1000n;

/**
 * 60n seconds.
 */
export const SECONDS_PER_MINUTE = buildDuration(60n);

/**
 * 3,600n seconds.
 */
export const SECONDS_PER_HOUR = scaleDuration(SECONDS_PER_MINUTE, 60n);

/**
 * 86,400n seconds.
 */
export const SECONDS_PER_DAY = scaleDuration(SECONDS_PER_HOUR, 24n);

/**
 * 604,800n seconds.
 */
export const SECONDS_PER_WEEK = scaleDuration(SECONDS_PER_DAY, 7n);

/**
 * The average Gregorian calendar year is 365.2425 days in length.
 */
export const DAYS_PER_YEAR = 365.2425;

/**
 * 31,556,952n seconds.
 */
export const SECONDS_PER_YEAR = scaleDuration(SECONDS_PER_DAY, DAYS_PER_YEAR);

/**
 * A moment in time measured in seconds.
 */
export interface Timestamp {
  /**
   * A Unix timestamp measured in seconds.
   * May be negative to represent a time before the Unix epoch.
   */
  time: bigint;
}

/**
 * A moment in time measured in milliseconds.
 */
export interface TimestampMs {
  /**
   * A Unix timestamp measured in milliseconds.
   * May be negative to represent a time before the Unix epoch.
   */
  timeMs: bigint;
}

/**
 * Builds a `Timestamp`.
 *
 * @param secondsSinceUnixEpoch The number of seconds since the Unix epoch.
 * @returns The resulting `Timestamp`.
 */
export const buildTimestamp = (secondsSinceUnixEpoch: bigint): Timestamp => {
  return {
    time: secondsSinceUnixEpoch,
  };
};

/**
 * Builds a `TimestampMs`.
 *
 * @param millisecondsSinceUnixEpoch The number of milliseconds since the Unix epoch.
 * @returns The resulting `TimestampMs`.
 */
export const buildTimestampMs = (
  millisecondsSinceUnixEpoch: bigint,
): TimestampMs => {
  return {
    timeMs: millisecondsSinceUnixEpoch,
  };
};

/**
 * Converts a `TimestampMs` to a `Timestamp`.
 *
 * Fractional seconds are truncated.
 *
 * @param ms The `TimestampMs` to convert.
 * @returns The converted `Timestamp`.
 */
export const timestampMsToTimestamp = (ms: TimestampMs): Timestamp => {
  return buildTimestamp(ms.timeMs / MILLISECONDS_PER_SECOND);
};

/**
 * Converts a `Timestamp` to a `TimestampMs`.
 *
 * @param seconds The `Timestamp` to convert.
 * @returns The converted `TimestampMs`.
 */
export const timestampToTimestampMs = (seconds: Timestamp): TimestampMs => {
  return buildTimestampMs(seconds.time * MILLISECONDS_PER_SECOND);
};

/**
 * Builds a `Date` from a `Timestamp`.
 *
 * @param timestamp The `Timestamp` to convert.
 * @returns The converted `Date` object.
 */
export const buildDateFromTimestamp = (timestamp: Timestamp): Date => {
  return buildDateFromTimestampMs(timestampToTimestampMs(timestamp));
};

/**
 * Builds a `Date` from a `TimestampMs`.
 *
 * @param timestamp The `TimestampMs` to convert.
 * @returns The converted `Date` object.
 */
export const buildDateFromTimestampMs = (timestamp: TimestampMs): Date => {
  return new Date(Number(timestamp.timeMs));
};

/**
 * Converts a `Date` to a `TimestampMs`.
 *
 * @param date The `Date` to convert.
 * @returns The converted `TimestampMs`.
 */
export const buildTimestampMsFromDate = (date: Date): TimestampMs => {
  return buildTimestampMs(BigInt(date.getTime()));
};

/**
 * Converts a `Date` to a `Timestamp`.
 *
 * @param date The `Date` to convert.
 * @returns The converted `Timestamp`.
 */
export const buildTimestampFromDate = (date: Date): Timestamp => {
  return timestampMsToTimestamp(buildTimestampMsFromDate(date));
};

/**
 * Returns the current time in milliseconds.
 *
 * @returns The current `TimestampMs` in millisceonds.
 */
export const nowMs = (): TimestampMs => {
  return buildTimestampMs(BigInt(Date.now()));
};

/**
 * Returns the current time in seconds.
 *
 * @returns The current `Timestamp` in seconds.
 */
export const now = (): Timestamp => {
  return timestampMsToTimestamp(nowMs());
};

/**
 * Builds a new `Timestamp` that is incremented by the provided `Duration`.
 *
 * @param timestamp The `Timestamp` to increment.
 * @param seconds The `Duration` to increment the `Timestamp` by.
 * @returns A new `Timestamp` that is the result of incrementing the provided
 *          `Timestamp` by the provided `Duration`.
 */
export const addSeconds = (
  timestamp: Timestamp,
  seconds: Duration,
): Timestamp => {
  return buildTimestamp(timestamp.time + seconds.seconds);
};

/**
 * Builds a new `Timestamp` that is decrremented by the provided `Duration`.
 *
 * @param timestamp The `Timestamp` to decrement.
 * @param seconds The `Duration` to decrement the `Timestamp` by.
 * @returns A new `Timestamp` that is the result of decrementing the provided
 *          `Timestamp` by the provided `Duration`.
 */
export const subtractSeconds = (
  timestamp: Timestamp,
  seconds: Duration,
): Timestamp => {
  return buildTimestamp(timestamp.time - seconds.seconds);
};

/**
 * Returns the absolute distance between two `Timestamp` values as a
 * `Duration`.
 *
 * @param timestamp1 The first `Timestamp`.
 * @param timestamp2 The second `Timestamp`.
 * @returns The absolute distance between the two `Timestamp` values as a
 *          `Duration`.
 */
export const absoluteTimestampDistance = (
  timestamp1: Timestamp,
  timestamp2: Timestamp,
): Duration => {
  const distance = timestamp1.time - timestamp2.time;
  const absDistance = distance < 0 ? -distance : distance;

  return buildDuration(absDistance);
};

export interface FormatTimestampOptions {
  /**
   * Optional. Identifies if the output should show the date and time, or only
   * date. If not provided, the output will show the date and time.
   */
  showDateOnly?: boolean;

  /**
   * Optional. The name of the time zone to use for the conversion.
   * If not provided, the system time zone is used.
   * If provided, must be a valid IANA time zone identifier.
   * Read more about valid IANA time zone identifiers here:
   * https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
   */
  timeZone?: string;

  /**
   * Optional. Identifies the locale to use for the output.
   * If not provided, the output will be in the en-US locale.
   * If not recognized, the output will be the system's default locale.
   */
  locale?: string;
}

const getSystemTimeZone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

const DEFAULT_LOCALE = "en-US";

/**
 * Formats a `Timestamp` as `string`.
 * 
 * @param timestamp The `Timestamp` to format.
 * @param options Optional. The options for how to format the `Timestamp`.
 * @returns The formatted `Timestamp`.
 * @throws `RangeError` if `options.timeZone` is provided but is not a valid
 *         IANA time zone identifier.
 * @throws `RangeError` if `options.locales` is provided but is not a
 *         syntactically valid.
 * @example date and time
    const timestamp = buildTimestampFromDate(new Date("2024-01-01T01:01:01Z"));
    formatTimestamp(timestamp);
    // "Jan 1, 2024, 1:01 AM" (assuming the system time zone is UTC)
 * @example date only
    const timestamp = buildTimestampFromDate(new Date("2024-01-01T01:01:01Z"));
    formatTimestamp(timestamp, { showDateOnly: true });
    // "Jan 1, 2024" (assuming the system time zone is UTC)
 */
export const formatTimestamp = (
  timestamp: Timestamp,
  options?: FormatTimestampOptions,
): string => {
  const date = buildDateFromTimestamp(timestamp);

  let timeZone: string;
  if (!options || !options.timeZone) {
    timeZone = getSystemTimeZone();
  } else {
    timeZone = options.timeZone;
  }

  let formatOptions: Intl.DateTimeFormatOptions;
  if (!options || options.showDateOnly === undefined || !options.showDateOnly) {
    // show date and time by default
    formatOptions = {
      day: "numeric", // Single-digit day
      month: "short", // Three-letter month
      year: "numeric", // Four-digit year
      hour: "numeric", // Single-digit hour
      minute: "numeric", // Two-digit minute
      timeZone: timeZone,
    };
  } else {
    // show date only
    formatOptions = {
      day: "numeric", // Single-digit day
      month: "short", // Three-letter month
      year: "numeric", // Four-digit year
      timeZone: timeZone,
    };
  }

  let locale: string;
  if (!options || !options.locale) {
    locale = DEFAULT_LOCALE;
  } else {
    locale = options.locale;
  }

  const formatter = new Intl.DateTimeFormat(locale, formatOptions);
  return formatter.format(date);
};

/**
 * Return the distance between the given `Timestamp` values in words.
 *
 * | Distance           | Result              |
 * |--------------------|---------------------|
 * | -1 ... -N years    | [1..N] years ago    |
 * | -1 ... -11 months  | [1..11] months ago  |
 * | -1 ... -29 days    | [1..29] days ago    |
 * | -1 ... -23 hours   | [1..23] hours ago   |
 * | -1 ... -59 minutes | [1..59] minutes ago |
 * | -1 ... -59 seconds | [1..59] seconds ago |
 * | 0 seconds          | now                 |
 * | 1 ... 59 seconds   | in [1..59] seconds  |
 * | 1 ... 59 minutes   | in [1..59] minutes  |
 * | 1 ... 23 hours     | in [1..23] hours    |
 * | 1 ... 29 days      | in [1..29] days     |
 * | 1 ... 11 months    | in [1..11] months   |
 * | 1 ... N years      | in [1..N] years     |
 *
 * Plurals are used as needed in the output.
 * The output locale is always en-US.
 * Distances are rounded down to the nearest whole unit.
 *
 * @param timestamp The `Timestamp` to format.
 * @param baseTimestamp The `Timestamp` to use as the base for the distance
 *                      calculation.
 * @returns The distance between the given `Timestamp` values in words.
 *
 */
export const formatTimestampAsDistance = (
  timestamp: Timestamp,
  baseTimestamp: Timestamp,
): string => {
  if (timestamp.time === baseTimestamp.time) {
    // "0 seconds ago" is not so nice, so override that case to "now".
    return "now";
  }
  return formatDistanceStrict(
    buildDateFromTimestamp(timestamp),
    buildDateFromTimestamp(baseTimestamp),
    {
      addSuffix: true,
      locale: enUS,
      roundingMethod: "floor",
    },
  );
};

/**
 * Return the distance between the given `Timestamp` and now in words.
 *
 * | Distance from now  | Result              |
 * |--------------------|---------------------|
 * | -1 ... -N years    | [1..N] years ago    |
 * | -1 ... -11 months  | [1..11] months ago  |
 * | -1 ... -29 days    | [1..29] days ago    |
 * | -1 ... -23 hours   | [1..23] hours ago   |
 * | -1 ... -59 minutes | [1..59] minutes ago |
 * | -1 ... -59 seconds | [1..59] seconds ago |
 * | 0 seconds          | now                 |
 * | 1 ... 59 seconds   | in [1..59] seconds  |
 * | 1 ... 59 minutes   | in [1..59] minutes  |
 * | 1 ... 23 hours     | in [1..23] hours    |
 * | 1 ... 29 days      | in [1..29] days     |
 * | 1 ... 11 months    | in [1..11] months   |
 * | 1 ... N years      | in [1..N] years     |
 *
 * Plurals are used as needed in the output.
 * The output locale is always en-US.
 * Distances are rounded down to the nearest whole unit.
 *
 * @param timestamp The `Timestamp` to format.
 * @returns The distance between the given `Timestamp` and now in words.
 *
 */
export const formatTimestampAsDistanceToNow = (
  timestamp: Timestamp,
): string => {
  return formatTimestampAsDistance(timestamp, now());
};

/**
 * A `TimePeriod` represents a range of time between two `Timestamp` values.
 *
 * Data model constraints:
 *
 * - All `TimePeriod` are inclusive, meaning that the beginning and end
 *   `Timestamp` values are always included in the range.
 * - The begin `Timestamp` is always before or the same as the end `Timestamp`.
 * - A `TimePeriod` may be a single point in time if the begin and end
 *   `Timestamp` values are equal.
 */
export interface TimePeriod {
  /**
   * The beginning of the `TimePeriod`.
   */
  begin: Timestamp;

  /**
   * The end of the `TimePeriod`.
   * Always after or the same as `begin`.
   */
  end: Timestamp;
}

/**
 * Builds a `TimePeriod`.
 *
 * @param begin The beginning of the `TimePeriod`.
 * @param end The end of the `TimePeriod`.
 * @returns The resulting `TimePeriod`.
 * @throws `Error` if `begin` is after `end`.
 */
export const buildTimePeriod = (
  begin: Timestamp,
  end: Timestamp,
): TimePeriod => {
  if (begin.time > end.time)
    throw new Error(
      `Error in buildTimePeriod. begin ${buildDateFromTimestamp(begin)}} comes after end ${buildDateFromTimestamp(end)}.`,
    );
  return {
    begin,
    end,
  };
};

/**
 * Identifies if the given `Timestamp` is within the given `TimePeriod`
 * (inclusive).
 *
 * @param period The `TimePeriod` to check.
 * @param timestamp The `Timestamp` to check.
 * @returns `true` if the `Timestamp` is within the `TimePeriod`, otherwise
 *          `false`.
 */
export const isOverlappingTimestamp = (
  period: TimePeriod,
  timestamp: Timestamp,
): boolean => {
  return (
    period.begin.time <= timestamp.time && timestamp.time <= period.end.time
  );
};

/**
 * Identifies if the given `TimePeriod` values overlap (inclusive).
 *
 * @param period1 The first `TimePeriod` to check.
 * @param period2 The second `TimePeriod` to check.
 * @returns `true` if the `TimePeriod` values overlap, otherwise `false`.
 */
export const isOverlappingTimePeriod = (
  period1: TimePeriod,
  period2: TimePeriod,
): boolean => {
  return (
    isOverlappingTimestamp(period1, period2.begin) ||
    isOverlappingTimestamp(period1, period2.end)
  );
};

/**
 * Returns the `Duration` of a `TimePeriod`.
 *
 * @param period The `TimePeriod` to measure.
 * @returns The `Duration` of the `TimePeriod`.
 */
export const timePeriodDuration = (period: TimePeriod): Duration => {
  return absoluteTimestampDistance(period.begin, period.end);
};

/**
 * Identifies if an `IndefiniteTimePeriod` includes all time before or after
 * its boundary `Timestamp`.
 */
export const IndefiniteTimePeriodType = {
  /**
   * The `IndefiniteTimePeriod` includes all time before the boundary and the
   * boundary itself.
   */
  IndefinitePast: "indefinite-past",

  /**
   * The `IndefiniteTimePeriod` includes the boundary itself and all time after
   * the boundary.
   */
  IndefiniteFuture: "indefinite-future",
} as const;

export type IndefiniteTimePeriodType =
  (typeof IndefiniteTimePeriodType)[keyof typeof IndefiniteTimePeriodType];

/**
 * An `IndefiniteTimePeriod` represents a range of time between a definite
 * `Timestamp` and all time before or after it.
 * All `IndefiniteTimePeriod` are inclusive, meaning that the boundary
 * `Timestamp` is included in the range.
 */
export interface IndefiniteTimePeriod {
  /**
   * The definite moment that the `IndefiniteTimePeriod` begins or ends.
   */
  boundary: Timestamp;

  /**
   * The type of `IndefiniteTimePeriod`.
   *
   * - If `IndefinitePast`, the `IndefiniteTimePeriod` includes all time before
   * the boundary and the boundary itself.
   * - If `IndefiniteFuture`, the `IndefiniteTimePeriod` includes the boundary
   * itself and all time after the boundary.
   */
  type: IndefiniteTimePeriodType;
}

/**
 * Builds an `IndefiniteTimePeriod`.
 *
 * @param boundary The definite moment that the `IndefiniteTimePeriod` begins or ends.
 * @param type The type of `IndefiniteTimePeriod`.
 * @returns The resulting `IndefiniteTimePeriod`.
 */
export const buildIndefiniteTimePeriod = (
  boundary: Timestamp,
  type: IndefiniteTimePeriodType,
): IndefiniteTimePeriod => {
  return {
    boundary,
    type,
  };
};

/**
 * Identifies if the `IndefiniteTimePeriod` overlaps with the `Timestamp`
 * (inclusive).
 *
 * @param indefinitePeriod The `IndefiniteTimePeriod` to check.
 * @param timestamp The `Timestamp` to check.
 * @returns `true` if the `Timestamp` is within the `IndefiniteTimePeriod`,
 *          otherwise `false`.
 */
export const isTimestampOverlappingIndefiniteTimePeriod = (
  indefinitePeriod: IndefiniteTimePeriod,
  timestamp: Timestamp,
): boolean => {
  if (indefinitePeriod.type === IndefiniteTimePeriodType.IndefinitePast) {
    return timestamp.time <= indefinitePeriod.boundary.time;
  } else {
    return timestamp.time >= indefinitePeriod.boundary.time;
  }
};

/**
 * Identifies if the `IndefiniteTimePeriod` overlaps with the `TimePeriod`
 * (inclusive).
 *
 * @param indefinitePeriod The `IndefiniteTimePeriod` to check.
 * @param period The `TimePeriod` to check.
 * @returns `true` if the `TimePeriod` is within the `IndefiniteTimePeriod`,
 *          otherwise `false`.
 */
export const isTimePeriodOverlappingIndefiniteTimePeriod = (
  indefinitePeriod: IndefiniteTimePeriod,
  period: TimePeriod,
): boolean => {
  return (
    isTimestampOverlappingIndefiniteTimePeriod(
      indefinitePeriod,
      period.begin,
    ) ||
    isTimestampOverlappingIndefiniteTimePeriod(indefinitePeriod, period.end)
  );
};

/**
 * Identifies if the `IndefiniteTimePeriod` values overlap (inclusive).
 *
 * @param period1 The first `IndefiniteTimePeriod` to check.
 * @param period2 The second `IndefiniteTimePeriod` to check.
 * @returns `true` if the `IndefiniteTimePeriods` overlap, otherwise `false`.
 */
export const isOverlappingIndefiniteTimePeriod = (
  period1: IndefiniteTimePeriod,
  period2: IndefiniteTimePeriod,
): boolean => {
  // Overlap is eventually guaranteed if both `IndefiniteTimePeriod` values are
  // of the same type.
  if (period1.type === period2.type) {
    return true;
  }

  // Since the `IndefiniteTimePeriod` values are of different types it is
  // guaranteed that either they both overlap or neither overlap. Therefore we
  // only need to check if either of the `IndefiniteTimePeriod` values overlap
  // the boundary of the other.
  return isTimestampOverlappingIndefiniteTimePeriod(period1, period2.boundary);
};
