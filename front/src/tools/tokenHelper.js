export default {
  getExpirationTimestamp: (expiresIn) => {
    const expiresDate = new Date((Date.now() / 1000) + expiresIn);
    return String(expiresDate.getTime());
  }
}
