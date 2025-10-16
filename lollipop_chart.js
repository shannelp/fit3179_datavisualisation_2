// avg_rating_lollipop.js
const avgRatingSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Horizontal lollipop chart of average rating by location (range 4.0–4.3).",
  title: {
    text: "Average Customer Ratings Across Malaysian Locations",
    subtitle: "Comparing mean review scores based on food reviews",
    fontSize: 25,
    subtitleFontSize: 16,
    anchor: "center",
    color: "#000000",
    subtitleColor: "#5e5e5e"
  },
  data: {
    url: "https://raw.githubusercontent.com/shannelp/vegadata/main/food_ratings.csv",
    format: { type: "csv" }
  },
  transform: [
    { calculate: "toNumber(datum.Rating)", as: "RatingNum" },
    { filter: "isValid(datum.RatingNum)" },
    {
      // Only JB -> Johor Bahru and KL -> Kuala Lumpur
      calculate: "replace(replace(datum.Location, 'JB', 'Johor Bahru'), 'KL', 'Kuala Lumpur')",
      as: "LocationFull"
    },
    {
      aggregate: [
        { op: "mean", field: "RatingNum", as: "avg_rating" },
        { op: "count", as: "reviews" }
      ],
      groupby: ["LocationFull"]
    },
    { joinaggregate: [{ op: "max", field: "avg_rating", as: "max_avg" }] },
    { calculate: "abs(datum.avg_rating - datum.max_avg) < 1e-6", as: "isTop" }
  ],
  height: 500,
  width: 400,
  layer: [
    {
      mark: { type: "text", align: "left", baseline: "bottom", dx: 6, dy: -6, fontSize: 12, color: "#032223" },
      encoding: { x: { value: 4.2 }, y: { value: 0 } }
    },
    {
      mark: { type: "rule", strokeWidth: 4 },
      encoding: {
        y: { field: "LocationFull", title: "Location", type: "nominal", sort: "ascending", axis: { labelAngle: 0, labelFontSize: 14, titleFontSize: 16 } },
        x: {
          field: "avg_rating",
          type: "quantitative",
          scale: { domain: [4.0, 4.3], zero: false, nice: false },
          axis: { format: ".2f", tickCount: 7, labelAngle: 0, labelFontSize: 14, titleFontSize: 16 }
        },
        x2: { value: 4.0 },
        color: { condition: { test: "datum.isTop", value: "#FFD1D1" }, value: "#cfe8e4" }
      }
    },
    {
      mark: { type: "circle" },
      encoding: {
        y: { field: "LocationFull", type: "nominal", sort: "ascending" },
        x: {
          field: "avg_rating",
          type: "quantitative",
          title: "Average Food Rating",
          scale: { domain: [4.0, 4.3], zero: false, nice: false },
          axis: { format: ".2f", tickCount: 7, labelAngle: 0, labelFontSize: 12, titleFontSize: 14 }
        },
        size: { condition: { test: "datum.isTop", value: 220 }, value: 220 },
        color: { condition: { test: "datum.isTop", value: "#FFBDBD" }, value: "#86B0BD" },
        stroke: { condition: { test: "datum.isTop", value: "#FFA4A4" }, value: "#3a6a75" },
        strokeWidth: { condition: { test: "datum.isTop", value: 2 }, value: 1 },
        tooltip: [
          { field: "LocationFull", title: "Location" },
          { field: "avg_rating", title: "Avg Rating", format: ".4f" },
          { field: "reviews", title: "Review Count", format: "," }
        ]
      }
    },
    {
      transform: [{ filter: "datum.isTop" }],
      mark: { type: "text", dx: 15, align: "left", baseline: "middle", fontSize: 12, fontWeight: "bold", color: "#FFA4A4" },
      encoding: {
        y: { field: "LocationFull", type: "nominal" },
        x: { field: "avg_rating", type: "quantitative" },
        text: { value: "Highest Rating" }
      }
    }
  ],
  config: { view: { stroke: null }, axis: { grid: false } }
};

vegaEmbed("#avg_rating_chart", avgRatingSpec, { actions: false }).catch(console.error);
