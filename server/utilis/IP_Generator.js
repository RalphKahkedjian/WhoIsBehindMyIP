const { createHash, randomBytes } = require('crypto')

// method to generate a random number
function generate_random_number(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Random IPv4
function generate_random_ipv4() {
  const a = generate_random_number(1, 254)
  const b = generate_random_number(0, 255)
  const c = generate_random_number(0, 255)
  const d = generate_random_number(1, 254)

  return `${a}.${b}.${c}.${d}`
}

// Deterministic IPv4 from sessionId
function deterministicIPv4FromSession(sessionID) {
  const h = createHash('sha256').update(sessionID).digest()
  const a = (h[0] % 254) + 1;
  const b = h[1];
  const c = h[2];
  const d = (h[3] % 254) + 1;

  return `${a}.${b}.${c}.${d}`;
}

// Random IPv6 helper
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random IPv6
function randomIPv6() {
  const parts = [];
  for (let i = 0; i < 8; i++) {
    parts.push(((randInt(0, 0xffff)).toString(16)).padStart(4, '0'));
  }
  return parts.join(':');
}

// Deterministic IPv6
function deterministicIPv6FromSession(sessionId) {
  const h = createHash('sha256').update(sessionId).digest();
  const parts = [];
  for (let i = 0; i < 8; i++) {
    const hi = h[i*2];
    const lo = h[i*2 + 1];
    parts.push(((hi << 8) | lo).toString(16).padStart(4, '0'));
  }
  return parts.join(':');
}

// Random session ID
function makeSessionId() {
  return randomBytes(8).toString('hex');
}

module.exports = {
  generate_random_number,
  generate_random_ipv4,
  deterministicIPv4FromSession,
  randomIPv6,
  deterministicIPv6FromSession,
  makeSessionId,
};
