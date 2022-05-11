export default (a: any[], b: any[]) => [...Array.from(new Set([...a, ...b]))];
