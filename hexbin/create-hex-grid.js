// load libraries
// may need to import turf `npm install @turf/turf`
const fs = require("fs")
const turf = require("@turf/turf")

// rough geographic bounding box of NYC
//tool https://boundingbox.klokantech.com/
// const bbox = [ -90.0581, 42.4585, -87.3502, 43.6198  ]
const bbox = [-88.2244, 42.791, -87.7105, 43.2736];

// size in kilometers we want each side of our hex grids
const cellSize = 0.25

// create the hexbin geometry for the given bbox and cell resolution
const hexGrid = turf.hexGrid(bbox, cellSize)

// write output data
fs.writeFileSync("./hex-grid.json", JSON.stringify(hexGrid))
