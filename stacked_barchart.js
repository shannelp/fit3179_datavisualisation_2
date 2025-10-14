// vegalite_stacked.js
const stackedSpec = {
  $schema: "https://vega.github.io/schema/vega-lite/v6.json",
  description: "Stacked bar chart of review ratings across locations",
  title: {
    text: "Review Volume and Ratings in Malaysia",
    anchor: "middle",
    fontSize: 25,
    fontWeight: "bold",
    color: "#333333",
    subtitle: "Comparing total reviews and rating patterns across Malaysian states",
    subtitleFontSize: 16,
    subtitleColor: "#555555",
    offset: 50
  },
  data: {
    url: "https://raw.githubusercontent.com/shannelp/vegadata/refs/heads/main/food_ratings.csv"
  },
  width: "container",
  height: 480,
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
        x: { field: "Location", type: "nominal", axis: { labelAngle: 30 } },
        y: {
          field: "ReviewCount",
          type: "quantitative",
          title: "Number of Reviews",
          axis: { format: ",.0f" }
        },
        color: {
          condition: { test: "ratingDropdown != null", value: "#ffc5d3" },
          field: "Rating",
          type: "ordinal",
          title: "Rating (1–5)",
          scale: { scheme: "pastel1" }
        },
        tooltip: [
          { field: "Location", title: "Location" },
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
            { op: "distinct", field: "Location", as: "numLocations" }
          ]
        },
        {
          calculate: "datum.totalReviews / datum.numLocations",
          as: "avgPerLocation"
        }
      ],
      mark: {
        type: "rule",
        color: "#6ac293",
        strokeDash: [5, 3],
        strokeWidth: 2
      },
      encoding: {
        y: { field: "avgPerLocation", type: "quantitative" },
        tooltip: [
          {
            field: "avgPerLocation",
            title: "Average Value",
            format: ".2f"
          }
        ]
      }
    },

    // --- Label for average line ---
    {
      transform: [
        {
          aggregate: [
            { op: "sum", field: "ReviewCount", as: "totalReviews" },
            { op: "distinct", field: "Location", as: "numLocations" }
          ]
        },
        {
          calculate: "datum.totalReviews / datum.numLocations",
          as: "avgPerLocation"
        }
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
        x: { value: 500 }, // horizontally centered
        text: { value: "Average Rating Per Location" }
      }
    }
  ],
  config: {
    view: { stroke: null },
    legend: { orient: "right" },
    axis: { grid: false }
  },
  transform: [
    { filter: "!ratingDropdown || toNumber(datum.Rating) == ratingDropdown" },
    {
      aggregate: [{ op: "count", as: "ReviewCount" }],
      groupby: ["Location", "Rating"]
    }
  ]
};

vegaEmbed("#stacked_chart", stackedSpec, { actions: false }).catch(console.error);
