const { client, createClient, ldapTeacherBase, ldapPlusBase, ldapAdminBase, Change, InvalidCredentialsError } = require('../config/ldap')
/*
const {
  validName,
  validSurname1,
  validSurname2,
  validEmail,
  validIdSim
} = require('../validators/teacher')
const { validPassword } = require('../validators/common-validators')
const { IncorrectPasswordError } = require('../errors')
const ROLES = require('../globals/userRoles')
*/
const getTeacherDN = uid => `uid=${uid},${ldapTeacherBase}`
const getStudentDN = uid => `uid=${uid},${ldapPlusBase}`
const getAdminDN = uid => `uid=${uid},${ldapAdminBase}`

const getDNbyRole = (uid, role) => {
  switch (role) {
    case ROLES.TEACHER:
    case ROLES.TEACHER_DEMO:
    case ROLES.TEACHER_FAKE:
    case ROLES.USER_INTERNAL:
      return getTeacherDN(uid)
    case ROLES.CUSTOMER_SUPPORT:
    case ROLES.INTERNAL_SUPPORT:
      return getAdminDN(uid)
    case ROLES.STUDENT:
      return getStudentDN(uid)
    default:
      return getTeacherDN(uid)
  }
}

class ldapClient {
  constructor () {
    this._client = client
  }

  getUserByEmail (email, ldapBase) {
    return new Promise((resolve, reject) => {
      const ldapSearchOpts = {
        filter: `(mail=${email})`,
        scope: 'sub',
        attributes: ['uid', 'nsAccountLock']
      }

      client.search(ldapBase, ldapSearchOpts, (err, response) => {
        if(err) {
          console.log(`[LDAP] ERROR Searching user: ${err}`)
          reject(err)
        }

        let result = []

        response.on('searchEntry', (entry) => {
          result.push(entry.object)
        })
        response.on('error', (err) => {
          console.error(`[LDAP] ERROR Searching user by email ${err} in ${ldapBase}`)
          if(err) reject(err)
        })
        response.on('end', (res) => {
          resolve(result.map(user => (
            {
              id: Number.parseInt(user.uid),
              nsAccountLock: user.nsAccountLock === 'true'
            }
          )))
        })
      })
    })
  }

  getUserByEmailPlus(email) { return this.getUserByEmail(email, ldapPlusBase) }
  getUserByEmailPremium(email) { return this.getUserByEmail(email, ldapTeacherBase) }
  getUserByEmailAdmin(email) { return this.getUserByEmail(email, ldapAdminBase) }

  ldapSearchUserByUid (uid) {
    return new Promise((resolve, reject) => {
      console.log(`[LDAP] Searching user by uid: ${uid}`)
      // uids must be integer
      if(!validIdSim(uid)) { // https://github.com/validatorjs/validator.js#strings-only
        console.log('[LDAP] ERROR trying to search non-integer user')
        reject(new Error('[LDAP] trying to search non-integer user'))
      }

      const ldapSearchOpts = {
        filter: `(uid=${uid})`,
        scope: 'sub',
        sizeLimit: 1,
        attributes: [ 'uid', 'givenName', 'cn', 'sn', 'mail', 'nsAccountLock' ]
      }

      client.search(ldapTeacherBase, ldapSearchOpts, (err, response) => {
        if(err) {
          console.log(`[LDAP] ERROR Searching user: ${err}`)
          reject(err)
        }

        let result = []

        response.on('searchEntry', (entry) => {
          console.log('[LDAP] user found: ' + JSON.stringify(entry.object))
          result.push(entry.object)
        })
        response.on('error', (err) => {
          console.log(`[LDAP] ERROR Searching user ${err}`)
          if(err) reject(err)
        })
        response.on('end', (res) => {
          console.log('[LDAP] Search operation complete - Status: ' + res.status)
          resolve(result.map(user => ({
            uid: user.uid,
            givenName: user.givenName,
            cn: user.cn,
            sn: user.sn,
            mail: user.mail,
            nsAccountLock: user.nsAccountLock === 'true'
          })))
        })
      })
    })
  }

  ldapSearchAdminByUid (uid) {
    return new Promise((resolve, reject) => {

        console.log(`[LDAP] Searching user by uid: ${uid}`)

        // uids must be integer
        if (!validator.isInt(uid + '')) { // https://github.com/validatorjs/validator.js#strings-only
            console.log('[LDAP] ERROR trying to search non-integer user')
            reject('[LDAP] trying to search non-integer user')
        }

        const ldapSearchOpts = {
            filter: `(uid=${uid})`,
            scope: 'sub',
            sizeLimit: 1,
            attributes: ['uid', 'givenName', 'cn', 'sn', 'mail' ]
        };

        client.search(ldapAdminBase, ldapSearchOpts, (err, response) => {
            if (err) {
                console.log(`[LDAP] ERROR Searching user: ${err}`)
                reject(err);
            }

            let result = {};

            response.on('searchEntry', (entry) => {
                console.log('[LDAP] user found: ' + JSON.stringify(entry.object));
                result = entry.object;
            });
            response.on('error', (err) => {
                console.log(`[LDAP] ERROR Searching user ${err}`)
                if (err) reject(err);
            });
            response.on('end', (res) => {
                console.log('[LDAP] Search operation complete - Status: ' + res.status);
                resolve(result);
            })
        })
    })
  }

  
  bindUser(uid, password) {
    return new Promise((resolve, reject) => {
      let bindClient
      try {
        bindClient = createClient()
        bindClient.bind(getTeacherDN(uid), password, (err) => {
          bindClient.destroy()
          if(err instanceof InvalidCredentialsError) return reject(new IncorrectPasswordError())
          if(err) return reject(err)
          return resolve()
        })
      } catch(err) {
        return reject(err)
      }
    })
  }

}

module.exports = ldapClient