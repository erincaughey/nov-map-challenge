// load libraries
const fs = require("fs")
const turf = require("@turf/turf")
const turfMeta = require("@turf/meta")
const simpleStats = require("simple-statistics")
const d3 = require("d3-array")

// load our data
const data = require("../data/april-rejected-ballots-geocode-batch-1.json")

// rough geographic bounding box of NYC
//tool https://boundingbox.klokantech.com/
const bbox = [ -90.0581, 42.4585, -87.3502, 43.6198  ]
// size in kilometers we want each side of our hex grids
const cellSize = 1

// create the hexbin geometry for the given bbox and cell resolution
const hexGrid = turf.hexGrid(bbox, cellSize)

// perform a "spatial join" on our hexGrid geometry and our crashes point data
const collected = turf.collect(hexGrid, data, "ward", "address")

// get rid of polygons with no joined data, to reduce our final output file size
collected.features = collected.features.filter(d => d.properties.address.length)

// count the number of crashes per hexbin
turfMeta.propEach(collected, props => {
  props.count = props.address.reduce((acc, cur) => acc += 1, 0)
})

// reduce our count address to a new array of numbers
const reduced = turfMeta.featureReduce(collected, (acc, cur) => {
  acc.push(cur.properties.count)
  return acc
}, [])

// compute the ckMeans binning for data into 7 classes from reduced address
const ck = simpleStats.ckmeans(reduced, 7)

// tack on the bin number to our data, as well as its min and max address
turfMeta.propEach(collected, props => {
  ck.forEach((bin, index) => {
    if (bin.indexOf(props.count) > -1) {
      props.bin = index
      props.binVal = d3.extent(bin)
    }
  })
})

// remove the "address" property from our hexBins as it's no longer needed
turfMeta.propEach(collected, props => {
  delete props.address
})

// write output data
fs.writeFileSync("./processed.json", JSON.stringify(collected))