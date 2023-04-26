
// Import Config & Init & eventfiles
import { client, eventFiles } from '../../index.js'

for (const file of eventFiles) {
	let event = await import(`../events/${file}`)
	event = event.default
	if (event.once)
		client.once(event.name, (...args) => event.execute(...args))
	else
		client.on(event.name, (...args) => event.execute(...args))
}