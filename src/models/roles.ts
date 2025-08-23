export enum Roles{
    admin="Admin",
    airlineStaff="Airline staff",
    baggageStaff="Baggage staff",
    user="user",
}

export namespace Roles {
  export function toString(): string {
    return Object.values(Roles).join(", ");;
  }
}