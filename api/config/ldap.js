const ldap = require('ldapjs');

const ldapTeacherBase = process.env.LDAP_TEACHER_BASE || 'ou=teachers,ou=people,dc=oupedev,dc=es'
const ldapAdminBase = process.env.LDAP_ADMIN_BASE || 'ou=administrators,ou=people,dc=oupedev,dc=es'
const ldapPlusBase = process.env.LDAP_PLUS_BASE || 'ou=students,ou=people,dc=oupedev,dc=es'

const createClient  = () => {
  const ldapOptions = {
      url: process.env.LDAP_URL || 'ldap://192.168.30.94:389',
      timeout: process.env.LDAP_TIMEOUT || 2000,	                        // Milliseconds client should let operations live for before timing out (Default: Infinity)
      connectTimeout: process.env.LDAP_CONNECT_TIMEOUT || 2000, 	        // Milliseconds client should wait before timing out on TCP connections (Default: OS default)
      idleTimeout: process.env.LDAP_IDLE_TIMEOUT || 2000, 	            // Milliseconds after last activity before client emits idle event (Default: 0)
      bindDN: process.env.LDAP_ADMIN_DN || 'uid=admin,dc=oupedev,dc=es',  // Undocumented: https://github.com/joyent/node-ldapjs/blob/master/lib/client/client.js#L343
      bindCredentials : process.env.LDAP_ADMIN_PASSWORD || 'secret',      // Undocumented too
      queueSize: process.env.LDAP_QUEUE_SIZE || 0,                        // Undocumented: https://github.com/joyent/node-ldapjs/blob/master/lib/client/client.js#L335
      queueTimeout: process.env.LDAP_QUEUE_TIMEOUT || 0,                  // Same as above
      queueDisable: process.env.LDAP_QUEUE_TIMEOUT === "true",            // Same as above
  }

  // Undocumented but very useful!!
  // In dev it will disconnect every 5 mins 30s
  // https://github.com/joyent/node-ldapjs/issues/392
  // https://github.com/joyent/node-ldapjs/blob/master/lib/client/client.js#L323

  if (process.env.LDAP_RECONNECT) {
      ldapOptions.reconnect = {
          initialDelay: process.env.LDAP_RECONNECT_INITIAL_DELAY || 100,  // default value 100
          maxDelay: process.env.LDAP_RECONNECT_MAX_DELAY || 5000,         // default value 10000
          failAfter: process.env.LDAP_RECONNECT_FAIL_AFTER || 10,         // default value infinty
      };
  }

  const client = ldap.createClient(ldapOptions);

  client.on('error', err => {
      console.error(`[LDAP] ERROR Connecting to LDAP: ${err}`)
      throw new Error(err)
  });

  // Es necesario volver a hacer bind en caso de que se caiga la conexión y haya que reconectar (al incluir el parámetro reconnect)
  // salvo que incluyamos el bind en todas las funciones que usan LDAP, que no parece muy razonable.
  // https://github.com/joyent/node-ldapjs/issues/392#issuecomment-308924100

  client.on('connect', function () {
      console.log(`${new Date()} [LDAP] Connect successful`);
      client.bind(ldapOptions.bindDN, ldapOptions.bindCredentials, (err) => {
          if (err) {
              console.log('[LDAP] ERROR while ldap binding on r' + err);
              throw new Error(err)
          }
          console.log('[LDAP] Bind successful');
      });
  });

  return client;
}

const Change = ldap.Change

module.exports = {
  ldapTeacherBase,
  ldapAdminBase,  
  ldapPlusBase,
  ldapAdminBase,
  client: createClient(),
  createClient,
  Change,
  InvalidCredentialsError: ldap.InvalidCredentialsError
}
