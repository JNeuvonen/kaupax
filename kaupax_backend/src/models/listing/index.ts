export function parseAddress(address: string) {
  if (!address) {
    return null;
  }
  const parts = address.split(",");

  if (parts.length === 4) {
    return {
      street: parts[0],
      city: parts[2],
    };
  }

  return { street: parts[0], city: parts[1] };
}
