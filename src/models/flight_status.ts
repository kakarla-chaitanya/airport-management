export enum FlightStatus{
    scheduled='scheduled',
    boarding='boarding',
    departed='departed',
    arrived= 'arrived', 
    delayed='delayed',
    cancelled= 'cancelled'
}

export namespace FlightStatus {
  export function toString(): string {
    return Object.values(FlightStatus).join(", ");;
  }
}