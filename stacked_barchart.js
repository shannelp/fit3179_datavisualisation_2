// stacked_barchart.js
const stackedSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Stacked bar chart of review ratings across locations",
  
  data: {
    url: "https://raw.githubusercontent.com/shannelp/vegadata/refs/heads/main/food_ratings.csv"
  },
  width: "container",
  height: 480,

  // ✅ Add this transform to rename abbreviations
  transform: [
    { filter: "!ratingDropdown || toNumber(datum.Rating) == ratingDropdown" },
    {
      calculate: "replace(replace(datum.Location, 'JB', 'Johor Bahru'), 'KL', 'Kuala Lumpur')",
      as: "LocationFull"
    },
    {
      aggregate: [{ op: 'count', as: 'ReviewCount' }],
      groupby: ['LocationFull', 'Rating']
    }
  ],

  params: [
    {
      name: "ratingDropdown",
      value: null,
      bind: {
        input: "select",
        options: [null, 1, 2, 3, 4, 5],
        labels: ["All", "1", "2", "3", "4", "5"],
        name: "Filter Rating: "
      }
    }
  ],

  layer: [
    // --- Main stacked bars ---
    {
      mark: "bar",
      encoding: {
        x: {
          field: "LocationFull",
          type: "nominal",
          axis: { labelAngle: 30, labelFontSize: 14, titleFontSize: 16, title: "Location" }
        },
        y: {
          field: "ReviewCount",
          type: "quantitative",
          title: "Number of Reviews",
          axis: { format: ",.0f", labelFontSize: 14, titleFontSize: 16 }
        },
        color: {
          condition: { test: "ratingDropdown != null", value: "#ffc5d3" },
          field: "Rating",
          type: "ordinal",
          title: "Rating (1–5)",
          scale: { scheme: "pastel1" }
        },
        tooltip: [
          { field: "LocationFull", title: "Location" },
          { field: "Rating", title: "Rating" },
          { field: "ReviewCount", title: "Number of Reviews", format: "," }
        ],
        opacity: {
          condition: { param: "ratingSelect", value: 1 },
          value: 0.3
        }
      },
      params: [
        {
          name: "ratingSelect",
          select: { type: "point", fields: ["Rating"] },
          bind: "legend"
        }
      ]
    },

    // --- Average line ---
    {
      transform: [
        {
          aggregate: [
            { op: "sum", field: "ReviewCount", as: "totalReviews" },
            { op: "distinct", field: "LocationFull", as: "numLocations" }
          ]
        },
        { calculate: "datum.totalReviews / datum.numLocations", as: "avgPerLocation" }
      ],
      mark: { type: "rule", color: "#6ac293", strokeDash: [5, 3], strokeWidth: 2 },
      encoding: {
        y: { field: "avgPerLocation", type: "quantitative" },
        tooltip: [{ field: "avgPerLocation", title: "Average Value", format: ",.2f" }]
      }
    },

    // --- Label for average line ---
    {
      transform: [
        {
          aggregate: [
            { op: "sum", field: "ReviewCount", as: "totalReviews" },
            { op: "distinct", field: "LocationFull", as: "numLocations" }
          ]
        },
        { calculate: "datum.totalReviews / datum.numLocations", as: "avgPerLocation" }
      ],
      mark: {
        type: "text",
        align: "center",
        baseline: "bottom",
        dy: -8,
        fontSize: 14,
        fontWeight: "bold",
        color: "#6ac293"
      },
      encoding: {
        y: { field: "avgPerLocation", type: "quantitative" },
        x: { value: 500 },
        text: { value: "Average Review Count Per Location" }
      }
    }
  ],

  config: {
    view: { stroke: null },
    legend: { orient: "right" },
    axis: { grid: false }
  }
};

vegaEmbed("#stacked_chart", stackedSpec, { actions: false }).catch(console.error);
