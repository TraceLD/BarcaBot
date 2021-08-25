export class StatsConverter {
  private readonly minutesPlayed: number;

  constructor(minutesPlayed: number) {
    this.minutesPlayed = minutesPlayed;
  }

  toPer90(statistic: number): number {
    if (statistic < 0) {
      throw new Error("Argument 'statistic' cannot be less than 0");
    }

    if (statistic === 0) {
      return 0;
    }

    return (statistic / this.minutesPlayed) * 90;
  }
}
