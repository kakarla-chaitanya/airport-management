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

export function createEmptyBaggageStatusCount(): Record<BaggageStatus, number> {
  return Object.values(BaggageStatus).filter((x)=>typeof x==="string").reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as Record<BaggageStatus, number>);
}