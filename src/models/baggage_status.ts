export enum BaggageStatus{
    checkin='checkin',
    loaded='loaded',
    inTransit='In-transit',
    unloaded='unloaded',
    atBelt='at Belt',
    lost='lost'
}

export namespace BaggageStatus {
  export function toString(): string {
    return Object.values(BaggageStatus).join(", ");;
  }
}
