import { v4 as uuidv4 } from 'uuid'

export function getUUID() {
	const result = uuidv4()
	return result
}
