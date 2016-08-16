import moment = require("moment/moment");
import Moment = moment.Moment;
import Duration = moment.Duration;

/**
 * represents the lifetime of a timestamp and adds functionallity to it
 */
export class TimestampLifetime {
  /**
   * @param lifetimeDuration the duration representing the lifetime of the regarding timestamp
   */
  constructor(public lifetimeDuration: Duration) {
  }

  public toString(): string {
    if (this.lifetimeDuration.days() > 0) {
      return '23:59';
    }

    let leftPadNumber: (number) => string = (num: number): string => {
      let numString = num.toString();
      while (numString.length < 2) numString = '0' +  numString;
      return numString;
    };

    return leftPadNumber(this.lifetimeDuration.hours()) + ':' + leftPadNumber(this.lifetimeDuration.minutes());
  }
}

/**
 * provides functionallity regarding timestamps
 */
export class TimestampUtils {
  /**
   * calculates the lifetime of given timestamp
   *
   * @param timestamp the timestamp to calculate the lifetime for
   * @returns {TimestampLifetime} the timestamps lifetime
   */
  public static getTimestampLifetime(timestamp: number): TimestampLifetime {
    return new TimestampLifetime(moment.duration(moment().diff(moment.unix(timestamp))));
  }
}