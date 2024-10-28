import { ethers } from 'ethers';
import { Platform } from 'react-native';

if (Platform.OS !== 'web') {
  const crypto = require('react-native-quick-crypto');

  ethers.randomBytes.register((length) => {
    return new Uint8Array(crypto.randomBytes(length));
  });

  ethers.computeHmac.register((algo, key, data) => {
    return crypto.createHmac(algo, key).update(data).digest();
  });

  ethers.pbkdf2.register((passwd, salt, iter, keylen, algo) => {
    return crypto.pbkdf2Sync(passwd, salt, iter, keylen, algo);
  });

  ethers.sha256.register((data) => {
    return crypto.createHash('sha256').update(data).digest();
  });

  ethers.sha512.register((data) => {
    return crypto.createHash('sha512').update(data).digest();
  });
}

export { ethers };
