import { analyzeNewsWithOpenRouter, generateForecastWithOpenRouter } from './openrouter';
import { analyzeNewsWithOllama, generateForecastWithOllama } from './ollama';
import { analyzeNewsWithGemini, generateForecastWithGemini } from './gemini';
import { NewsArticle, AnalyzedNews, StockPoint, ForecastData, Sentiment } from '../../types';

// Primary function for news sentiment analysis with fallback logic
export const analyzeNews = async (articles: NewsArticle[]): Promise<AnalyzedNews[]> => {
    try {
        console.log("Attempting analysis with OpenRouter...");
        return await analyzeNewsWithOpenRouter(articles);
    } catch (error) {
        console.warn("OpenRouter failed, falling back to Ollama:", error);
        try {
            console.log("Attempting analysis with Ollama...");
            return await analyzeNewsWithOllama(articles);
        } catch (error) {
            console.warn("Ollama failed, falling back to Gemini:", error);
            try {
                console.log("Attempting analysis with Gemini...");
                return await analyzeNewsWithGemini(articles);
            } catch (error) {
                console.error("All LLM providers failed for news analysis:", error);
                // Final fallback to prevent app crash
                return articles.map(article => ({
                    ...article,
                    sentiment: Sentiment.Neutral,
                    summary: `AI analysis failed. (Mock summary)`
                }));
            }
        }
    }
};

// Primary function for price forecasting with fallback logic
export const generatePriceForecast = async (ticker: string, stockData: StockPoint[], analyzedNews: AnalyzedNews[]): Promise<ForecastData> => {
    try {
        console.log("Attempting forecast generation with OpenRouter...");
        return await generateForecastWithOpenRouter(ticker, stockData, analyzedNews);
    } catch (error) {
        console.warn("OpenRouter forecast failed, falling back to Ollama:", error);
        try {
            console.log("Attempting forecast generation with Ollama...");
            return await generateForecastWithOllama(ticker, stockData, analyzedNews);
        } catch (error) {
            console.warn("Ollama forecast failed, falling back to Gemini:", error);
            try {
                console.log("Attempting forecast generation with Gemini...");
                return await generateForecastWithGemini(ticker, stockData, analyzedNews);
            } catch (error) {
                console.error("Forecast generation failed with all available providers:", error);
                throw new Error("Failed to generate forecast.");
            }
        }
    }
};
