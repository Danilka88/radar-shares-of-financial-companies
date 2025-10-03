import { NewsArticle, AnalyzedNews, Sentiment, StockPoint, ForecastData } from '../../types';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

export const analyzeNewsWithOllama = async (articles: NewsArticle[]): Promise<AnalyzedNews[]> => {
    const articlesForPrompt = articles.map(({ id, headline, content }) => ({ id, headline, content: content.substring(0, 500) }));
    const prompt = `Analyze the sentiment of the following financial news articles. For each article, provide its original 'id', 'sentiment' (one of: 'Positive', 'Negative', 'Neutral'), and a brief 'summary' in Russian.\nArticles JSON:\n${JSON.stringify(articlesForPrompt)}\nRespond ONLY with a valid JSON array.`;

    try {
        const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL || 'gemma2:9b',
                format: 'json',
                messages: [{ role: 'user', content: prompt }],
                stream: false,
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API request failed with status ${response.status}`);
        }

        const result = await response.json();
        const analysisResults = JSON.parse(result.message.content);
        
        const articlesById = new Map(articles.map(article => [article.id, article]));

        return analysisResults.map((result: any) => {
            const originalArticle = articlesById.get(result.id);
            if (!originalArticle) return null;
            return { ...originalArticle, sentiment: result.sentiment, summary: result.summary };
        }).filter((article: AnalyzedNews | null): article is AnalyzedNews => article !== null);

    } catch (error) {
        console.error("Error analyzing news with Ollama:", error);
        throw new Error("Failed to analyze news with Ollama.");
    }
};

export const generateForecastWithOllama = async (ticker: string, stockData: StockPoint[], analyzedNews: AnalyzedNews[]): Promise<ForecastData> => {
    const recentStockData = stockData.slice(-30);
    const recentNews = analyzedNews.slice(0, 15);

    const prompt = `
        Act as a senior financial analyst. Based on the provided historical stock price data and recent news analysis for ticker ${ticker}, generate a 7-day price forecast.
        Historical Data (last 30 days):
        ${JSON.stringify(recentStockData)}
        Recent News Analysis:
        ${JSON.stringify(recentNews.map(n => ({ headline: n.headline, sentiment: n.sentiment, summary: n.summary })))}
        Your task:
        1. Analyze the price trend, volatility, and news sentiment.
        2. Generate a daily price forecast for the next 7 days.
        3. Provide a brief, insightful text analysis (2-3 sentences) in Russian explaining your forecast's logic.
        Respond ONLY with a valid JSON object with keys "forecast" (an array of 7 objects with date and price) and "analysis" (a string).
    `;

    try {
        const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL || 'gemma2:9b',
                format: 'json',
                messages: [{ role: 'user', content: prompt }],
                stream: false,
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API forecast request failed with status ${response.status}`);
        }

        const result = await response.json();
        const forecastResult: ForecastData = JSON.parse(result.message.content);

        if (!forecastResult.forecast || forecastResult.forecast.length !== 7 || !forecastResult.analysis) {
            throw new Error("Invalid forecast data structure from AI.");
        }

        return forecastResult;

    } catch (error) {
        console.error("Error generating forecast with Ollama:", error);
        throw new Error("Failed to generate forecast with Ollama.");
    }
};
