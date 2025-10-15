// fnb_growth.js
const malaysiaFnbGrowthSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Cumulative F&B businesses over time across all of Malaysia (no filtering).",
  title: {
    text: "Growth of Food & Beverage Businesses from 1990 to 2021",
    subtitle: "Cumulative and annual totals based on recorded entries in Malaysia",
    fontSize: 25,
    subtitleFontSize: 16,
    anchor: "center",
    color: "black",
    subtitleColor: "#5e5e5e"
  },
  width: "container",
  height: 500,

  config: {
    axis: { titleFontSize: 16, labelFontSize: 14 },
    axisX: { grid: false },
    axisY: { grid: false }
  },

  // Keep color and y scales independent across layers
  resolve: { scale: { color: "independent", y: "independent" } },

  data: {
    url: "https://raw.githubusercontent.com/shannelp/vegadata/main/malaysia_fnb_points.csv",
    format: { type: "csv" }
  },

  transform: [
    { filter: "isValid(datum.region) && datum.region !== ''" },
    { filter: "isValid(datum.founded) && toNumber(datum.founded) > 0" },
    { calculate: "toNumber(datum.founded)", as: "year" },
    { filter: "datum.year >= 1990 && datum.year <= 2021" },
    { aggregate: [{ op: "count", as: "n" }], groupby: ["region", "year"] }
  ],

  layer: [
    // --- Cumulative line ---
    {
      transform: [
        { aggregate: [{ op: "sum", field: "n", as: "totalN" }], groupby: ["year"] },
        { impute: "totalN", key: "year", value: 0 },
        {
          window: [{ op: "sum", field: "totalN", as: "cum_total" }],
          frame: [null, 0],
          sort: [{ field: "year", order: "ascending" }]
        },
        { calculate: "'Cumulative Businesses'", as: "type" }
      ],
      mark: { type: "line", strokeWidth: 3, point: false },
      encoding: {
        x: {
          field: "year",
          type: "ordinal",
          sort: "ascending",
          axis: {
            title: "Founded (Year)",
            format: "d",
            labelOverlap: "greedy",
            values: [1990, 1995, 2000, 2005, 2010, 2015, 2020] // aligned to data extent
          },
          scale: { padding: 0.05 }
        },
        y: {
          field: "cum_total",
          type: "quantitative",
          axis: { title: "Cumulative Businesses Founded" },
          scale: { domain: [0, 170] }
        },
        color: {
          field: "type",
          type: "nominal",
          scale: { domain: ["Cumulative Businesses"], range: ["#8D5F8C"] },
          legend: { title: "Metric" }
        },
        tooltip: [
          { field: "year", type: "ordinal", title: "Year" },
          { field: "cum_total", type: "quantitative", title: "Cumulative (All States)" }
        ]
      }
    },

    // --- Annual bars ---
    {
      transform: [
        { aggregate: [{ op: "sum", field: "n", as: "totalN" }], groupby: ["year"] },
        { impute: "totalN", key: "year", value: 0 },
        { calculate: "'Businesses Founded That Year'", as: "type" }
      ],
      mark: { type: "bar", opacity: 0.25 },
      encoding: {
        x: {
          field: "year",
          type: "ordinal",
          sort: "ascending",
          axis: { format: "d" },
          scale: { padding: 0.05 }
        },
        y: {
          field: "totalN",
          type: "quantitative",
          axis: { title: "Number of Businesses Founded By Year", orient: "right" },
          scale: { domain: [0, 18] }
        },
        color: {
          field: "type",
          type: "nominal",
          scale: { domain: ["Businesses Founded That Year"], range: ["#BADEB4"] },
          legend: { title: "" }
        },
        tooltip: [
          { field: "year", type: "ordinal", title: "Year" },
          { field: "totalN", type: "quantitative", title: "Businesses Founded that Year" }
        ]
      }
    }
  ]
};

// Mount into a container with id="fnb_growth"
vegaEmbed("#fnb_growth", malaysiaFnbGrowthSpec, { actions: false }).catch(console.error);
