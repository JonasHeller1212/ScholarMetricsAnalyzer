export const metricInfo = {
  citations: {
    description: "Total number of times all publications have been cited by other works",
    pros: "Provides a direct and widely recognized measure of overall research impact across all publications.",
    cons: "Can be skewed by self-citations, field-specific citation patterns, and publication age.",
    link: "https://en.wikipedia.org/wiki/Citation_impact"
  },
  avgCitationsPerPaper: {
    description: "Mean number of citations across all publications (total citations divided by number of papers)",
    pros: "Normalizes impact across different publication counts and career lengths, enabling fair comparison between researchers.",
    cons: "Can be heavily skewed by a few highly-cited papers and doesn't show citation distribution.",
    link: "https://en.wikipedia.org/wiki/Citation_impact#Citations_per_paper"
  },
  citationGrowth: {
    description: "Average year-over-year percentage change in citations over the last three complete years, calculated using a weighted average that emphasizes recent growth.\n\nExample calculation:\nYear 1 (2021): 100 citations\nYear 2 (2022): 120 citations (+20%)\nYear 3 (2023): 150 citations (+25%)\nGrowth Rate = (20% + 25% + 25%) / 3 = +23.3%\n\nNegative example:\nYear 1 (2021): 200 citations\nYear 2 (2022): 180 citations (-10%)\nYear 3 (2023): 170 citations (-5.6%)\nGrowth Rate = (-10% + -5.6% + -5.6%) / 3 = -7.1%",
    pros: "• Focuses on recent impact trajectory\n• Uses multiple years to smooth out annual fluctuations\n• Excludes current incomplete year for accuracy\n• Provides clear growth trajectory indicator\n• Helps identify rising research influence",
    cons: "• May not reflect very recent publications\n• Sensitive to field citation patterns\n• Three-year window might miss longer patterns\n• Growth rates can be volatile for small citation counts",
    link: "https://en.wikipedia.org/wiki/Citation_impact#Citation_velocity"
  },
  peak: {
    description: "Highest annual citation count achieved throughout the researcher's career",
    pros: "Identifies periods of maximum influence and breakthrough research impact, helps track career milestones and research peaks.",
    cons: "Single-year metric that may reflect temporary spikes rather than sustained impact, can be influenced by individual highly-cited papers.",
    link: "https://en.wikipedia.org/wiki/Citation_impact#Citation_patterns"
  },
  trend: {
    description: "Citation trend analysis based on the last three complete years of data, calculated using a sophisticated algorithm that considers both absolute changes and relative growth rates.\n\nExample calculations:\n\nIncreasing trend:\nYear 1 (2021): 100 citations\nYear 2 (2022): 120 citations (+20%)\nYear 3 (2023): 150 citations (+25%)\nResult: 'Increasing' (avg. growth >5%)\n\nDecreasing trend:\nYear 1 (2021): 200 citations\nYear 2 (2022): 180 citations (-10%)\nYear 3 (2023): 170 citations (-5.6%)\nResult: 'Decreasing' (consistent decline)\n\nStable trend:\nYear 1 (2021): 150 citations\nYear 2 (2022): 155 citations (+3.3%)\nYear 3 (2023): 152 citations (-1.9%)\nResult: 'Stable' (changes within ±5%)",
    pros: "• Provides nuanced insight into recent research momentum\n• Uses multiple years to reduce noise and identify genuine trends\n• Considers both absolute and relative changes\n• Excludes current incomplete year to avoid bias\n• Helps identify emerging research leaders and sustained impact",
    cons: "• May not reflect very recent publications still accumulating citations\n• Field-specific citation patterns can affect interpretation\n• Three-year window might miss longer-term patterns\n• Doesn't account for publication volume changes",
    link: "https://en.wikipedia.org/wiki/Citation_impact#Citation_trends"
  },
  citationsPerYear: {
    description: "Average number of citations received per year, calculated by dividing the total number of citations by the number of years since the first publication.\n\nExample calculation:\nTotal citations: 1000\nFirst publication year: 2018\nCurrent year: 2024\nYears active: 6\nCitations per year = 1000 / 6 = 166.7",
    pros: "• Normalizes citation impact across different career lengths\n• Accounts for total research span\n• Useful for comparing researchers at different career stages\n• Shows sustained impact over time",
    cons: "• Can be skewed by highly-cited early papers\n• Doesn't show citation distribution over time\n• May underrepresent recent productivity changes\n• Assumes linear citation accumulation",
    link: "https://en.wikipedia.org/wiki/Citation_impact#Time-normalized_metrics"
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
  topCoAuthor: {
    description: "Most frequent co-author based on number of shared publications",
    pros: "Identifies strongest research collaborations and key research partnerships.",
    cons: "Doesn't reflect the impact or quality of the collaborative work.",
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