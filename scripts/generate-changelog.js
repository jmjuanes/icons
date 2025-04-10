import {sortIcons} from "./helpers.js";
import meta from "../meta.json" with {type: "json"};

// @description function to short the versions
const sortVersions = versions => {
    return versions.sort((a, b) => {
        return a.replace(/\d+/g, n => +n+100000).localeCompare(b.replace(/\d+/g, n => +n+100000));
    });
};

// @description export method to generate the changelog data
export const generateChangelogData = () => {
    const icons = Object.keys(meta);
    // 1. get the list of unique versions registered in 'meta.json'
    const uniqueVersions = new Set();
    icons.forEach(icon => {
        if (!!meta[icon].version) {
            uniqueVersions.add(meta[icon].version);
        }
    });
    // 2. sort the versions (from newest to oldest)
    const versions = sortVersions(Array.from(uniqueVersions)).reverse();
    // 3. create the changelog object
    return versions.map(version => {
        return {
            version: version,
            icons: sortIcons(icons.filter(icon => {
                return meta[icon].version === version;
            })),
        };
    });
};
