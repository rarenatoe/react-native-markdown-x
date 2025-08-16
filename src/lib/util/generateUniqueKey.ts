let uuid = new Date().getTime();

export function generateUniqueKey() {
  uuid++;
  return `rnm_${uuid.toString(16)}`;
}
