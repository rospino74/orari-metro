// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App { }

	type BusStop = number | { id: number, exclude: Array<string> }

	interface StationInfo {
		name: string,
		asc: { delay: number, terminus: bool, dest: string },
		disc: { delay: number, terminus: bool, dest: string },
		nearBusStops?: Array<BusStop>,
	}

	interface StationStatus {
		name: string,
		weather: Weather,
		temperature: number,
		warnings?: Array<string>,
		info?: Array<string>,
	}

	interface StationTransits {
		metroTransits: Array<Transit>,
		busTransits?: Array<Transit>,
	}

	interface Transit {
		line: string,
		branch: boolean,
		dest: string,
		departure: boolean,
		forecasts: Array<Date>
	}

	type RGBColor = `rgb(${number}, ${number}, ${number})`;
	type RGBAColor = `rgba(${number}, ${number}, ${number}, ${number})`;
	type HSLColor = `hsl(${number}, ${number}%, ${number}%)`;
	type HEXColor = `#${string}`;
	type Color = RGBColor | RGBAColor | HSLColor | HEXColor;

	type Weather = 'cloudy' | 'clear' | 'rainy' | 'snowy';
}


import 'unplugin-icons/types/svelte';

export { };
