import { LatLon, Metro, MOSCOW, SPB } from './data';

type Storage = { lines: Map<string, StoredLine>; stations: Map<string, StoredStation> };

enum Cities {
    MOSCOW = 'moscow',
    SPB = 'spb'
}

interface StoredLine {
    name: string;
    hex: string;
    stations: Array<string>;
}

type StoredStation = {
    name: string;
    line: string;
    latlon: LatLon;
};

const metroByCity: { [item: string]: Storage } = {};

function prepareData(namespace: string, source: Array<Metro>) {
    const lines: Map<string, StoredLine> = new Map();
    const stations: Map<string, StoredStation> = new Map();

    source.forEach((metro) => {
        const { line, stations: mStation } = metro;
        const storedLine: StoredLine = { name: line.name, hex: line.hex, stations: [] };

        mStation.forEach((station) => {
            const storedStation: StoredStation = { name: station.name, latlon: station.latlon, line: line.name };
            stations.set(station.name, storedStation);
            storedLine.stations.push(station.name);
        });

        lines.set(line.name, storedLine);
    });

    metroByCity[namespace] = { lines, stations };
}

prepareData(Cities.MOSCOW, MOSCOW);
prepareData(Cities.SPB, SPB);

interface Station {
    name: string;
    latlon: LatLon;
}

interface StationExtended {
    name: string;
    latlon: LatLon;
    hex: string;
    line: string;
}

interface Line {
    name: string;
    hex: string;
    stations: Array<Station>;
}

function getLines(city: Cities): Array<Line> {
    const result: Array<Line> = [];
    const source = metroByCity[city];

    source.lines.forEach((line) => {
        const stations = line.stations
            .map((station) => {
                const s = source.stations.get(station);

                return s ? { name: s.name, latlon: s.latlon } : null;
            })
            .filter(Boolean) as Array<Station>;

        result.push({
            name: line.name,
            hex: line.hex,
            stations
        });
    });

    return result;
}

function getStations(city: Cities): Array<Station> {
    const source = metroByCity[city];
    const result: Array<StationExtended> = [];

    source.stations.forEach((station) => {
        const line = source.lines.get(station.line);

        if (!line) {
            return;
        }

        result.push({
            name: station.name,
            latlon: station.latlon,
            hex: line.hex,
            line: line.name
        });
    });

    return result;
}

function getLinesMoscow(): Array<Line> {
    return getLines(Cities.MOSCOW);
}

function getLinesSpb(): Array<Line> {
    return getLines(Cities.SPB);
}

function getStationsMoscow(): Array<Station> {
    return getStations(Cities.MOSCOW);
}

function getStationsSpb(): Array<Station> {
    return getStations(Cities.SPB);
}

export type { Line, Station };
export { Cities, getLines, getLinesMoscow, getLinesSpb, getStations, getStationsMoscow, getStationsSpb };
