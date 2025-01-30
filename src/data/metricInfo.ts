export const metricInfo = {
  citations: {
    description: "Total number of times all publications have been cited by other works",
    pros: "Provides a direct and widely recognized measure of overall research impact across all publications.",
    cons: "Can be skewed by self-citations, field-specific citation patterns, and publication age.",
    link: "https://en.wikipedia.org/wiki/Citation_impact"
  },
  citationsPerYear: {
    description: "Average number of citations received per year, calculated as total citations divided by career length",
    pros: "Normalizes citation impact across different career stages for fairer comparison between researchers.",
    cons: "May not accurately reflect current impact trends or account for field-specific citation patterns.",
    link: "https://en.wikipedia.org/wiki/Citation_impact#Time-normalized_impact"
  },
  acc5: {
    description: "Accumulated Citation Count for the last 5 years (ACC5), showing recent research impact",
    pros: "Captures recent research relevance and current impact in the field more accurately than lifetime metrics.",
    cons: "May undervalue seminal older works and disadvantage researchers with longer career histories.",
    link: "https://en.wikipedia.org/wiki/Citation_impact#Time_windows"
  },
  collaborationScore: {
    description: "Percentage of publications with multiple authors",
    pros: "Effectively measures research team integration and collaborative research tendency across publications.",
    cons: "Doesn't reflect individual contribution levels or the quality of collaborations.",
    link: "https://en.wikipedia.org/wiki/Scientific_collaboration"
  },
  coAuthors: {
    description: "Total number of unique co-authors across all publications",
    pros: "Demonstrates the breadth of research network and collaborative reach within the field.",
    cons: "May include one-time collaborations and doesn't indicate collaboration frequency or depth.",
  },
  soloAuthor: {
    description: "Percentage of publications where the researcher is the sole author",
    pros: "Clearly demonstrates independent research capability and individual scholarly contributions.",
    cons: "May suggest limited collaboration in fields where team science is increasingly important.",
  },
  averageAuthors: {
    description: "Mean number of authors per publication across all works",
    pros: "Provides insight into typical research team size and collaboration intensity patterns.",
    cons: "Doesn't reflect contribution levels or account for field-specific authorship conventions.",
    link: "https://en.wikipedia.org/wiki/Scientific_collaboration#Team_size"
  },
  hIndex: {
    description: "Number h of papers with at least h citations each",
    pros: "Balances productivity and impact while being robust to outliers and low-cited papers.",
    cons: "Disadvantages early career researchers and varies significantly across different fields.",
    link: "https://en.wikipedia.org/wiki/H-index"
  },
  gIndex: {
    description: "Largest number g where g most cited papers have at least g² citations in total",
    pros: "Better captures the impact of highly-cited papers while maintaining citation balance.",
    cons: "More complex to calculate and interpret than other citation metrics.",
    link: "https://en.wikipedia.org/wiki/G-index"
  },
  i10Index: {
    description: "Number of publications with at least 10 citations",
    pros: "Provides a simple and easily understood measure of consistent research impact.",
    cons: "Uses an arbitrary threshold and doesn't account for field-specific citation patterns.",
    link: "https://scholar.google.com/intl/en/scholar/metrics.html#metrics"
  },
  h5Index: {
    description: "h-index calculated using only publications from the last 5 years",
    pros: "Effectively captures recent research impact and current field influence.",
    cons: "May undervalue important older works and fluctuate more than career-spanning metrics.",
    link: "https://scholar.google.com/intl/en/scholar/metrics.html#metrics"
  },
  pubsPerYear: {
    description: "Average number of publications per year",
    pros: "Shows research productivity consistency and output level throughout career.",
    cons: "Doesn't reflect publication quality or account for varying career stage demands.",
    link: "https://en.wikipedia.org/wiki/Academic_publishing"
  }
};