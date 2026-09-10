// Do not import RiderAccountStatus/RiderStatus from @prisma/client.
// This project currently does not expose those enums from that package.

type RiderAccountStatus = "Active" | "Suspended" | "Blocked";
type RiderStatus = "Available" | "Busy" | "Offline";

export function isRiderEligibleForNewAssignment(
  accountStatus: RiderAccountStatus,
  status: RiderStatus
): boolean {
  return accountStatus === "Active" && status === "Available";
}
