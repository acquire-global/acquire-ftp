import AcquireFTPService from './ftp'

const acquireFTP = {
	config: ({
		username,
		password,
	}: {
		username: string | undefined
		password: string | undefined
	}): AcquireFTPService => {
		if (!username || !password)
			throw new Error('Username and password must be set')
		return new AcquireFTPService(username, password)
	},
}

export default acquireFTP
