# Regex-Coordinates

A single-page web application to parse text as coordinate data and
output coordinate data as GeoJSON.

Visit https://regex-coordinates.leifgehrmann.com/ to see it live.

It solves a common use-case where one has a bunch of poorly structure CSV or
database table output and one wants to simply display it quickly on a map.

After generating the GeoJSON output, one can copy and paste it into
http://geojson.io/

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Additional notes

This is my first time messing around with Vue. I'm normally more familiar with
jQuery, but I'm using this project to try to understand Vue.
I took the bold step of using Vue CLI and Vuetify to quickly get things up and
running, but that does mean the structure of this project is garbage.
This isn't my finest quality work 😅
