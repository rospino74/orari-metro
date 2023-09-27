import { error } from '@sveltejs/kit';

export const deserializeBusStopsFromParam = (param: string) => {
    const validOrThrow = (sID: string) => {
        const temp = Number(sID)

        if (isNaN(temp))
            throw error(400, 'Stop ID must be a number or a plus-separated list of numbers!');

        return temp;
    }

    let out: Array<BusStop>;
    if (param.includes('+')) {
        out = param.split('+').map(id => {
            if (id.includes('-')) {
                const parts = id.split('-');

                return {
                    id: validOrThrow(parts[0]),
                    exclude: parts.slice(1)
                }
            }

            return validOrThrow(id);
        });
    } else {
        out = [validOrThrow(param)];
    }

    return out;
}

export const serializeBusStopsAsParam = (busStops: Array<BusStop>) => busStops.map(bs => {
	if (typeof bs === "number")
		return bs;

	// bs è un oggetto
	const { id, exclude } = bs;
	let ret = id.toString();

	if (exclude.length > 0) {
		ret += '-' + exclude.join('-');
	}

	return ret;
}).join('+');