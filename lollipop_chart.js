// avg_rating_lollipop.js
const avgRatingSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Horizontal lollipop chart of average rating by location (manual highlights + population labels).",
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
    {
      // Manually highlight KL, JB, Penang
      calculate: "indexof(['Kuala Lumpur','Johor Bahru','Penang'], datum.LocationFull) >= 0",
      as: "isHighlighted"
    },
    {
      // Attach population labels for highlighted cities
      lookup: "LocationFull",
      from: {
        data: {
          values: [
            { LocationFull: "Kuala Lumpur", pop_label: "Highest population, ~1.9 million people" },
            { LocationFull: "Johor Bahru", pop_label: "Second highest population, ~1.1 million people" },
            { LocationFull: "Penang", pop_label: "Third highest population, ~740K people" }
          ]
        },
        key: "LocationFull",
        fields: ["pop_label"]
      }
    }
  ],
  height: 400,
  width: 400,
  layer: [
    {
      // Lollipop stem
      mark: { type: "rule", strokeWidth: 8 },
      encoding: {
        y: {
          field: "LocationFull",
          type: "nominal",
          sort: "-x",
          axis: { labelAngle: 0, labelFontSize: 14, titleFontSize: 16 }
        },
        x: {
          field: "avg_rating",
          type: "quantitative",
          scale: { domain: [4.0, 4.3], zero: false, nice: false },
          axis: { format: ".2f", tickCount: 7, labelAngle: 0, labelFontSize: 14, titleFontSize: 16 }
        },
        x2: { value: 4.0 },
        color: {
          condition: { test: "datum.isHighlighted", value: "#FFD1D1" },
          value: "#cfe8e4"
        }
      }
    },
    {
      // Lollipop head
      mark: { type: "circle" },
      encoding: {
        y: {
          field: "LocationFull",
          type: "nominal",
          sort: "-x",
          axis: { labelAngle: 0, labelFontSize: 14, titleFontSize: 16 }
        },
        x: {
          field: "avg_rating",
          type: "quantitative",
          title: "Average Food Rating",
          scale: { domain: [4.0, 4.3], zero: false, nice: false },
          axis: { format: ".2f", tickCount: 7, labelAngle: 0, labelFontSize: 12, titleFontSize: 14 }
        },
        size: { condition: { test: "datum.isHighlighted", value: 220 }, value: 220 },
        color: { condition: { test: "datum.isHighlighted", value: "#FFBDBD" }, value: "#86B0BD" },
        stroke: { condition: { test: "datum.isHighlighted", value: "#FFA4A4" }, value: "#3a6a75" },
        strokeWidth: { condition: { test: "datum.isHighlighted", value: 2 }, value: 1 },
        tooltip: [
          { field: "LocationFull", title: "Location" },
          { field: "avg_rating", title: "Avg Rating", format: ".4f" },
          { field: "reviews", title: "Review Count", format: "," }
        ]
      }
    },
    {
      // Population note for highlighted locations (only when label exists)
      transform: [{ filter: "datum.isHighlighted && isValid(datum.pop_label)" }],
      mark: {
        type: "text",
        dx: 15,
        align: "left",
        baseline: "middle",
        fontSize: 12,
        fontWeight: "bold",
        color: "#FFA4A4"
      },
      encoding: {
        y: { field: "LocationFull", type: "nominal", sort: "-x" },
        x: { field: "avg_rating", type: "quantitative" },
        text: { field: "pop_label", title: "Population" }
      }
    }
  ],
  config: { view: { stroke: null }, axis: { grid: false } }
};

vegaEmbed("#avg_rating_chart", avgRatingSpec, { actions: false }).catch(console.error);
