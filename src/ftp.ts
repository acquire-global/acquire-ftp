import * as ftp from 'basic-ftp'
import { Stream } from 'stream'

export default class AcquireFTPService {
	private _client: ftp.Client
	private _username: string
	private _password: string
	static ACQUIRE_FTP_HOSTNAME = 'ftp.acquireglobal.com'
	readonly FOLDERS = {
		ARTICLES: '/static/articles/',
		FEEDS_INBOX: '/feeds/Inbox/',
		FEEDS: '/feeds/',
		IMAGES: '/images/',
		PAGES: '/static/pages/',
		PORTALS: '/static/portals/',
		PROMOS: '/static/promos/',
		TEST: '/static/test/',
		THEMES: '/static/themes/',
	}

	readonly FEED_DEFAULT_DESTINATION = this.FOLDERS.FEEDS_INBOX

	constructor(username: string, password: string) {
		this._client = new ftp.Client()
		this._username = username
		this._password = password
	}

	async connect() {
		await this._client.access({
			host: AcquireFTPService.ACQUIRE_FTP_HOSTNAME,
			user: this._username,
			password: this._password,
			port: 990,
			secure: 'implicit',
			secureOptions: { rejectUnauthorized: false },
		})
	}

	public async uploadFeed({
		filename,
		contents,
		destination = this.FEED_DEFAULT_DESTINATION,
	}: {
		filename: string
		contents: string
		destination?: string
	}) {
		this._client.closed && (await this.connect())
		console.log(`Uploading '${destination + filename}'`)
		await this._client
			.uploadFrom(Stream.Readable.from(contents), `${destination + filename}`)
			.catch((error) => {
				console.error(error)
			})
		console.log(`Finished uploading '${destination + filename}'`)
	}

	disconnect() {
		this._client.close()
	}
}
