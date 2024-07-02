import type { User } from "@clerk/nextjs/server";

const getInitials = (user: User): string => {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }

  if (user.firstName) {
    return user.firstName.slice(0, 2).toUpperCase();
  }

  if (user.emailAddresses && user.emailAddresses[0]?.emailAddress) {
    const email = user.emailAddresses[0].emailAddress;
    return email.slice(0, 2).toUpperCase();
  }

  if (user.username) {
    return user.username.slice(0, 2).toUpperCase();
  }

  return "??";
};

export default getInitials;
