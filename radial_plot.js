// vegalite_business_sizes.js
const malaysiaFnbSizes = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Compact radial chart with top-right interactive legend and tooltips.",
  width: 700,
  height: 700,

  data: {
    url: "https://raw.githubusercontent.com/shannelp/vegadata/refs/heads/main/malaysia_fnb_points.csv",
    format: { type: "csv" }
  },

  title: {
    text: "Distribution of Food & Beverage Businesses in Malaysia",
    subtitle: "Grouped by business size range (based on F&B registration points)",
    fontSize: 20,
    subtitleFontSize: 13,
    subtitleColor: "#5e5e5e",
    anchor: "middle",
    dy: -10
  },

  // interactive legend (click to highlight)
  params: [
    {
      name: "sizeSelect",
      select: { type: "point", fields: ["size_clean"] },
      bind: "legend"
    }
  ],

  transform: [
    { calculate: "trim(datum.size)", as: "size_clean" },
    { filter: "datum.size_clean && datum.size_clean != '0'" },
    {
      aggregate: [{ op: "count", as: "business_count" }],
      groupby: ["size_clean"]
    }
  ],

  encoding: {
    theta: {
      field: "business_count",
      type: "quantitative",
      stack: true,
      title: "Number of Businesses"
    },
    radius: {
      field: "business_count",
      type: "quantitative",
      scale: { type: "sqrt", zero: true, rangeMin: 100, rangeMax: 280 },
      title: "Relative Size"
    },
    color: {
      field: "size_clean",
      type: "nominal",
      title: "Business Size Range",
      scale: { scheme: "pastel2" },
      sort: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1001-5000", "5001-10000"],
      legend: {
        orient: "top-right",
        direction: "vertical",
        columns: 1,
        titleFontSize: 12,
        labelFontSize: 11,
        symbolSize: 70,
        symbolType: "circle",
        padding: 4
      }
    },
    // dim non-selected categories via legend
    opacity: {
      condition: { param: "sizeSelect", value: 1 },
      value: 0.3
    },
    tooltip: [
      { field: "size_clean", title: "Size range" },
      { field: "business_count", title: "Businesses" }
    ]
  },

  mark: { type: "arc", innerRadius: 100, stroke: "#fff", opacity: 0.95 },

  config: {
    view: { stroke: null },
    background: "white",
    legend: { titleFontSize: 12, labelFontSize: 11 }
  }
};

// Mount it (change the selector to where you want it rendered)
vegaEmbed("#fnb_sizes", malaysiaFnbSizes, { actions: false }).catch(console.error);
