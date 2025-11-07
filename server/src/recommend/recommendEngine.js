import natural from "natural";
import stopword from "stopword";

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

/**
 * Extract keywords with stemming & stopword removal
 */
function extractKeywords(text) {
  if (!text) return [];
  let tokens = tokenizer.tokenize(text.toLowerCase());
  tokens = stopword.removeStopwords(tokens);
  tokens = tokens.map(t => stemmer.stem(t)); // normalize word forms
  return tokens.filter(t => /^[a-zA-Z]+$/.test(t));
}

/**
 * Compute similarity between two texts using TF-IDF and cosine similarity
 */
export function computeSimilarity(text1, text2) {
  const TfIdf = natural.TfIdf;
  const tfidf = new TfIdf();

  tfidf.addDocument(extractKeywords(text1).join(" "));
  tfidf.addDocument(extractKeywords(text2).join(" "));

  const vec1 = [];
  const vec2 = [];

  tfidf.listTerms(0).forEach(item => {
    vec1.push(item.tfidf);
    const term2 = tfidf.tfidf(item.term, 1);
    vec2.push(term2);
  });

  const dot = vec1.reduce((sum, v, i) => sum + v * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, v) => sum + v * v, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, v) => sum + v * v, 0));
  return mag1 && mag2 ? dot / (mag1 * mag2) : 0;
}

/**
 * Recommend top 5 jobs for a candidate based on profile + job data
 */
export function recommendJobs(candidate, jobs) {
  if (!candidate || !jobs?.length) return [];

  const candidateText = `
    ${(candidate.skills || []).join(" ")} 
    ${candidate.experience || ""} 
    ${candidate.education || ""}
  `;

  const scored = jobs.map(job => {
    // Give weight to skills and title
    const jobText = `
      ${(job.skills_required || []).join(" ")} 
      ${job.title || ""} 
      ${job.description || ""}
    `;

    const score = computeSimilarity(candidateText, jobText);
    return { job, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}
